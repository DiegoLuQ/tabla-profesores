import { TeacherForm } from '@/components/TeacherForm';
import { getTeacherById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EditTeacherPage({ params }: { params: { id: string } }) {
  const teacher = await getTeacherById(params.id);

  if (!teacher) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">Editar Perfil de Profesor</h1>
        <TeacherForm teacher={teacher} />
      </div>
    </main>
  );
}
