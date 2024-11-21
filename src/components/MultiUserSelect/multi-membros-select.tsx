'use client'

import { Check, ChevronsUpDown, X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

interface User {
  id: string;
  situacao_no_reino: {
    id: string;
    nome: string;
  };
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  first_name?: string | undefined;
}

interface ComboboxDemoProps {
  items: User[]
  selectedItems: User[] // Para os ids dos itens selecionados
  setSelectedItems: (val: User[]) => void // Função para atualizar os itens selecionados
}

export function ComboboxDemo({
  items,
  selectedItems,
  setSelectedItems,
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleSetValue = (user: User) => {
    let updatedValue: User[]

    if (selectedItems.some((selected) => selected.id === user.id)) {
      updatedValue = selectedItems.filter((selected) => selected.id !== user.id)
    } else {
      updatedValue = [...selectedItems, user]
    }

    setSelectedItems(updatedValue) // Passa diretamente o novo array
  }

  // Função para filtrar os usuários com base no first_name
  const filteredItems = items.filter((user) =>
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between h-auto overflow-y-auto"
        >
          <div className="flex gap-2 justify-start flex-wrap">
            {selectedItems?.length > 0 ? (
              selectedItems.map((user, i) => (
                <Badge
                  key={i}
                  className="px-2 py-1 rounded-xl border bg-slate-200 text-xs text-black hover:text-white font-medium gap-1"
                >
                  {/* Tratamento para quando first_name for undefined */}
                  {user?.first_name}
                  {/* Botão para remover o usuário */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation() // Evita que o clique remova e selecione o usuário ao mesmo tempo
                      handleSetValue(user) // Remove o usuário selecionado
                    }}
                    className="ml-1 text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">
                Selecione um usuário...
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Pesquisar membro..."
            value={searchTerm}
            onValueChange={(value) => setSearchTerm(value)}
          />
          <CommandEmpty>Membro não encontrado.</CommandEmpty>
          <CommandGroup>
            <CommandList className="max-h-[300px] overflow-y-auto">
              {filteredItems.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.first_name || 'Sem Nome'}
                  onSelect={() => handleSetValue(user)}
                  className="overflow-y-auto"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedItems.some((selected) => selected.id === user.id)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {/* Tratamento para quando first_name for undefined */}
                  {user.first_name || 'Sem Nome'}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
