"use client"

import { Check, ChevronDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface statusProps {
  status: boolean | (() => boolean);
}

export default function SelectBadgeButton({ status }: statusProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<boolean>(status)
  const statuses = [
    {
      value: true,
      label: "Active",
    },
    {
      value: false,
      label: "Paused",
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[120px] justify-between font-normal",
            value ? "bg-green-500 text-white hover:bg-green-600" : "bg-orange-500 text-white hover:bg-orange-600"
          )}
        >
          {value ? "Active" : "Paused"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] p-0">
        <Command>
          <CommandGroup>
            {statuses.map((status) => (
              <CommandItem
                key={status.label}
                onSelect={() => {
                  setValue(status.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === status.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {status.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
