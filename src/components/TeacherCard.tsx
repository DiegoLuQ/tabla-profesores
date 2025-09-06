import type { Teacher } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pen, Trash2, View } from 'lucide-react';
import Link from 'next/link';
import { DeleteTeacherButton } from './DeleteTeacherButton';
import { Badge } from './ui/badge';

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardHeader>
        <CardTitle className="font-headline">{teacher.nombre_completo}</CardTitle>
        <CardDescription>{teacher.email}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Curso</h4>
          <p className="font-medium">{teacher.curso}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Asignaturas</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {teacher.asignaturas.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="secondary">{subject}</Badge>
            ))}
            {teacher.asignaturas.length > 3 && <Badge variant="outline">+{teacher.asignaturas.length - 3}</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="ghost" size="icon" asChild title="Ver detalles">
          <Link href={`/profesores/${teacher.id}`}><View className="h-4 w-4" /></Link>
        </Button>
        <Button variant="ghost" size="icon" asChild title="Editar">
          <Link href={`/profesores/${teacher.id}/edit`}><Pen className="h-4 w-4" /></Link>
        </Button>
        <DeleteTeacherButton id={teacher.id} />
      </CardFooter>
    </Card>
  );
}
