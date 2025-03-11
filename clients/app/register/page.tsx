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
  confirmPassword: z.string(),
  fullName: z.string().optional(),
  email: z.string().email('Adresse email invalide').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  // Initialisation du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
    },
  });

  // Soumission du formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      await register(
        values.username,
        values.password,
        values.fullName || undefined,
        values.email || undefined
      );
      toast.success('Inscription réussie');
      router.push('/');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-gray-500 mt-2">
            Inscrivez-vous pour accéder à Easy Order
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez votre nom complet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez votre adresse email" {...field} />
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirmez votre mot de passe"
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
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 