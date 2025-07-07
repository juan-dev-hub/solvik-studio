import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPlanById } from '@/lib/pricing-plans';
import { z } from 'zod';

const createCheckoutSchema = z.object({
  planId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = createCheckoutSchema.parse(body);

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
    }

    // En desarrollo, simulamos la creación del checkout
    // En producción, aquí usarías la API real de Lemon Squeezy
    
    const mockCheckoutUrl = `https://checkout.lemonsqueezy.com/buy/${plan.lemonSqueezyVariantId}?checkout[email]=${session.user.email}&checkout[custom][user_id]=${session.user.id}&checkout[custom][plan_id]=${planId}`;

    // Para desarrollo, redirigimos a una página de éxito simulada
    const developmentCheckoutUrl = `/payments/success?plan=${planId}&amount=${plan.price}&interval=${plan.interval}`;

    return NextResponse.json({
      checkoutUrl: process.env.NODE_ENV === 'production' ? mockCheckoutUrl : developmentCheckoutUrl
    });

    // CÓDIGO REAL PARA PRODUCCIÓN (comentado para desarrollo):
    /*
    const lemonSqueezyApiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

    const checkoutResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lemonSqueezyApiKey}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
            },
            checkout_data: {
              email: session.user.email,
              custom: {
                user_id: session.user.id,
                plan_id: planId,
              },
            },
            product_options: {
              enabled_variants: [plan.lemonSqueezyVariantId],
              redirect_url: `${process.env.NEXTAUTH_URL}/payments/success`,
              receipt_link_url: `${process.env.NEXTAUTH_URL}/admin`,
              receipt_thank_you_note: 'Gracias por tu compra. Tu landing page está lista.',
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: plan.lemonSqueezyVariantId,
              },
            },
          },
        },
      }),
    });

    if (!checkoutResponse.ok) {
      throw new Error('Error creating Lemon Squeezy checkout');
    }

    const checkoutData = await checkoutResponse.json();
    const checkoutUrl = checkoutData.data.attributes.url;

    return NextResponse.json({ checkoutUrl });
    */

  } catch (error) {
    console.error('Create checkout error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}