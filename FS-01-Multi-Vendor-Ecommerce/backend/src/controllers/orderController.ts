import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ message: 'User must be logged in to checkout' });
    }

    const { items, shippingAddress, contactPhone } = req.body;
    // items: Array<{ productId: string; quantity: number }>

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Retrieve all products to verify prices & calculate vendor splits
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { vendor: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    let totalPlatformFee = 0;

    const orderItemsData: any[] = [];
    const vendorSalesUpdate: { [vendorId: string]: { sales: number; cut: number } } = {};

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }

      const itemTotal = product.price * item.quantity;
      const commissionRate = product.vendor.commissionRate || 10.0;
      const commissionAmount = (itemTotal * commissionRate) / 100;
      const vendorCut = itemTotal - commissionAmount;

      totalAmount += itemTotal;
      totalPlatformFee += commissionAmount;

      orderItemsData.push({
        productId: product.id,
        vendorId: product.vendorId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
        vendorCut,
        status: 'PROCESSING',
      });

      if (!vendorSalesUpdate[product.vendorId]) {
        vendorSalesUpdate[product.vendorId] = { sales: 0, cut: 0 };
      }
      vendorSalesUpdate[product.vendorId].sales += itemTotal;
      vendorSalesUpdate[product.vendorId].cut += vendorCut;
    }

    const orderNumber = `NEX-ORD-${Date.now().toString().slice(-6)}`;

    // Use transaction to create order, order items, update stock & vendor balances
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          totalAmount,
          platformFee: totalPlatformFee,
          status: 'PROCESSING',
          paymentStatus: 'PAID',
          shippingAddress: shippingAddress || '123 Tech Avenue, Hyderabad, Telangana',
          contactPhone: contactPhone || '+91 9876543210',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
              vendor: { select: { id: true, storeName: true } },
            },
          },
        },
      });

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Update vendor balance & total sales
      for (const [vendorId, update] of Object.entries(vendorSalesUpdate)) {
        await tx.vendor.update({
          where: { id: vendorId },
          data: {
            balance: { increment: update.cut },
            totalSales: { increment: update.sales },
          },
        });
      }

      return order;
    });

    return res.status(201).json({
      message: 'Order placed successfully with automatic vendor payment split',
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
            vendor: { select: { id: true, storeName: true, logoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getVendorOrders = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.user?.vendorId;
    if (!vendorId) {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { vendorId },
      include: {
        order: {
          include: {
            customer: { select: { id: true, name: true, email: true } },
          },
        },
        product: true,
      },
      orderBy: { order: { createdAt: 'desc' } },
    });

    return res.json(orderItems);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch vendor orders' });
  }
};

export const updateOrderItemStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const vendorId = req.user?.vendorId;

    const item = await prisma.orderItem.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    if (req.user?.role !== 'ADMIN' && item.vendorId !== vendorId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await prisma.orderItem.update({
      where: { id },
      data: { status },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update order status' });
  }
};
