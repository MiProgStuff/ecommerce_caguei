import { prisma } from '../src/index';
import { PermissionAction } from '@prisma/client';

const PRODUCTS = [
  {
    id: "sculptural-blazer-01",
    slug: "sculptural-blazer-01",
    name: "Sculptural Blazer 01",
    category: "Outerwear",
    price: 540.00,
    currency: "EUR",
    color: "Obsidian Black",
    material: "420gsm Recycled Japanese Wool",
    description: "A study in architectural volume. Crafted from 420gsm recycled Japanese wool, this piece bridges the gap between traditional tailoring and modern streetwear silhouettes.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz8BbpTan9_p2brYKZWRVFkBsOyXmJmmRARvXfrZj0Wz1OmIn7XQ4cqgrsPmyIGlG6_N9kEzkt3fGx-FVV_tPIcuANnJMYhaXJytPDwjAlHUusZxwx3HFLlOs0OGe9Y2r5HkGr4fcGnj5t1Cj0L7bEmnMH12tDGVQsGdPohTIRJnbCQAFhwsrtp1C-pIezXOJ57eOdLWe2zQgVlAQM_QYZr3mIwv7DkFx5eDbQ7uD0rkIZA_A-_-iR",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJr77PmLH4AsDHxRQwv3ySL4ZvlGmkgWjf9fF5wBMDkN1HwIpEjrlaM77OlYBcQNVWH5Nv_fvjd7fRs3iXCXlpbozVDyhKrna2Maqh1z7ldYqWHPZox7I8SRqHKeKoJawrDVyiYb9Q2lLs4IM2CW7gVhZwLMoS1AX4-mt5LIPnaETgPVM8VDUlUVgx69SfAYVvgSHRVYu7sT4SR8_0UyLmL60mKD4MYSgVqD9rlZwU5jIhPnbuXu-"
    ],
    details: [
      "Oversized fit with drop shoulders",
      "Internal welt pockets",
      "Brushed metal hardware",
      "Made in Portugal"
    ],
    fabricCare: "100% Japanese Recycled Wool. Dry clean only. Iron at low temperature if necessary. Handle with care to preserve structural integrity.",
    shipping: "Complimentary express shipping on all orders over €500. Returns accepted within 14 days of delivery.",
    sizes: ["XS", "S", "M", "L"],
    stock: 12
  },
  {
    id: "structural-parka-01",
    slug: "structural-parka-01",
    name: "Structural Parka 01",
    category: "Outerwear",
    price: 420.00,
    currency: "EUR",
    color: "Matte Black",
    material: "Technical Tech Nylon",
    description: "Studio product shot of a minimalist black technical parka. The garment features clean lines, waterproof zippers, and a matte finish. Shot against a warm-white background with subtle shadows to define the shape.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiwiUulVteH77I8_lipgFmAh0patUZxn_QOkhAPUklxE4CIuOyHVLOAgByWEkZ5xGIynf8ZL00hhcbOdGSV4WD8wTH6XXeDCnmV5yT6RWosgNJaoLQS5bl6yGFqrMXpDYAIlrIjHA2DzcFw5BUvYeH8rgAiJ_SYlFAqqLESUiKzRrRZY7untl38MM2mCUSDIvXzLSPrWQlZEQowcZz3ZFmODGKPhKQHRY6EtF0gkzPDSwsRtv29jCU"
    ],
    details: [
      "Waterproof tech zippers",
      "Structured storm hood",
      "Concealed utility pockets",
      "Adjustable cuffs and hem"
    ],
    fabricCare: "100% Tech Nylon. Machine wash cold on delicate cycle. Air dry only. Do not iron.",
    shipping: "Complimentary standard shipping on all orders. Returns accepted within 14 days of delivery.",
    sizes: ["S", "M", "L", "XL"],
    stock: 8
  },
  {
    id: "heritage-trousers",
    slug: "heritage-trousers",
    name: "Heritage Trousers",
    category: "Trousers",
    price: 315.00,
    currency: "EUR",
    color: "Oatmeal",
    material: "Virgin Wool Blend",
    description: "Editorial product photography of a pair of high-waisted, wide-leg wool trousers in light oatmeal color. The drape of the fabric is highlighted by soft side-lighting. Minimalist presentation.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8I_FM5eqO32IvSaZC4QbFZ3EmZu_oIUmv3tLLB3dDhQ4Q9DeLfZZb65cdccE8gzTfKbvVYnxppCCCzxtaiOe_cPybAE44k8WARFvg0xfAMTQKAgwvFZfCb_4xOc7LCqOjNrgnkmgOB2Qan5HfHfxHqEHzPrE9Jije-OHffzMQtTfEbkXhMu74ND0pZN6gcrwHg1UOm9O4DraocriJRz2cALemt8RkZQrz9xPWGxCqGDhDUYbBFs0q"
    ],
    details: [
      "High-waisted fit",
      "Wide-leg drape silhoutte",
      "Side slip pockets",
      "Tailored waist detailing"
    ],
    fabricCare: "Virgin Wool Blend. Dry clean only. Iron at low temperature.",
    shipping: "Complimentary standard shipping on all orders. Returns accepted within 14 days.",
    sizes: ["XS", "S", "M", "L"],
    stock: 15
  }
];

async function main() {
  console.log('1. Seeding products into database...');
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log('Product seeding completed.');

  console.log('2. Seeding resources, permissions, and roles...');
  
  // Define Resources & Actions
  const resources = ['products', 'orders', 'users', 'analytics', 'settings'];
  const actions: PermissionAction[] = ['READ', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'EXECUTE'];

  // Upsert all Permissions
  const permissionsMap: Record<string, string> = {};
  for (const resource of resources) {
    for (const action of actions) {
      const perm = await prisma.permission.upsert({
        where: {
          resource_action: { resource, action },
        },
        update: {},
        create: { resource, action },
      });
      permissionsMap[`${resource}:${action}`] = perm.id;
    }
  }
  console.log('Permissions seeded.');

  // Create standard roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Platform creator. Unlimited administrative permissions.' },
    { name: 'ADMIN', description: 'Catalog manager and staff manager.' },
    { name: 'SUPPORT_AGENT', description: 'Fulfill customer orders and support communications.' },
    { name: 'CUSTOMER', description: 'Standard buyer privileges.' },
  ];

  const dbRoles: Record<string, any> = {};
  for (const roleDef of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: { description: roleDef.description },
      create: roleDef,
    });
    dbRoles[roleDef.name] = role;
  }
  console.log('Roles seeded.');

  // Clear existing role permissions for idempotency
  await prisma.rolePermission.deleteMany({});

  // Associate RolePermissions
  const rpPayloads: { roleId: string; permissionId: string }[] = [];

  // SUPER_ADMIN gets all permissions
  const allPermissionIds = Object.values(permissionsMap);
  allPermissionIds.forEach((pid) => {
    rpPayloads.push({ roleId: dbRoles['SUPER_ADMIN'].id, permissionId: pid });
  });

  // ADMIN gets read/write on products & orders, read on users & analytics
  const adminPermKeys = [
    'products:READ', 'products:CREATE', 'products:UPDATE', 'products:DELETE',
    'orders:READ', 'orders:UPDATE',
    'users:READ',
    'analytics:READ'
  ];
  adminPermKeys.forEach((key) => {
    if (permissionsMap[key]) {
      rpPayloads.push({ roleId: dbRoles['ADMIN'].id, permissionId: permissionsMap[key] });
    }
  });

  // SUPPORT_AGENT gets read on products & orders, update on orders
  const supportPermKeys = [
    'products:READ',
    'orders:READ', 'orders:UPDATE'
  ];
  supportPermKeys.forEach((key) => {
    if (permissionsMap[key]) {
      rpPayloads.push({ roleId: dbRoles['SUPPORT_AGENT'].id, permissionId: permissionsMap[key] });
    }
  });

  // CUSTOMER gets read on products
  const customerPermKeys = ['products:READ'];
  customerPermKeys.forEach((key) => {
    if (permissionsMap[key]) {
      rpPayloads.push({ roleId: dbRoles['CUSTOMER'].id, permissionId: permissionsMap[key] });
    }
  });

  // Bulk create role permissions
  await prisma.rolePermission.createMany({
    data: rpPayloads,
    skipDuplicates: true,
  });
  console.log('RolePermissions relations seeded.');

  // Link existing database users to their matching Role
  const devEmail = 'soumyamishra2099@gmail.com';
  const devUser = await prisma.user.findUnique({
    where: { email: devEmail },
  });

  if (devUser) {
    await prisma.user.update({
      where: { email: devEmail },
      data: {
        roleId: dbRoles['SUPER_ADMIN'].id,
        role: 'SUPER_ADMIN', // Keep string role in sync
      },
    });
    console.log(`Linked dev user ${devEmail} to SUPER_ADMIN Role.`);
  }
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
