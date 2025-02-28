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
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { LicaoRegistrationForm } from './_forms/licao-registration-form';

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

type Theme = {
  folderName: string;
};

export default function AddNewLicaoCelula() {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const temaIdForGetFolderName = searchParams.get('id');
  if (!temaIdForGetFolderName) {
    throw new Error('Prisma instance is null');
  }
  console.log('temaIdForGetFolderName', temaIdForGetFolderName);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                Cadastrar Nova Lição
                <PlusCircle size={18} />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Lição de Célula</DialogTitle>
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
                    <LicaoRegistrationForm
                      folderNameId={temaIdForGetFolderName}
                    />
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
