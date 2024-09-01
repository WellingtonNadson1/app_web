import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import React, { Fragment, useRef, useState } from "react";
import { Button } from "../ui/button";

type IconHeaderModal = {
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
};

type ModalProps = {
  icon: IconHeaderModal["icon"];
  titleModal: string;
  titleButton: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  children: React.ReactNode;
};

export default function Modal({
  icon: IconComponent,
  titleModal,
  titleButton,
  buttonProps,
  children,
}: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      {/* Mudar o tipo do botão quando necessário */}
      <div className="flex items-center justify-between">
        <div></div>
        <Button
          className="btn-ibb"
          type="button"
          onClick={openModal} // Ativa o modal ao clicar no botão
          {...buttonProps}
        >
          {titleButton}
        </Button>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-between">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-200 sm:mx-0 sm:h-10 sm:w-10">
                          <IconComponent
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            {titleModal}
                          </Dialog.Title>
                        </div>
                      </div>
                      <div className="flex flex-row-reverse rounded-full bg-gray-50">
                        <Button
                          type="submit"
                          className="inline-flex w-auto justify-center rounded-md bg-slate-200 px-2 py-1 text-xs font-thin text-slate-500 shadow-sm hover:bg-gray-300 hover:text-slate-800"
                          onClick={closeModal}
                        >
                          <X width={16} height={16} />
                        </Button>
                      </div>
                    </div>
                    {isOpen === false ? null : (
                      <div className="mt-3 text-left sm:ml-4 sm:mt-0 sm:text-left">
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{children}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
                      onClick={closeModal}
                    >
                      {titleButton}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeModal}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
