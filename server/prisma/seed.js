const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@shoeking.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@shoeking.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });
  console.log("Admin created:", admin.email);

  // Sample products
  const products = [
    { name: "Air Max Pro", description: "Premium running shoe", price: 120, salePrice: 95, category: "Running", gender: "men", brand: "Nike", stock: 50, images: [], sizes: ["40","41","42","43","44"], colors: ["black","white"], isNew: true, isSale: true },
    { name: "Classic Canvas", description: "Everyday sneaker", price: 65, category: "Casual", gender: "unisex", brand: "Converse", stock: 80, images: [], sizes: ["36","37","38","39","40","41"], colors: ["red","blue","black"], isNew: false, isSale: false },
    { name: "Trail Blazer", description: "Outdoor hiking boot", price: 180, category: "Hiking", gender: "women", brand: "Merrell", stock: 30, images: [], sizes: ["36","37","38","39"], colors: ["brown","green"], isNew: true, isSale: false },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log("Sample products seeded!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
