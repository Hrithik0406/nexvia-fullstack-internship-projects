import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for FS-01 Multi-Vendor E-Commerce...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexvia.com',
      password: hashedPassword,
      name: 'Nexvia Platform Admin',
      role: 'ADMIN',
    },
  });

  // 2. Create Vendors
  const vendorUser1 = await prisma.user.create({
    data: {
      email: 'sales@apexelectronics.com',
      password: hashedPassword,
      name: 'Vikram Mehta',
      role: 'VENDOR',
      vendorProfile: {
        create: {
          storeName: 'Apex Tech & Audio',
          description: 'Premium headphones, mechanical keyboards, and high-performance computing gadgets.',
          logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
          commissionRate: 10.0,
          balance: 4250.0,
          totalSales: 47200.0,
        },
      },
    },
    include: { vendorProfile: true },
  });

  const vendorUser2 = await prisma.user.create({
    data: {
      email: 'hello@urbanaura.com',
      password: hashedPassword,
      name: 'Ananya Sharma',
      role: 'VENDOR',
      vendorProfile: {
        create: {
          storeName: 'Urban Aura Lifestyle',
          description: 'Minimalist sustainable apparel, artisan leather goods, and premium workspace decor.',
          logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
          commissionRate: 12.0,
          balance: 3180.0,
          totalSales: 26500.0,
        },
      },
    },
    include: { vendorProfile: true },
  });

  // 3. Create Customer
  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      password: hashedPassword,
      name: 'Hrithik Sarkar',
      role: 'CUSTOMER',
    },
  });

  // 4. Create Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: 'Electronics & Audio',
      slug: 'electronics',
      description: 'Noise canceling headphones, mechanical keyboards, and cutting-edge tech.',
      icon: 'Headphones',
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      name: 'Apparel & Accessories',
      slug: 'fashion',
      description: 'Modern minimalist streetwear and everyday lifestyle essentials.',
      icon: 'Shirt',
    },
  });

  const catWorkstation = await prisma.category.create({
    data: {
      name: 'Desk & Workspace',
      slug: 'workspace',
      description: 'Ergonomic accessories, oak desk pads, and cable management setups.',
      icon: 'Monitor',
    },
  });

  // 5. Create Products
  const products = [
    {
      title: 'Apex SonicPro Wireless ANC Headphones',
      description: 'Active Noise Cancellation with 40mm beryllium drivers, 38-hour battery life, and plush memory foam cushions.',
      price: 189.99,
      comparePrice: 229.99,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      categoryId: catElectronics.id,
      vendorId: vendorUser1.vendorProfile!.id,
      isFeatured: true,
    },
    {
      title: 'Apex Nova-84 Hot-Swappable Mechanical Keyboard',
      description: '75% layout, custom factory-lubed linear switches, PBT shine-through keycaps, and full RGB backlighting.',
      price: 129.50,
      comparePrice: 159.00,
      stock: 28,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      categoryId: catElectronics.id,
      vendorId: vendorUser1.vendorProfile!.id,
      isFeatured: true,
    },
    {
      title: 'Apex Studio Wireless Precision Mouse',
      description: 'Dual-mode Bluetooth & 2.4GHz wireless ergonomics, precision 4000 DPI sensor, and silent magnetic scroll wheel.',
      price: 64.99,
      comparePrice: 79.99,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      categoryId: catElectronics.id,
      vendorId: vendorUser1.vendorProfile!.id,
      isFeatured: false,
    },
    {
      title: 'Urban Aura Heavyweight Organic Cotton Hoodie',
      description: '450 GSM French Terry brushed interior, double-needle stitching, and preshrunk premium boxy silhouette.',
      price: 79.00,
      comparePrice: 95.00,
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      categoryId: catFashion.id,
      vendorId: vendorUser2.vendorProfile!.id,
      isFeatured: true,
    },
    {
      title: 'Urban Aura Artisan Veg-Tanned Leather Tote',
      description: 'Handcrafted full-grain Italian leather with brass hardware, fits up to a 16-inch MacBook Pro.',
      price: 145.00,
      comparePrice: 180.00,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      categoryId: catFashion.id,
      vendorId: vendorUser2.vendorProfile!.id,
      isFeatured: false,
    },
    {
      title: 'Minimalist Felt & Walnut Desk Mat (Extended)',
      description: 'High-density Merino wool blend with natural anti-slip rubber base. Shields your desktop with unmatched elegance.',
      price: 39.99,
      comparePrice: 49.99,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      categoryId: catWorkstation.id,
      vendorId: vendorUser2.vendorProfile!.id,
      isFeatured: true,
    },
  ];

  for (const p of products) {
    const createdProduct = await prisma.product.create({ data: p });

    // Add a review
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        comment: 'Super fast delivery and the build quality exceeds expectations!',
      },
    });
  }

  // 6. Create a Demo Multi-Vendor Order (Items from both Vendor 1 and Vendor 2)
  const productA = await prisma.product.findFirst({ where: { vendorId: vendorUser1.vendorProfile!.id } });
  const productB = await prisma.product.findFirst({ where: { vendorId: vendorUser2.vendorProfile!.id } });

  if (productA && productB) {
    const totalAmount = productA.price + productB.price;
    const feeA = productA.price * 0.10;
    const feeB = productB.price * 0.12;
    const totalPlatformFee = feeA + feeB;

    await prisma.order.create({
      data: {
        orderNumber: 'NEX-ORD-109283',
        customerId: customer.id,
        totalAmount,
        platformFee: totalPlatformFee,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        shippingAddress: 'Flat 402, Green Glen Heights, Hitec City, Hyderabad',
        contactPhone: '+91 9876543210',
        items: {
          create: [
            {
              productId: productA.id,
              vendorId: productA.vendorId,
              quantity: 1,
              unitPrice: productA.price,
              totalPrice: productA.price,
              vendorCut: productA.price - feeA,
              status: 'SHIPPED',
            },
            {
              productId: productB.id,
              vendorId: productB.vendorId,
              quantity: 1,
              unitPrice: productB.price,
              totalPrice: productB.price,
              vendorCut: productB.price - feeB,
              status: 'PROCESSING',
            },
          ],
        },
      },
    });
  }

  console.log('✅ Database seeded successfully with multi-vendor accounts, products, and split-payment transactions!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
