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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { Spinner, Trash } from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function DeleteLIcaoCelula({
  licaoCelulaId,
  licaoName,
}: {
  licaoCelulaId: string;
  licaoName: string;
}) {
  const queryClient = useQueryClient();

  const deleteLicaoFunction = async (licaoCelulaId: string) => {
    const URLLicoesCelula = `/api/licoes-celula/create-lesson-celula/?licaoCelulaId=${licaoCelulaId}`;

    try {
      const response = await axios.delete(URLLicoesCelula);
      toast({
        title: 'Sucesso!!!',
        description: 'Lição DELETADA com Sucesso!!! 🧨',
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutateAsync: deleteLicaoFn, isPending } = useMutation({
    mutationFn: deleteLicaoFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temasCelulasIbb'] });
      queryClient.invalidateQueries({ queryKey: ['licoesCelulasIbb'] });
    },
  });

  const handleDeleteCelula = async (licaoCelulaId: string) => {
    await deleteLicaoFn(licaoCelulaId);
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenuItem
            className="w-full flex items-center justify-between text-red-600"
            onSelect={(e) => e.preventDefault()}
          >
            Deletar
            <Trash size={18} />
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[580px]">
          <DialogHeader>
            <DialogTitle>Deletar Lição</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar esta Lição?
            </DialogDescription>
          </DialogHeader>
          <div className="text-center my-2 py-2 text-gray-700 border rounded-md bg-gray-50">
            {licaoName}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={'destructive'}
              onClick={() => handleDeleteCelula(licaoCelulaId)}
              type="submit"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <Spinner className="animate-spin" />
                  Deletando...
                </div>
              ) : (
                'Deletar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
