/* eslint-disable react/prop-types */
// StatusMembro.tsx
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface StatusMembroProps {
  statusMembro: string;
  idMembro: string;
}

const StatusMembro: React.FC<StatusMembroProps> = ({
  statusMembro,
  idMembro,
}) => {
  const queryClient = useQueryClient();
  const URLApi = `${BASE_URL}/users/status`;
  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);

  const [open, setOpen] = useState(false);
  const [valueMembro, setValueMembro] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const statuses = [
    { value: '0892b1ed-3e99-4e13-acf6-99f7a0e99358', label: 'Ativo' },
    { value: 'c1c9b848-a605-4213-9275-9c210dd094fa', label: 'Afastado' },
    { value: 'f4c1c9ee-5f5a-4681-af13-99c422c240e0', label: 'Frio' },
    { value: 'fab25926-b19e-4a2b-bfad-cf33fa0ace86', label: 'Normal' },
  ];

  const updateStatusMembroFunction = async (status: string) => {
    const response = await axiosAuth.patch(
      URLApi,
      {
        id: idMembro,
        status,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  };

  const { mutateAsync: updateStatusMembroFn } = useMutation({
    mutationFn: updateStatusMembroFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const handleSelectedStatus = async (status: {
    value: string;
    label: string;
  }) => {
    setValueMembro(status);
    const response = await updateStatusMembroFn(status.value);
    if (response) {
      toast({
        variant: 'default',
        title: 'Sucesso',
        description: 'Status do MEMBRO Atualizado com Sucesso. 😇',
      });
    } else {
      toast({
        title: 'Erro!!!',
        description: 'Erro na Atualização do Status do MEMBRO. 😰',
        variant: 'destructive',
      });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between font-normal h-7 rounded-xl',
            valueMembro?.label === 'Ativo'
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800'
              : valueMembro?.label === 'Afastado'
                ? 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
                : valueMembro?.label === 'Normal'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800',
          )}
        >
          {valueMembro?.label}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {open && (
        <PopoverContent className="w-[120px] p-0">
          <Command>
            <CommandGroup>
              <CommandList>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.label}
                    onSelect={() => handleSelectedStatus(status)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        valueMembro?.value === status.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {status.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default StatusMembro;
