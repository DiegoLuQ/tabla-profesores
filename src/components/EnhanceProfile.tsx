'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';
import { Sparkles, Lightbulb } from 'lucide-react';
import { enhanceTeacherProfile } from '@/ai/flows/enhance-teacher-profile';
import type { Teacher } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export function EnhanceProfile({ teacher }: { teacher: Teacher }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleEnhance = async () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
      return;
    }
    
    setIsOpen(true);
    setIsLoading(true);
    try {
      const result = await enhanceTeacherProfile(teacher);
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
      } else {
        toast({ title: 'Sin sugerencias', description: '¡El perfil ya parece excelente!' });
        setSuggestions([]);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudieron generar sugerencias. Inténtalo de nuevo.',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button onClick={handleEnhance}>
          <Sparkles className="mr-2 h-4 w-4" />
          Mejorar con IA
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-primary h-6 w-6" />
            Sugerencias de IA
          </SheetTitle>
          <SheetDescription>
            Ideas para que el perfil de {teacher.nombre_completo.split(' ')[0]} destaque aún más.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4">
          {isLoading && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          )}
          {!isLoading && suggestions.length > 0 && (
            <ul className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="mt-1 flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-foreground">{suggestion}</p>
                </li>
              ))}
            </ul>
          )}
           {!isLoading && suggestions.length === 0 && (
            <div className="text-center text-muted-foreground pt-8">
              <p>No se generaron nuevas sugerencias.</p>
              <p className="text-xs mt-1">El perfil está bien o la IA está descansando.</p>
            </div>
           )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
