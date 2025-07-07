'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(true);

  const plan = searchParams.get('plan');
  const amount = searchParams.get('amount');
  const interval = searchParams.get('interval');

  useEffect(() => {
    // Simular procesamiento del pago
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoToAdmin = () => {
    router.push('/admin');
  };

  const handleGoToOnboarding = () => {
    router.push('/onboarding');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <CardTitle className="text-2xl">Procesando Pago...</CardTitle>
            <CardDescription>
              Estamos confirmando tu pago con Lemon Squeezy
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">¡Pago Exitoso!</CardTitle>
          <CardDescription>
            Tu suscripción ha sido activada correctamente
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Detalles del plan */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              {interval === 'lifetime' ? (
                <Crown className="w-5 h-5 text-purple-500" />
              ) : (
                <Zap className="w-5 h-5 text-orange-500" />
              )}
              <h3 className="font-semibold">
                {interval === 'lifetime' ? 'Plan Pro (Lifetime)' : 'Plan Mensual'}
              </h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${amount} {interval === 'month' ? '/mes' : 'una vez'}
            </p>
            {interval === 'lifetime' && (
              <p className="text-sm text-gray-600 mt-1">
                ¡Acceso de por vida desbloqueado!
              </p>
            )}
          </div>

          {/* Información de la cuenta */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold">Tu Landing Page</h3>
            </div>
            <p className="text-sm text-orange-800 mb-2">Tu sitio web:</p>
            <p className="font-mono text-orange-600">
              {session?.user?.subdomain}.solvik.app
            </p>
          </div>

          {/* Próximos pasos */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">¿Qué sigue?</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ Tu cuenta está activada</p>
              <p>✅ Puedes crear tu landing page</p>
              <p>✅ Soporte 24/7 disponible</p>
              {interval === 'lifetime' && (
                <p>✅ Acceso de por vida garantizado</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button 
              onClick={handleGoToOnboarding}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Crear Mi Landing Page
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
            
            <Button 
              onClick={handleGoToAdmin}
              variant="outline"
              className="w-full"
            >
              Ir Directo al Panel
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>📧 Recibirás un email de confirmación</p>
            <p>🛡️ Garantía de 30 días incluida</p>
            <p>💳 Procesado por Lemon Squeezy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}