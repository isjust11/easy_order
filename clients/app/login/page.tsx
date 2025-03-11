'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';

// Schéma de validation
const formSchema = z.object({
  username: z.string().min(3, 'Nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().min(6, 'Mot de passe doit contenir au moins 6 caractères'),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Initialisation du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Soumission du formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      await login(values.username, values.password);
      toast.success('Connexion réussie');
      router.push('/');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-gray-500 mt-2">
            Connectez-vous à votre compte Easy Order
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez votre nom d'utilisateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 