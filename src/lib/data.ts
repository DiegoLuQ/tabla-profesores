import type { Teacher } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

// In-memory store for teachers
let teachers: Teacher[] = [
  {
    id: '1',
    nombre_completo: 'Ana Martínez',
    asignaturas: ['Matemáticas', 'Física'],
    colegios: ['Colegio Cervantes', 'Liceo Bicentenario'],
    curso: '3º Medio',
    email: 'ana.martinez@example.com',
  },
  {
    id: '2',
    nombre_completo: 'Carlos Rodríguez',
    asignaturas: ['Historia', 'Lenguaje'],
    colegios: ['Escuela San Pedro'],
    curso: '8º Básico',
    email: 'carlos.rodriguez@example.com',
  },
  {
    id: '3',
    nombre_completo: 'Luisa Fernández',
    asignaturas: ['Química', 'Biología', 'Ciencias Naturales'],
    colegios: ['Instituto Nacional', 'Colegio Alemán'],
    curso: '4º Medio',
    email: 'luisa.fernandez@example.com',
  },
];

// Simulate DB latency
const randomDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

export async function getTeachers(): Promise<Teacher[]> {
  noStore();
  await randomDelay();
  return teachers;
}

export async function getTeacherById(id: string): Promise<Teacher | undefined> {
  noStore();
  await randomDelay();
  return teachers.find(t => t.id === id);
}

export async function createTeacherData(data: Omit<Teacher, 'id'>): Promise<Teacher> {
  noStore();
  await randomDelay();
  const newTeacher: Teacher = {
    id: crypto.randomUUID(),
    ...data,
  };
  teachers.unshift(newTeacher);
  return newTeacher;
}

export async function updateTeacherData(id: string, data: Partial<Omit<Teacher, 'id'>>): Promise<Teacher | undefined> {
  noStore();
  await randomDelay();
  const index = teachers.findIndex(t => t.id === id);
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...data };
    return teachers[index];
  }
  return undefined;
}

export async function deleteTeacherData(id: string): Promise<void> {
  noStore();
  await randomDelay();
  teachers = teachers.filter(t => t.id !== id);
}
