import { twMerge } from "tailwind-merge";

/**
 * Joins truthy class names and resolves conflicting Tailwind utilities so that
 * later classes (such as a caller's `className`) override component defaults.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(...classes);
}
