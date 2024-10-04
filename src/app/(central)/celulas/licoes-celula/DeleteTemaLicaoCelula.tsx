"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { Spinner, Trash } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function DeleteTemaLIcaoCelula({
  temaLicaoCelulaId,
  TemaLicaoName,
}: {
  temaLicaoCelulaId: string;
  TemaLicaoName: string;
}) {
  const queryClient = useQueryClient();

  const deleteMemberFunction = async (temaLicaoCelulaId: string) => {
    const URLTemasLicoesCelula = `/api/licoes-celula/create-tema-folder/?temaLicaoCelulaId=${temaLicaoCelulaId}`;

    try {
      const response = await axios.delete(URLTemasLicoesCelula);
      toast({
        title: "Sucesso!!!",
        description: "Tema de Lição DELETADA com Sucesso!!! 🥳",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutateAsync: deleteCelulaFn, isPending } = useMutation({
    mutationFn: deleteMemberFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["temasCelulasIbb"] });
    },
  });

  const handleDeleteCelula = async (temaLicaoCelulaId: string) => {
    await deleteCelulaFn(temaLicaoCelulaId);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <Toaster />
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
            <DialogTitle>Deletar Tema de Licão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar este TEMA?
            </DialogDescription>
          </DialogHeader>
          <div className="text-center my-2 py-2 text-gray-700 border rounded-md bg-gray-50">
            {TemaLicaoName}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => handleDeleteCelula(temaLicaoCelulaId)}
              type="submit"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <Spinner className="animate-spin" />
                  Deletando...
                </div>
              ) : (
                "Deletar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

