import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPlanById } from '@/lib/pricing-plans';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');
    
    // Verificar webhook signature de Lemon Squeezy
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verificar signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(body);
    const digest = hmac.digest('hex');
    
    if (signature !== digest) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    
    // Procesar diferentes tipos de eventos
    switch (event.meta.event_name) {
      case 'order_created':
        await handleOrderCreated(event);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(event);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(event);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(event);
        break;
      default:
        console.log(`Unhandled webhook event: ${event.meta.event_name}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderCreated(event: any) {
  const { data } = event;
  const customData = data.attributes.first_order_item.product_options.custom;
  
  if (!customData?.user_id || !customData?.plan_id) {
    console.error('Missing custom data in order');
    return;
  }

  const userId = customData.user_id;
  const planId = customData.plan_id;
  const plan = getPlanById(planId);
  
  if (!plan) {
    console.error(`Plan not found: ${planId}`);
    return;
  }

  // Crear o actualizar suscripción
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planType: plan.interval === 'month' ? 'MONTHLY' : 'LIFETIME',
      status: 'ACTIVE',
      priceAmount: plan.price * 100, // Convertir a centavos
      currency: plan.currency,
      lemonSqueezyId: data.id,
      currentPeriodStart: new Date(),
      currentPeriodEnd: plan.interval === 'month' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
        : new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 años para lifetime
    },
    create: {
      userId,
      planType: plan.interval === 'month' ? 'MONTHLY' : 'LIFETIME',
      status: 'ACTIVE',
      priceAmount: plan.price * 100,
      currency: plan.currency,
      lemonSqueezyId: data.id,
      currentPeriodStart: new Date(),
      currentPeriodEnd: plan.interval === 'month' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`Subscription created/updated for user ${userId} with plan ${planId}`);
}

async function handleSubscriptionCreated(event: any) {
  // Similar a handleOrderCreated pero para suscripciones recurrentes
  await handleOrderCreated(event);
}

async function handleSubscriptionUpdated(event: any) {
  const { data } = event;
  const lemonSqueezyId = data.id;

  await prisma.subscription.updateMany({
    where: { lemonSqueezyId },
    data: {
      status: data.attributes.status === 'active' ? 'ACTIVE' : 'CANCELED',
      currentPeriodEnd: new Date(data.attributes.renews_at),
    },
  });

  console.log(`Subscription updated: ${lemonSqueezyId}`);
}

async function handleSubscriptionCancelled(event: any) {
  const { data } = event;
  const lemonSqueezyId = data.id;

  await prisma.subscription.updateMany({
    where: { lemonSqueezyId },
    data: {
      status: 'CANCELED',
      cancelAtPeriodEnd: true,
    },
  });

  console.log(`Subscription cancelled: ${lemonSqueezyId}`);
}