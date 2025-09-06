import { TeacherForm } from '@/components/TeacherForm';

export default function NewTeacherPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">Crear Nuevo Perfil de Profesor</h1>
        <TeacherForm />
      </div>
    </main>
  );
}
