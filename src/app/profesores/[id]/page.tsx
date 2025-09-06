import { getTeacherById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pen } from 'lucide-react';
import Link from 'next/link';
import { DeleteTeacherButton } from '@/components/DeleteTeacherButton';
import { EnhanceProfile } from '@/components/EnhanceProfile';
import { Separator } from '@/components/ui/separator';

export default async function TeacherDetailPage({ params }: { params: { id: string } }) {
  const teacher = await getTeacherById(params.id);

  if (!teacher) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-4 -ml-4">
          <Link href="/profesores">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la lista
          </Link>
        </Button>
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-headline">{teacher.nombre_completo}</CardTitle>
                <CardDescription className="mt-1">{teacher.email}</CardDescription>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/profesores/${teacher.id}/edit`}><Pen className="mr-2 h-4 w-4" />Editar</Link>
                </Button>
                <DeleteTeacherButton id={teacher.id} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="font-semibold text-lg">Curso</h3>
                    <p className="text-muted-foreground">{teacher.curso}</p>
                </div>
            </div>
            
            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3">Asignaturas</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.asignaturas.map((subject) => (
                  <Badge key={subject} variant="default">{subject}</Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Colegios Anteriores</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.colegios.map((school) => (
                  <Badge key={school} variant="secondary">{school}</Badge>
                ))}
              </div>
            </div>

            <Separator />
            
            <div className="text-center p-4 bg-accent/30 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Potencia este perfil</h3>
                <p className="text-muted-foreground mb-4">Usa nuestra IA para obtener sugerencias y mejorar este perfil profesional.</p>
                <EnhanceProfile teacher={teacher} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
