import React from 'react';
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from './ui/input';
import { Controller, useFormContext, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file';
    onChange?: (value: string | number | File) => void; // Make it optional
}

const FormField = <T extends FieldValues>({
    name,
    label,
    placeholder,
    type = "text",
    onChange,
}: FormFieldProps<T>) => {
    const { control } = useFormContext<T>();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='label'>{label}</FormLabel>
                    <FormControl>
                        <Input
                            className='input'
                            placeholder={placeholder}
                            type={type}
                            value={field.value || ""}
                            onChange={(e) => {
                                field.onChange(e); // react-hook-form internal handler
                                if (onChange) {
                                    onChange(e.target.value); // Call external handler if passed
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormField;
