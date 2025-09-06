'use server';

import { z } from 'zod';
import { createTeacherData, deleteTeacherData, updateTeacherData } from './data';
import { revalidatePath } from 'next/cache';

const TeacherSchema = z.object({
  nombre_completo: z.string({invalid_type_error: "Please enter a valid name."}).min(3, { message: 'El nombre debe tener al menos 3 caracteres.'}),
  email: z.string().email({ message: 'Email inválido.' }),
  curso: z.string().min(1, { message: 'El curso es requerido.' }),
  asignaturas: z.array(z.string()).min(1, { message: 'Añade al menos una asignatura.' }),
  colegios: z.array(z.string()).min(1, { message: 'Añade al menos un colegio.' }),
});

export async function createTeacher(data: z.infer<typeof TeacherSchema>) {
  const validatedFields = TeacherSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid teacher data.');
  }

  await createTeacherData(validatedFields.data);
  revalidatePath('/profesores');
}

export async function updateTeacher(id: string, data: z.infer<typeof TeacherSchema>) {
  const validatedFields = TeacherSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid teacher data.');
  }

  await updateTeacherData(id, validatedFields.data);
  revalidatePath('/profesores');
  revalidatePath(`/profesores/${id}`);
  revalidatePath(`/profesores/${id}/edit`);
}

export async function deleteTeacher(id: string) {
    if(!id) throw new Error("ID is required");
    await deleteTeacherData(id);
    revalidatePath('/profesores');
}
