"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MyCalendar from "@/components/Calendar/Calendar";
import FormNewCulto from "./form-submit-new-culto";

export default function Cultos() {
  return (
    <>
      <ToastContainer />

      <div className="relative w-full px-2 py-2 mx-auto">
        <Card className="relative w-full mx-auto mt-3 mb-4 grid grid-cols-1 gap-3 justify-between sm:justify-center items-center">
          <MyCalendar />
          {/* FORMS DIALOG */}
          <div className="px-2 py-3">
            {/* FORMS */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="sm:flex sm:justify-end sm:items-end">
                  <Button
                    className="sm:w-auto w-full  bg-btnIbb hover:bg-btnIbb hover:opacity-90"
                    variant="default"
                  >
                    Cadastrar
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[580px]">
                <DialogHeader>
                  <DialogTitle>Cadastro de Culto</DialogTitle>
                </DialogHeader>
                {/* FORMULARIO CADASTRO CULTO */}
                <FormNewCulto />
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
    </>
  );
}
