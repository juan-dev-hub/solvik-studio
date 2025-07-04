export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'lifetime';
  features: string[];
  popular?: boolean;
  lemonSqueezyVariantId?: string; // ID del producto en Lemon Squeezy
}

export const PRICING_PLANS: PricingPlan[] = [
  // Plan Mensual Global
  {
    id: 'monthly_global',
    name: 'Plan Mensual',
    price: 9,
    currency: 'USD',
    interval: 'month',
    lemonSqueezyVariantId: 'monthly_variant_id', // Reemplazar con ID real
    features: [
      'Landing page profesional',
      '3 idiomas automáticos (ES, EN, FI)',
      'Subdominio .solvik.app',
      'Hosting ultra-rápido incluido',
      'Formulario de contacto avanzado',
      'Soporte 24/7',
      'SSL gratuito',
      'Actualizaciones automáticas'
    ]
  },
  
  // Plan Lifetime Global
  {
    id: 'lifetime_global',
    name: 'Plan Pro (Lifetime)',
    price: 97,
    currency: 'USD',
    interval: 'lifetime',
    popular: true,
    lemonSqueezyVariantId: 'lifetime_variant_id', // Reemplazar con ID real
    features: [
      'Todo lo del plan mensual',
      'Pago único - Sin mensualidades'
    ]
  }
];

export function getAllPlans() {
  return PRICING_PLANS;
}

export function getPlanById(id: string) {
  return PRICING_PLANS.find(plan => plan.id === id);
}

export function calculateSavings(monthlyPrice: number, lifetimePrice: number) {
  const breakEvenMonths = Math.ceil(lifetimePrice / monthlyPrice);
  const yearSavings = (monthlyPrice * 12) - lifetimePrice;
  
  return {
    breakEvenMonths,
    yearSavings,
    percentageSavings: Math.round((yearSavings / (monthlyPrice * 12)) * 100)
  };
}