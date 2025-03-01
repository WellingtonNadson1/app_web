import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/timer-picker-input/time-picker';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  FormRelatorioDataSchema,
  TSupervisoes,
  type FormRelatorioSchema,
} from './schema';
import { Spinner } from '@phosphor-icons/react';
import utc from 'dayjs/plugin/utc';
import ptBr from 'dayjs/locale/pt-br';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault('America/Sao_Paulo');

interface RelatorioFormProps {
  onSubmit: (data: FormRelatorioSchema) => Promise<void>;
  supervisoes: TSupervisoes[] | [];
  isLoading: boolean;
}

export function RelatorioForm({
  onSubmit,
  supervisoes,
  isLoading,
}: RelatorioFormProps) {
  const form = useForm<z.infer<typeof FormRelatorioDataSchema>>({
    resolver: zodResolver(FormRelatorioDataSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 items-center justify-center mt-2 gap-2 gap-y-6 sm:grid-cols-12">
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            dayjs(field.value)
                              .utc()
                              .local()
                              .locale('pt-br')
                              .format('DD-MM-YYYY HH:mm:ss')
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data final</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            dayjs(field.value)
                              .utc()
                              .local()
                              .locale('pt-br')
                              .format('DD-MM-YYYY HH:mm:ss')
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="superVisionId"
              render={({ field }) => (
                <FormItem className="space-y-2 flex flex-col">
                  <FormLabel>Supervisão</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma supervisão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supervisoes.map((supervisao) => (
                        <SelectItem key={supervisao.id} value={supervisao.id}>
                          {supervisao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-full sm:col-span-2">
            <div className="sm:mt-5">
              <Button
                type="submit"
                className="w-full text-white bg-blue-700 shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="animate-spin mr-2" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <span>Relatório</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
