import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// for prettier sorting
export const tw = (strings: TemplateStringsArray, ...values: string[]) =>
  String.raw({ raw: strings }, ...values);
