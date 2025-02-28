'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { AgendaRegistrationForm } from './agenda-registration-form';

interface Celula {
  id: string;
  nome: string;
  lider: {
    id: string;
    first_name: string;
  };
}

interface User {
  id: string;
  first_name?: string;
}

export interface SupervisaoData {
  id: string;
  nome: string;
  celulas: Celula[];
  membros: User[];
}

export default function AddNewAgenda() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                Cadastrar Novo Evento
                <PlusCircle size={18} />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Cadastrando Novo Evento na Agenda</DialogTitle>
            <DialogDescription>
              Edite os dados preenchendo o formulário
            </DialogDescription>
          </DialogHeader>

          {/* Incio do Forms */}
          <div className="relative w-full mx-auto ">
            <div className="flex justify-between">
              <div className="relative mx-auto py-4">
                <div className="p-2 mx-auto bg-white rounded-lg">
                  <div className="mt-2 card-body">
                    <AgendaRegistrationForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
