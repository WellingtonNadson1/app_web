/* eslint-disable react/prop-types */
// StatusCell.tsx
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

interface StatusCellProps {
  status: boolean;
  idEventoAgenda: string;
}

const StatusCell: React.FC<StatusCellProps> = ({ status, idEventoAgenda }) => {
  const queryClient = useQueryClient();
  const URLApi = `${BASE_URL}/agenda-ibb-service/create-evento-agenda`;
  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(status);
  const statuses = [
    { value: true, label: 'Ativo' },
    { value: false, label: 'Pausado' },
  ];

  const updateStatusEventoAgendaFunction = async (status: boolean) => {
    const response = await axiosAuth.patch(
      URLApi,
      {
        id: idEventoAgenda,
        status,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  };

  const { mutateAsync: updateStatusEventoAgendaCelulaFn } = useMutation({
    mutationFn: updateStatusEventoAgendaFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['eventosAgendaIbb'] });
    },
  });

  const handleSelectedStatus = async (status: boolean) => {
    const response = await updateStatusEventoAgendaCelulaFn(status);
    if (response) {
      toast({
        variant: 'default',
        title: 'Sucesso',
        description: 'Status do EVENTO Atualizado com Sucesso. 😇',
      });
    } else {
      toast({
        title: 'Erro!!!',
        description: 'Erro na Atualização do Status do EVENTO. 😰',
        variant: 'destructive',
      });
    }
    setValue(status);
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
            value
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-orange-500 text-white hover:bg-orange-600',
          )}
        >
          {value ? 'Ativo' : 'Pausado'}
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
                    onSelect={() => handleSelectedStatus(status.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === status.value ? 'opacity-100' : 'opacity-0',
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

export default StatusCell;
