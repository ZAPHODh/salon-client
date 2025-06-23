"use client"

import type React from "react"

import { forwardRef, useState, useEffect } from "react"
import { Input } from "./input"



export interface CepInputProps extends Omit<React.ComponentProps<'input'>, "onChange"> {
    onChange?: (value: string) => void
    onValueChange?: (value: string) => void
}

const CepInput = forwardRef<HTMLInputElement, CepInputProps>(
    ({ onChange, onValueChange, value, defaultValue, ...props }, ref) => {
        const [inputValue, setInputValue] = useState<string>(() => {
            const initialValue = value || defaultValue || ""
            return formatCep(initialValue.toString())
        })

        function formatCep(value: string): string {
            const digits = value.replace(/\D/g, "")
            if (digits.length > 5) {
                return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
            }

            return digits
        }


        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value
            const formattedValue = formatCep(rawValue)

            setInputValue(formattedValue)
            if (onChange) {
                e.target.value = formattedValue
                onChange(formattedValue)
            }
            if (onValueChange) {
                onValueChange(formattedValue)
            }
        }
        useEffect(() => {
            if (value !== undefined) {
                setInputValue(formatCep(value.toString()))
            }
        }, [value])

        return (
            <Input
                {...props}
                ref={ref}
                value={inputValue}
                onChange={handleChange}
                maxLength={9}
                placeholder={props.placeholder || "00000-000"}
            />
        )
    },
)

CepInput.displayName = "CepInput"

export { CepInput }
