import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
export function getInitials(name: string, maxLength?: number): string {
  const initials = name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  if (maxLength !== undefined) {
    return initials.slice(0, maxLength);
  }

  return initials;
}
