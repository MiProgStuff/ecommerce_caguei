// Automatic sequential discount engine — direct port of the tier algorithm
// supplied by the business. Do not "fix" the overflow behavior below (falling
// through all tiers resets to the anchor state via recursion, discarding any
// remainder) — that's the specified behavior, not a bug.

const TAXA_IVA_DEFAULT = 0.23;
const PERCENTAGENS_DESCONTO = [0.3, 0.45, 0.6, 0.8];

interface Patamar {
  patamarIndex: number;
  descontoPercentual: number;
  precoFinal: number;
  precoSemIVA: number;
  unidadesAlocadas: number;
  label: string;
}

interface TabelaPatamares {
  precoOriginalRiscado: number;
  patamares: Patamar[];
}

function calcularPatamaresDesconto(
  precoMercado: number,
  taxaIVA: number = TAXA_IVA_DEFAULT
): TabelaPatamares {
  const precoBaseLoja = precoMercado * 10;

  const patamares: Patamar[] = [];
  let precoSemIVAPeriodoAnterior = precoBaseLoja / (1 + taxaIVA);

  PERCENTAGENS_DESCONTO.forEach((descontoPercentual, index) => {
    const unidadesNoPatamar = precoSemIVAPeriodoAnterior / precoMercado;

    const precoComDesconto = precoBaseLoja * (1 - descontoPercentual);
    const precoSemIVA = precoComDesconto / (1 + taxaIVA);

    patamares.push({
      patamarIndex: index + 1,
      descontoPercentual: descontoPercentual * 100,
      precoFinal: Number(precoComDesconto.toFixed(2)),
      precoSemIVA: Number(precoSemIVA.toFixed(2)),
      unidadesAlocadas: Math.floor(unidadesNoPatamar),
      label: descontoPercentual === 0.8 ? 'Liquidação' : `-${descontoPercentual * 100}%`,
    });

    precoSemIVAPeriodoAnterior = precoSemIVA;
  });

  return {
    precoOriginalRiscado: Number(precoBaseLoja.toFixed(2)),
    patamares,
  };
}

export interface EstadoProduto {
  precoExibicao: number;
  precoOriginalRiscado: number | null;
  labelDesconto: string | null;
  unidadesRestantesNoPatamar?: number;
  fase: string;
}

export function obterEstadoAtualProduto(
  precoMercado: number,
  vendasAcumuladasCiclo: number
): EstadoProduto {
  const dados = calcularPatamaresDesconto(precoMercado);

  // Venda 0: Peça vendida ao Preço de Loja Inicial (sem desconto)
  if (vendasAcumuladasCiclo === 0) {
    return {
      precoExibicao: dados.precoOriginalRiscado,
      precoOriginalRiscado: null,
      labelDesconto: null,
      fase: 'Preço Base (Âncora)',
    };
  }

  let vendasRestantes = vendasAcumuladasCiclo - 1; // 1ª venda foi ao preço total

  for (const patamar of dados.patamares) {
    if (vendasRestantes < patamar.unidadesAlocadas) {
      return {
        precoExibicao: patamar.precoFinal,
        precoOriginalRiscado: dados.precoOriginalRiscado,
        labelDesconto: patamar.label,
        unidadesRestantesNoPatamar: patamar.unidadesAlocadas - vendasRestantes,
        fase: `Patamar ${patamar.patamarIndex} (${patamar.label})`,
      };
    }
    vendasRestantes -= patamar.unidadesAlocadas;
  }

  // Se ultrapassar o último patamar (80%), o ciclo reinicia
  return obterEstadoAtualProduto(precoMercado, 0);
}

interface ProductPricingInput {
  price: number;
  costPrice: number | null;
  originalPrice: number | null;
  promoPrice: number | null;
  discountLabel: string | null;
  isPromoActive: boolean;
  autoDiscountEnabled: boolean;
  cycleSalesCount: number;
}

export interface ResolvedPricing {
  price: number;
  originalPrice: number | null;
  promoPrice: number | null;
  discountLabel: string | null;
  isPromoActive: boolean;
}

// Overlays the automatic discount engine's current tier on top of a raw
// Product row. Falls back untouched to the manual promo fields whenever the
// engine is off (or costPrice isn't set) — that's the manual system built
// separately, unaffected by this one.
export function resolveProductPricing(product: ProductPricingInput): ResolvedPricing {
  if (product.autoDiscountEnabled && product.costPrice) {
    const estado = obterEstadoAtualProduto(product.costPrice, product.cycleSalesCount);

    if (estado.precoOriginalRiscado === null) {
      return {
        price: estado.precoExibicao,
        originalPrice: null,
        promoPrice: null,
        discountLabel: null,
        isPromoActive: false,
      };
    }

    return {
      price: estado.precoOriginalRiscado,
      originalPrice: estado.precoOriginalRiscado,
      promoPrice: estado.precoExibicao,
      discountLabel: estado.labelDesconto,
      isPromoActive: true,
    };
  }

  return {
    price: product.price,
    originalPrice: product.originalPrice,
    promoPrice: product.promoPrice,
    discountLabel: product.discountLabel,
    isPromoActive: product.isPromoActive,
  };
}
