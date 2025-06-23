"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

type ComboboxType = {
    datas: any[];
    placeholder: string;
    referenceId: string;
    description: string;
    title: string;
    chave: string;
};

function getNestedValue(obj: any, path: string) {
    return path
        .split(".")
        .reduce(
            (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
            obj
        );
}
export function Combobox({
    datas,
    title,
    placeholder,
    referenceId,
    description,
    chave,
}: ComboboxType) {
    const { control, setValue } = useFormContext();

    return (
        <FormField
            control={control}
            name="language"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full py-2 ">
                    <FormLabel>{title}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? field.value : `${placeholder}`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-0">
                            <Command>
                                <CommandInput placeholder={`Pesquise por ${placeholder}`} />
                                <CommandList>
                                    <CommandEmpty>Nada encontrado</CommandEmpty>
                                    <CommandGroup>
                                        {datas.map((data) => (
                                            <CommandItem
                                                value={getNestedValue(data, chave)}
                                                key={data.id}
                                                onSelect={() => {
                                                    field.onChange(getNestedValue(data, chave));
                                                    setValue(referenceId, data.id);
                                                }}
                                            >
                                                {getNestedValue(data, chave)}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        getNestedValue(data, chave) === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}