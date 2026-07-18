import { prisma } from '../src/index';

const PRODUCTS = [
  {
    id: "sculptural-blazer-01",
    slug: "sculptural-blazer-01",
    name: "Sculptural Blazer 01",
    category: "Outerwear",
    price: 540.00,
    currency: "€",
    color: "Obsidian Black",
    material: "420gsm Recycled Japanese Wool",
    description: "A study in architectural volume. Crafted from 420gsm recycled Japanese wool, this piece bridges the gap between traditional tailoring and modern streetwear silhouettes.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz8BbpTan9_p2brYKZWRVFkBsOyXmJmmRARvXfrZj0Wz1OmIn7XQ4cqgrsPmyIGlG6_N9kEzkt3fGx-FVV_tPIcuANnJMYhaXJytPDwjAlHUusZxwx3HFLlOs0OGe9Y2r5HkGr4fcGnj5t1Cj0L7bEmnMH12tDGVQsGdPohTIRJnbCQAFhwsrtp1C-pIezXOJ57eOdLWe2zQgVlAQM_QYZr3mIwv7DkFx5eDbQ7uD0rkIZA_A-_-iR",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJr77PmLH4AsDHxRQwv3ySL4ZvlGmkgWjf9fF5wBMDkN1HwIpEjrlaM77OlYBcQNVWH5Nv_fvjd7fRs3iXCXlpbozVDyhKrna2Maqh1z7ldYqWHPZox7I8SRqHKeKoJawrDVyiYb9Q2lLs4IM2CW7gVhZwLMoS1AX4-mt5LIPnaETgPVM8VDUlUVgx69SfAYVvgSHRVYu7sT4SR8_0UyLmL60mKD4MYSgVqD9rlZwU5jIhPnbuXu-",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzHAoZJG__dJJv5UIUkNUiawz6eLkdkqtifvFcjQlpeDeT9LCribpFh7E7quKXHepi-lmsqmV039famWNlVxIfIV1c9zqZic9s6nY43rK2srMBCnzAmOnds4eSV5BbtY0Ux5IsoWmQVnUcKCJ8zAT9TpipUlna2kZuUm82KbfxLtw_n5r0VbIDJnfvgJbIQRw59QShgpbsguT3tLHiOQhxANtt7KkXfOp6Dn7RAJ3goAizT99M_Q4n",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYzyqURxYDod4UG941N3rtbzlyadyD5HKcV1sX_tlqx-UUJVqcMbFz3Qe2Q5i7tJsC7WZjXyM24J3_KP-NV5JIRfX8Z6Bbn65Z3GZZgFOtv9CVijxFlKyd3ywghCsKiULEcCqjihkM4OPEXs5MWlKVo6oPpc6MvjQRiGwBp6ar1iNnWf_r5ALlNZgbzdfqZO8qKZyUC1ieDn_c16Alr2qv4wsDFE6PKBh2gMO-mtlE2COkAbmgyJFp"
    ],
    details: [
      "Oversized fit with drop shoulders",
      "Internal welt pockets",
      "Brushed metal hardware",
      "Made in Portugal"
    ],
    fabricCare: "100% Japanese Recycled Wool. Dry clean only. Iron at low temperature if necessary. Handle with care to preserve structural integrity.",
    shipping: "Complimentary express shipping on all orders over €500. Returns accepted within 14 days of delivery.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "structural-parka-01",
    slug: "structural-parka-01",
    name: "Structural Parka 01",
    category: "Outerwear",
    price: 420.00,
    currency: "$",
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
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "heritage-trousers",
    slug: "heritage-trousers",
    name: "Heritage Trousers",
    category: "Trousers",
    price: 315.00,
    currency: "$",
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
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "monolith-tote",
    slug: "monolith-tote",
    name: "Monolith Tote",
    category: "Accessories",
    price: 580.00,
    currency: "$",
    color: "Chocolate",
    material: "Calf Leather",
    description: "Close-up of a minimalist leather tote bag in a deep chocolate brown. The leather has a subtle grain and the handles are integrated into the body of the bag.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6I1AMck0MDp3iPykCSKMjotEHncoZ4wDc8MBWg83OGLWiutSBSUq7-iUlXsc4D-aGncHGib0gI7rbfzdUAt578SqAf4tJHDqIsqTwPdE_M-v10de4eBji77kVLz1YG0_WO8OXNiG-eNL636W0TGEZTCovtUXTZJv31-9PWWX0Y8vX8M4YRYTbjhtNKCXtGXXEYcyihzIrzJRRf8QwpDGwhXTX8gU9LZ2C25wFG_dWkBIPLyMzK_GF"
    ],
    details: [
      "Full grain calf leather",
      "Integrated shoulder straps",
      "Internal zip pocket organizer",
      "Embossed brand mark"
    ],
    fabricCare: "Natural Leather. Avoid prolonged moisture contact. Clean with dry soft cloth.",
    shipping: "Complimentary shipping over $500. Returns accepted within 14 days.",
    sizes: ["O/S"]
  },
  {
    id: "archive-overcoat",
    slug: "archive-overcoat",
    name: "Archive Overcoat",
    category: "Outerwear",
    price: 840.00,
    currency: "$",
    color: "Charcoal",
    material: "Virgin Wool",
    description: "Studio product shot of a high-end black wool overcoat on a minimalist white background. Flat lay, perfectly centered. The focus is on the clean silhouette and premium button details.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-4QB5i6XDMG83_zXujwGOUle46Rxb7NxMOJZUEFOEPSZ0oCZfYvvLmtvublReY4UA9bPzQXtzgAOsoZLHdXsuB2y2xz6gYyejBCS7LL3dRsGiqoDn2RKnOG5F_VNVwJtZz17Ss63TwseOrEvCo9fBL_SxMLbsE5Qy2xa7VNKT31CaJi-Mg5KjQv7hb4vf3EcoYHbFkk19av3GRbTjkWqfL7oqoTJWEicgO7y1kEk21mmPfJDz-VRc"
    ],
    details: [
      "Single-breasted button closure",
      "Heavyweight raw virgin wool",
      "Vent back detail",
      "Viscose inner lining"
    ],
    fabricCare: "100% Virgin Wool. Dry clean only. Handle with care.",
    shipping: "Complimentary express shipping on all orders. Returns accepted within 14 days.",
    sizes: ["S", "M", "L"]
  },
  {
    id: "pleated-trousers",
    slug: "pleated-trousers",
    name: "Pleated Trousers",
    category: "Trousers",
    price: 320.00,
    currency: "$",
    color: "Black",
    material: "Mid-weight Cotton",
    description: "Studio shot of tailored black trousers with a subtle pressed crease. Minimalist aesthetic, soft high-key lighting, focused on the quality of the tailoring.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1dYOX7n_w1Z_i_cHcpxzac2NNGrPap4sUSTM_MXMp9Xjt1MZA_Rwv8n2wqXFu_nOryYYOyGE_CjVATxJp4u0F0IJ-SHWyHyTxmaQ7jthAimk11DlnmzMIjUd1W2nu6m1QZELYII-6v23BbGQmMERHwR4u7_OMJ2oY94YS6asMWDVkBAFBXGD_cBBFR7bVEq14a1bDlIaD-zureMfTfAsFO-CebjPMTIhHfeC80Vb7-RMTjias9Ohn"
    ],
    details: [
      "Pressed crease styling",
      "Concealed zipper hook fly",
      "Tailored fit with crop leg",
      "Dual rear welt pockets"
    ],
    fabricCare: "100% Cotton. Wash warm. Iron at medium setting.",
    shipping: "Standard shipping on all orders. Returns accepted within 14 days.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "system-tote",
    slug: "system-tote",
    name: "System Tote",
    category: "Accessories",
    price: 560.00,
    currency: "$",
    color: "Black",
    material: "Grained Leather",
    description: "Close up shot of a minimalist black leather tote bag with subtle silver hardware. High-end product photography on a grey textured background.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCB2HI2Da29AsB9tzrnzIRF7I5xrc7QsK9c7S6m79YEVhJHu4oYS8BXwNZF1ijCm4ZDtrQiKQ-z_RK_2NnKdvPmgZmTYyZ7R6jD4Utl_GC_JP1VGts7P_-WrW0uS5itTdi0kcmbFe5sLbAxB-JcZ6AMAY8VeQcbhkdFJPiKv3NTX87jUv3o2T6Ka-tupUjiQs81vxYx7cSKEOxiO4q3hugx0nBrzQ1sXO0xQbzr7u5msZ-v1T6K_h03"
    ],
    details: [
      "Structured grained calfskin",
      "Silver-finished metal hardware",
      "Double carry handle",
      "Internal key slot holder"
    ],
    fabricCare: "Grained Leather. Avoid water. Clean with specialist leather cream.",
    shipping: "Complimentary shipping on orders over $500.",
    sizes: ["O/S"]
  },
  {
    id: "sculpted-wool-overcoat",
    slug: "sculpted-wool-overcoat",
    name: "Sculpted Wool Overcoat",
    category: "Outerwear",
    price: 1250.00,
    currency: "$",
    color: "Obsidian Black",
    material: "Japanese Wool",
    description: "High-fashion studio editorial shot of a minimalist black oversized wool overcoat. The lighting is dramatic and sharp, highlighting the premium texture of the fabric. Stoic and architectural.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpfh3la5ToTn36X2cApDcdo-UKVS2O2YeP2jPE07yLXiF2_c2dQK5ozunBQarOxgaoxdjLiOPxELI-F2YuAApXz9JUR4ig8oqYMpV3jJk4vViUOYb4aaN9wSTY1LdL2YQYD0hc81UBTswnGBA3WHicWRON7KDoY4_VMLMTw4xNXJL8_XXaujc1wSaEL3QCITrDj11iZaE3TJlkwiKmpG-fKhi3tsrNiykIF1jF-fRMIAm_30X3wY0X"
    ],
    details: [
      "Aggressive oversized shoulder frame",
      "Asymmetric front alignment",
      "Seamless side-seam pockets",
      "Draped back panels"
    ],
    fabricCare: "100% Recycled Japanese Wool. Specialist dry clean only.",
    shipping: "Complimentary worldwide express shipping. 14 days returns.",
    sizes: ["S", "M", "L"]
  },
  {
    id: "heavy-gauge-knit",
    slug: "heavy-gauge-knit",
    name: "Heavy Gauge Knit",
    category: "Knitwear",
    price: 680.00,
    currency: "$",
    color: "Parchment",
    material: "Japanese Knit Cotton-Wool",
    description: "A close-up fashion photography shot of a cream-colored, heavy-gauge Japanese knit sweater. The texture of the yarn is intricate and clearly visible under soft, diffused window light.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNzrvha3rfPg-YElKIe56U87FmGW7elLLeVnl4_gakTIu6v-vsJDMXCpSx-arHLBZKx0pyBlaIOdt2xKU_8Y_yWc3Rwb3X7YvJmRJ5j3KS23LAYuC9NPGic6wM0XJxeb-1gu-DmaGdPIvMf4DrYogTaLY-axkBKkACzdHcA96FXjmLNyEzzoiAvcu4-sHW74HB_zshfNsHi_3Pah29VIJ_K6p7mqbK4Ljt7-ym46zGgevVWEqyRIEh"
    ],
    details: [
      "Coarse knit rib structure",
      "Dropped armholes for soft volume",
      "Crewneck collar detail",
      "Rolled edge hem finish"
    ],
    fabricCare: "70% Cotton, 30% Japanese Wool. Hand wash cold. Dry flat only.",
    shipping: "Complimentary express shipping on orders over $500.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "pleated-wide-trouser",
    slug: "pleated-wide-trouser",
    name: "Pleated Wide Trouser",
    category: "Trousers",
    price: 420.00,
    currency: "$",
    color: "Charcoal",
    material: "Premium Wool Blend",
    description: "Editorial lookbook image of wide-leg tailored trousers in a dark charcoal gray. High contrast, fluid drape, and clean architectural silhouette.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKsO-TLT4kycwpRKXZB9zV0UDkcHc-bV0r8G6Z8p47Ln1iMOpqXHd2jtAQYvnKXNhfBpuzNRfwIOT9MQ4Q8gbnkPbIBQGDfFgui3c3Wqhqcy9DE8mVYUFRyVOKQbSM-eXTG4e0syYhDmlTyIlLNlh7ya7rY8oMuACTnuHhHxLl8AePes652LVyBFnTrGi85c_LNx6tRkO5rlBtsN02gX6SxfN05XNs0pTQg4me2qQH6DojHaYZ7x54"
    ],
    details: [
      "Deep double front pleats",
      "Wide-leg straight silhouette",
      "Side pocket detail lines",
      "Concealed tab closure"
    ],
    fabricCare: "Wool Blend. Dry clean only. Warm iron.",
    shipping: "Complimentary standard shipping on all orders.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "large-architecture-tote",
    slug: "large-architecture-tote",
    name: "Large Architecture Tote",
    category: "Accessories",
    price: 890.00,
    currency: "$",
    color: "Matte Black",
    material: "Calfskin Leather",
    description: "Minimalist accessory product shot of a premium black leather tote bag with subtle silver hardware. Placed on a raw concrete pedestal. Center balanced composition.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdL46urw6bAuQN68ebe72mPrU5qqS93N2lbk1ugaI_NzfeBClEyYkwXOo8u_BLBy0ZOwkzqTJ3J-XBSwsG7DloSRoStNBbdluhtgxMjQCUWSVbskdO1qapZdAl7Pu89E2P1rrvBdQdhczeXlmg1Hf16_oq5mt734zCgF9MesNsk_IONHpP4yf1x0l5vm5p3yIlDf5GVrOjbb6LcN_GL_wUMNTfFI55qBf5grz-Nykzhn7zoCWbLlAc"
    ],
    details: [
      "Heavy calfskin construction",
      "Raw unfinished interior face",
      "Internal hardware key hook",
      "Structured base studs"
    ],
    fabricCare: "Premium Leather. Avoid prolonged sun and moisture.",
    shipping: "Complimentary express shipping. 14 days returns.",
    sizes: ["O/S"]
  },
  {
    id: "technical-utility-vest",
    slug: "technical-utility-vest",
    name: "Technical Utility Vest",
    category: "Accessories",
    price: 550.00,
    currency: "$",
    color: "Concrete",
    material: "Ripstop Technical Fabric",
    description: "A portrait-style editorial fashion shot of a model wearing a structured technical vest over a white poplin shirt. Monochromatic color story, streetwear utility feel.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtJMxKm-pZxk4dIsOTuhbkVvRex5p7aLGJofJqDbi-0zY9WKU3fmo4Kmzpzy81wc_nNgKMRO0FpWHznseEdpo16o5OKf-VASBGT_o5xiPH2th-4nQtPltxWq1NTMobuAg8sZ9jbusY52szr0-yh32e_Xo1FRKqKgpYf2bx8gLQlsJxlAPUDBiPq3EAd-QkQD3bbcLUdpjx67yF9gag_Dkvw4ZytnjTrqJNml97B0z8SFXCrLk1q_kV"
    ],
    details: [
      "Technical ripstop nylon",
      "Front slide buckle harness",
      "Dual cargo utility pouches",
      "D-ring attachment tabs"
    ],
    fabricCare: "Technical synthetics. Hand wash cold. Do not dry clean.",
    shipping: "Complimentary standard shipping on all orders.",
    sizes: ["S", "M", "L"]
  },
  {
    id: "raw-denim-chore",
    slug: "raw-denim-chore",
    name: "Raw Denim Chore",
    category: "Outerwear",
    price: 340.00,
    currency: "$",
    color: "Deep Indigo",
    material: "Raw Japanese Denim",
    description: "High-contrast studio shot of a raw denim chore jacket in deep indigo. Stiff architectural fabric drape with white contrast stitching.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgAzk4DVxyYzOQPdxvR4zxx0UPKbwxGR8paaJhkvwz9_BwHf5zuXnW3URvHz7221Wh12zVFILuleKAeWMXwY8EljFHuwqpIrvyZVBX1zd7U4hOBcDSClE6CkdFjLf1-EBXUq3DQ3dhyP0TitNZiJziabtCUFj97S3Rszl2IvfiQfapxvCu1RfGfTNqZ9A8roau0eigK878wfV_xtBnLqTFeagRXtCrOkqefpG5vWwK6a_iEBmPsxZ1"
    ],
    details: [
      "Unwashed stiff Japanese denim",
      "Triple contrast needle stitch",
      "Front patch chore pockets",
      "Custom brand metal buttons"
    ],
    fabricCare: "100% Raw Denim. Wash separately inside out. Indigo bleeding is expected.",
    shipping: "Standard shipping on all orders. Returns in 14 days.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "pleated-trouser-04",
    slug: "pleated-trouser-04",
    name: "Pleated Trouser 04",
    category: "Trousers",
    price: 280.00,
    currency: "€",
    color: "Charcoal Wool",
    material: "Wool Blend Blend",
    description: "Minimalist product shot of wide-leg charcoal trousers made from a premium wool blend. Clean lines and heavy drape of the fabric. Modern European streetwear aesthetic.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTiUh0ZCF2Eg3znogu8mnQnTWRl5wwPoFjYA5P4OSf-PWd90cKFBVGUyBm9xl-Zar1LHf6QNi9gCauFER23Ynd9lmJ8KpCPxc9knacnIgZtraD_ZErraBjlqycRaJqMYM0-Qxujg78wo73SDl8ndU4um3riIL3vKf0ppw4E8RyocFSh4obbgYR-ezbDklxW1qojI5O_NmccowisZwWE1iLhJ4-xpnpx2gZWNNMRGiMSQ2m4ZpxzOwX"
    ],
    details: [
      "Tailored waist lining",
      "Front pleated folds",
      "Side slip pockets",
      "Wide-leg design profile"
    ],
    fabricCare: "Wool Blend. Dry clean only.",
    shipping: "Standard shipping on all orders.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "heavy-cotton-tee",
    slug: "heavy-cotton-tee",
    name: "Heavy Cotton Tee",
    category: "Knitwear",
    price: 95.00,
    currency: "€",
    color: "Optic White",
    material: "300gsm Organic Pima Cotton",
    description: "Close-up lifestyle shot of a high-quality white pima cotton t-shirt with a structured neckband. Soft yet holds its shape. Neutral tones and a sense of luxury through simplicity.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfSLNQftPqgXbALjK48KEKYbOyC9NEkreDQ8P21xgkGA2IQRzkz_N6XgL36GZ2vswN6VIwsk9-MEJxwLmTfIKiKWfroduAwVIwkprZruXOTVxF-ERf40Zp32OU7ZeImhe2IZwYhfycI13eDnGEGkTwHa2sXS4QmyyS2LigG5ljEKPElyA9QVxDtif9siRyGM-xqVF5WEiWFJAlSNgNs5pwwkKA3PJVxo4RSJM4nu5rDcdkQQIM1gUH"
    ],
    details: [
      "300gsm heavy organic cotton",
      "Thick rib-knit mock neck collar",
      "Split hem side seams",
      "Relaxed boxy fit cut"
    ],
    fabricCare: "100% Organic Pima Cotton. Machine wash cold, air dry.",
    shipping: "Standard shipping on all orders.",
    sizes: ["XS", "S", "M", "L", "XL"]
  }
];

async function main() {
  console.log('Seeding products into database...');
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log('Product seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during product seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
