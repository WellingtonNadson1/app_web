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
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { Spinner, Trash } from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

function DeleteMember({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth(session?.user?.token as string);

  const deleteMemberFunction = async (MemberId: string) => {
    const URLMember = `${BASE_URL}/users/${memberId}`;
    try {
      const response = await axiosAuth.delete(URLMember);
      toast({
        title: 'Sucesso!!!',
        description: 'Membro DELETADO com Sucesso!!! 🥳',
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutateAsync: deleteMemberFn, isPending } = useMutation({
    mutationFn: deleteMemberFunction,
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["cultosMarcados"] });
    // },
  });

  const handleDelete = async (MemberId: string) => {
    await deleteMemberFn(MemberId);
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
            <DialogTitle>Deletar Membro</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar este Membro?
            </DialogDescription>
          </DialogHeader>
          <div className="text-center my-2 py-2 text-gray-700 border rounded-md bg-gray-50">
            {memberName}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={'destructive'}
              onClick={() => handleDelete(memberId)}
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

export default DeleteMember;
