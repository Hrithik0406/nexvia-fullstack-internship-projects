import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAdminMetrics = async (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalVendors = await prisma.vendor.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    const orders = await prisma.order.findMany({
      select: { totalAmount: true, platformFee: true, createdAt: true },
    });

    const grossMarketplaceValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalCommissionEarned = orders.reduce((sum, o) => sum + o.platformFee, 0);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        items: {
          include: {
            vendor: { select: { storeName: true } },
          },
        },
      },
    });

    const vendors = await prisma.vendor.findMany({
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { products: true, orderItems: true } },
      },
    });

    return res.json({
      metrics: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        grossMarketplaceValue: Number(grossMarketplaceValue.toFixed(2)),
        totalCommissionEarned: Number(totalCommissionEarned.toFixed(2)),
      },
      recentOrders,
      vendors,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch admin metrics', error: error.message });
  }
};
