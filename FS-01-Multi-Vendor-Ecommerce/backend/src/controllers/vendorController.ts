import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getVendors = async (_req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { isApproved: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return res.json(vendors);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch vendors' });
  }
};

export const getVendorDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.user?.vendorId;
    if (!vendorId) {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        products: {
          include: {
            category: true,
          },
        },
        orderItems: {
          include: {
            order: true,
            product: true,
          },
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    const totalOrders = vendor.orderItems.length;
    const pendingOrders = vendor.orderItems.filter((i) => i.status === 'PROCESSING').length;
    const deliveredOrders = vendor.orderItems.filter((i) => i.status === 'DELIVERED').length;

    return res.json({
      vendor,
      stats: {
        balance: vendor.balance,
        totalSales: vendor.totalSales,
        totalProducts: vendor.products.length,
        totalOrders,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch vendor dashboard' });
  }
};
