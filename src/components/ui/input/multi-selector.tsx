"use client";

// import { MultipleSelector } from "@/components/ui/multiple-selector";
import { Controller, useFormContext } from "react-hook-form";
import MultipleSelector from "../multiselect";

type MultipleSelectorType = {
    name: string;
    options: { value: string; label: string }[];
};

function MultipleSelection({ name, options }: MultipleSelectorType) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="p-4 space-y-4">
                    <div>
                        <MultipleSelector
                            placeholder="Select technologies..."
                            defaultOptions={options}
                            onChange={field.onChange}
                            value={field.value || []}
                        />
                    </div>
                </div>
            )}
        />
    );
}

export { MultipleSelection };