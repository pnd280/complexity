import React from "react";
import { ZodError } from "zod";

export type Nullable<T> = T | null;

export type MaybePromise<T> = T | Promise<T>;

export type RemoveNull<T, K extends keyof T = never> = {
  [P in keyof T]: P extends K ? (T[P] extends infer U | null ? U : T[P]) : T[P];
};

export function isNotNumber(value: unknown): boolean {
  return typeof value !== "number" || isNaN(value);
}

export function isNumber(value: unknown): value is number {
  return !isNotNumber(value);
}

export function isReactNode(node: unknown): node is React.ReactNode {
  return (
    node === null ||
    node === undefined ||
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean" ||
    React.isValidElement(node) ||
    (Array.isArray(node) && node.every(isReactNode))
  );
}

export function isZodError(error: unknown): error is ZodError {
  return (
    error instanceof ZodError ||
    (error as ZodError).name === "ZodError" ||
    Array.isArray((error as ZodError).issues)
  );
}
