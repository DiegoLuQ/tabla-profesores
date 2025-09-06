import { getTeachers } from '@/lib/data';
import { TeachersTable } from '@/components/TeachersTable';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function ProfesoresTablaPage() {
  const teachers = await getTeachers();

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Tabla de Profesores</h1>
        <Button asChild>
          <Link href="/profesores/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Profesor
          </Link>
        </Button>
      </div>
      <TeachersTable teachers={teachers} />
    </main>
  );
}
