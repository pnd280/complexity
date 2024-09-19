import { ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const extendedMerge = extendTailwindMerge({
  prefix: "tw-",
});
export function cn(...inputs: ClassValue[]) {
  return extendedMerge(clsx(inputs));
}

// for prettier sorting
export const tw = (strings: TemplateStringsArray, ...values: string[]) =>
  String.raw({ raw: strings }, ...values);
