"use client";

import { useFormContext } from "react-hook-form";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { z } from "zod";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "./combobox";
import { Card, CardContent } from "@/components/ui/card";
import { MultipleSelection } from "./multi-selector";


const inputGridVariants = cva("w-full grid gap-2", {
    variants: {
        variants: {
            default: "grid-cols-1 md:grid-cols-2",
            single: "grid-cols-1",
            auto: "grid grid-flow-col auto-cols-max gap-2",
            dynamic:
                "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
        },
    },
    defaultVariants: {
        variants: "default",
    },
});

export interface FieldConfig<T extends z.ZodType<any, any>> {
    label: string;
    placeholder: string;
    description: string;
    inputType?: string;
    options?: { value: string; label: string }[];
    registerName?: string;
    datas?: any[];
    referenceId?: string;
    chave?: string;
    fields?: Record<string, FieldConfig<T>>;
}

interface GenericFormProps<T extends z.ZodType<any, any>> {
    fieldConfig: Record<keyof z.infer<T>, FieldConfig<T>>;
    variants?: "default" | "single" | "auto" | "dynamic";
}

export function GenericFormsInput<T extends z.ZodType<any, any>>({
    fieldConfig,
    variants = "default",
}: GenericFormProps<T>) {
    const { control, register } = useFormContext();

    const isNestedObject = (config: FieldConfig<z.AnyZodObject>) => {
        return config.inputType === "object" && config.fields !== undefined;
    };

    const renderGroupedInputs = (groupName: string, config: FieldConfig<T>) => {
        if (!config.fields) {
            return null;
        }

        return (
            <Card key={groupName} className="border p-4 rounded-lg my-4">
                <CardContent className="m-0 p-0">
                    <h4 className="font-semibold">{config.label}</h4>
                    <FormDescription>{config.description}</FormDescription>
                    <div className={cn(inputGridVariants({ variants }))}>
                        {Object.entries(
                            config.fields as Record<string, FieldConfig<T>>
                        ).map(([name, nestedConfig]) => (
                            <FormField
                                key={name}
                                control={control}
                                name={`${groupName}.${name}`}
                                render={({ field }) => (
                                    <>{renderInput(nestedConfig, field, register)}</>
                                )}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className={cn(inputGridVariants({ variants }))}>
            {Object.entries(fieldConfig).map(([name, config]) =>
                isNestedObject(config) ? (
                    renderGroupedInputs(name, config)
                ) : (
                    <FormField
                        key={name}
                        control={control}
                        name={name}
                        render={({ field }) => <>{renderInput(config, field, register)}</>}
                    />
                )
            )}
        </div>
    );
}

const renderInput = (
    config: FieldConfig<z.AnyZodObject>,
    field: any,
    register?: any
) => {
    if (config.inputType === "checkbox") {
        return (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 max-h-[100px]">
                <div className="space-y-0.5 ">
                    <FormLabel>{config.label}</FormLabel>
                    <FormDescription>{config.description}</FormDescription>
                </div>
                <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        {...(config.registerName ? register(config.registerName) : field)}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        );
    }
    if (config.inputType === "combobox") {
        return (
            <Combobox
                datas={config.datas || []}
                title={config.label}
                placeholder={config.placeholder}
                referenceId={config.referenceId || ""}
                description={config.description}
                chave={config.chave || ""}
            />
        );
    }
    if (config.inputType === "multiple-select") {
        return (
            <FormItem>
                <FormLabel>{config.label}</FormLabel>
                <FormControl>
                    <MultipleSelection name={field.name} options={config.options || []} />
                </FormControl>
                <FormDescription>{config.description}</FormDescription>
                <FormMessage />
            </FormItem>
        );
    }
    return (
        <FormItem>
            <FormLabel>{config.label}</FormLabel>
            <FormControl>
                {config.inputType === "select" ? (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={config.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {config.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : config.inputType === "file" ? (
                    <Input
                        type="file"
                        placeholder={config.placeholder}
                        accept="image/*"
                        {...register(config.registerName)}
                    />
                ) : config.inputType === "textarea" ? (
                    <textarea
                        placeholder={config.placeholder}
                        {...(config.registerName ? register(config.registerName) : field)}
                        className="w-full p-2 border rounded"
                    />
                ) : (
                    <Input
                        type={config.inputType || "text"}
                        placeholder={config.placeholder}
                        {...(config.registerName ? register(config.registerName) : field)}
                    />
                )}
            </FormControl>
            <FormDescription>{config.description}</FormDescription>
            <FormMessage />
        </FormItem>
    );
};