import Link from 'next/link';
import { GraduationCap, PlusCircle, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/profesores" className="flex items-center gap-2 text-xl font-bold font-headline text-primary-foreground">
            <div className="bg-primary rounded-lg p-1.5">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold font-headline text-foreground">TeacherZen</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/profesores/tabla">
                <Table className="mr-2 h-4 w-4" />
                Tabla Profesores
              </Link>
            </Button>
            <Button asChild>
              <Link href="/profesores/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Profesor
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
