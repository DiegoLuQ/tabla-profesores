import { getTeachers } from '@/lib/data';
import { TeacherCard } from '@/components/TeacherCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, UserPlus } from 'lucide-react';

export default async function ProfesoresPage() {
  const teachers = await getTeachers();

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Panel de Profesores</h1>
      </div>

      {teachers.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card mt-8">
          <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">No hay profesores todavía</h2>
          <p className="text-muted-foreground mt-2">Empieza añadiendo tu primer profesor al sistema.</p>
          <Button asChild className="mt-6">
            <Link href="/profesores/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Profesor
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
