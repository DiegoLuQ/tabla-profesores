'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { Teacher } from '@/lib/definitions';
import { createTeacher, updateTeacher } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Textarea } from './ui/textarea';

const FormSchema = z.object({
  nombre_completo: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  curso: z.string().min(1, 'El curso es requerido.'),
  asignaturas: z.string().min(1, 'Añade al menos una asignatura.'),
  colegios: z.string().min(1, 'Añade al menos un colegio.'),
});

type FormValues = z.infer<typeof FormSchema>;

export function TeacherForm({ teacher }: { teacher?: Teacher }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nombre_completo: teacher?.nombre_completo ?? '',
      email: teacher?.email ?? '',
      curso: teacher?.curso ?? '',
      asignaturas: teacher?.asignaturas.join(', ') ?? '',
      colegios: teacher?.colegios.join(', ') ?? '',
    },
  });

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const processedData = {
        ...data,
        asignaturas: data.asignaturas.split(',').map(s => s.trim()).filter(Boolean),
        colegios: data.colegios.split(',').map(s => s.trim()).filter(Boolean),
      };

      try {
        if (teacher) {
          await updateTeacher(teacher.id, processedData);
          toast({ title: 'Éxito', description: 'Profesor actualizado correctamente.' });
          router.push(`/profesores/${teacher.id}`);
        } else {
          await createTeacher(processedData);
          toast({ title: 'Éxito', description: 'Profesor creado correctamente.' });
          router.push('/profesores');
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Algo salió mal. Por favor, inténtalo de nuevo.',
        });
      }
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Ej: juan.perez@colegio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="curso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 5º Básico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="asignaturas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignaturas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Matemáticas, Ciencias, Historia" {...field} />
                  </FormControl>
                  <FormDescription>
                    Escribe las asignaturas separadas por comas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colegios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colegios Anteriores</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Colegio San José, Liceo Nacional" {...field} />
                  </FormControl>
                  <FormDescription>
                    Escribe los colegios separados por comas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (teacher ? 'Guardando...' : 'Creando...') : (teacher ? 'Guardar Cambios' : 'Crear Profesor')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
