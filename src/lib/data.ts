import type { Teacher } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const API_URL = 'http://localhost:8000'; // URL base del backend de FastAPI

export async function getTeachers(): Promise<Teacher[]> {
  noStore();
  try {
    const response = await fetch(`${API_URL}/teachers`, {
      cache: 'no-store', // Asegura que los datos sean siempre frescos
    });
    if (!response.ok) {
      throw new Error('Error al obtener los profesores desde la API');
    }
    const teachers = await response.json();
    return teachers;
  } catch (error) {
    console.error('Error en getTeachers:', error);
    return []; // Devolver un array vacío en caso de error
  }
}

export async function getTeacherById(id: string): Promise<Teacher | undefined> {
  noStore();
  try {
    const response = await fetch(`${API_URL}/teachers/${id}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      if (response.status === 404) {
        return undefined; // El profesor no fue encontrado
      }
      throw new Error(`Error al obtener el profesor con id ${id}`);
    }
    const teacher = await response.json();
    return teacher;
  } catch (error) {
    console.error('Error en getTeacherById:', error);
    return undefined;
  }
}

export async function createTeacherData(data: Omit<Teacher, 'id'>): Promise<Teacher> {
  noStore();
  try {
    const response = await fetch(`${API_URL}/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error al crear profesor:', errorBody);
      throw new Error('No se pudo crear el profesor.');
    }

    const newTeacher = await response.json();
    return newTeacher;
  } catch (error) {
    console.error('Error en createTeacherData:', error);
    throw new Error('Error de red o de la API al crear el profesor.');
  }
}

export async function updateTeacherData(id: string, data: Partial<Omit<Teacher, 'id'>>): Promise<Teacher | undefined> {
  noStore();
  try {
    const response = await fetch(`${API_URL}/teachers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error al actualizar profesor:', errorBody);
      throw new Error(`No se pudo actualizar el profesor con id ${id}.`);
    }

    const updatedTeacher = await response.json();
    return updatedTeacher;
  } catch (error) {
    console.error('Error en updateTeacherData:', error);
    throw new Error('Error de red o de la API al actualizar el profesor.');
  }
}

export async function deleteTeacherData(id: string): Promise<void> {
  noStore();
  try {
    const response = await fetch(`${API_URL}/teachers/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok && response.status !== 204) {
      const errorBody = await response.json();
      console.error('Error al eliminar profesor:', errorBody);
      throw new Error(`No se pudo eliminar el profesor con id ${id}.`);
    }
    // No se espera contenido en una respuesta 204, por lo que no se parsea el JSON.
  } catch (error) {
    console.error('Error en deleteTeacherData:', error);
    throw new Error('Error de red o de la API al eliminar el profesor.');
  }
}
