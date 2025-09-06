'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTeacher } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface DeleteTeacherButtonProps extends ButtonProps {
  id: string;
  children?: React.ReactNode;
}

export function DeleteTeacherButton({ id, children, className, variant, size, ...props }: DeleteTeacherButtonProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteTeacher(id);
        toast({
          title: "Éxito",
          description: "Profesor eliminado correctamente.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar al profesor.",
        });
      }
    });
  };
  
  if (variant === 'ghost' || variant === 'link') {
    return (
        <button onClick={handleDelete} disabled={isPending} className={cn('flex items-center', className)}>
            {children || (isPending ? "Eliminando..." : "Eliminar")}
        </button>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant || "destructive"} size={size || "icon"} disabled={isPending} title="Eliminar" {...props}>
            {children || <Trash2 className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al profesor
            y sus datos de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
            {isPending ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
