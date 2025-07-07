'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, MessageSquare, ArrowRight } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.userId);
        setStep('otp');
      } else {
        setError(data.error || 'Error al enviar código');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        whatsappNumber,
        otpCode,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/admin');
      } else {
        setError('Código de verificación inválido');
      }
    } catch (error) {
      setError('Error de verificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Ingresa tu número de WhatsApp para continuar'
              : 'Ingresa el código que enviamos a tu WhatsApp'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+1234567890"
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Incluye el código de país (ej: +1 para USA)
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700" 
                disabled={loading || !whatsappNumber}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Enviar Código por WhatsApp
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp">Código de Verificación</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="mt-1 text-center text-2xl tracking-widest"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Código de 6 dígitos enviado a {whatsappNumber}
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700" 
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verificando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Verificar Código
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('phone');
                  setOtpCode('');
                  setError('');
                }}
              >
                Cambiar Número
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}