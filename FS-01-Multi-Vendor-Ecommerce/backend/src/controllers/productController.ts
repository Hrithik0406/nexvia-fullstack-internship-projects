import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, vendorId, search, minPrice, maxPrice, featured } = req.query;

    const where: any = {};

    if (category) {
      where.category = { slug: String(category) };
    }

    if (vendorId) {
      where.vendorId = String(vendorId);
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            storeName: true,
            logoUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
          : 4.8;
      return {
        ...p,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: p.reviews.length,
      };
    });

    return res.json(enriched);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            storeName: true,
            description: true,
            logoUrl: true,
          },
        },
        category: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 5.0;

    return res.json({
      ...product,
      rating: Number(avgRating.toFixed(1)),
      reviewCount: product.reviews.length,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return res.json(categories);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.user?.vendorId;
    if (!vendorId) {
      return res.status(403).json({ message: 'Only registered vendors can add products' });
    }

    const { title, description, price, comparePrice, stock, categoryId, imageUrl, isFeatured } = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock, 10) || 10,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        categoryId,
        vendorId,
        isFeatured: Boolean(isFeatured),
      },
      include: {
        category: true,
        vendor: true,
      },
    });

    return res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.vendorId;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user?.role !== 'ADMIN' && existing.vendorId !== vendorId) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this product' });
    }

    const { title, description, price, comparePrice, stock, categoryId, imageUrl, isFeatured } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(comparePrice !== undefined && { comparePrice: comparePrice ? parseFloat(comparePrice) : null }),
        ...(stock !== undefined && { stock: parseInt(stock, 10) }),
        ...(categoryId && { categoryId }),
        ...(imageUrl && { imageUrl }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.vendorId;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user?.role !== 'ADMIN' && existing.vendorId !== vendorId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};
