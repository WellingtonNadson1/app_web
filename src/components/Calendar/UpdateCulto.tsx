"use client";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function UpdateCulto() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem
          className="w-full flex items-center justify-between"
          onSelect={(e) => e.preventDefault()}
        >
          Editar
          <PencilSimple size={18} />
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>Editar Culto</DialogTitle>
          <DialogDescription>
            Edite o culto preenchendo o formulário.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-2"></div>
        {/* FORMULARIO CADASTRO CULTO */}
        <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 hover:opacity-95"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
