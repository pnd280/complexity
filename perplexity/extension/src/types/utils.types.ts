import React from "react";
import { ZodError } from "zod";
import type { StateCreator } from "zustand/vanilla";

export type Nullable<T> = T | null;

export type MaybePromise<T> = T | Promise<T>;

export type RemoveNull<T, K extends keyof T = never> = {
  [P in keyof T]: P extends K ? (T[P] extends infer U | null ? U : T[P]) : T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapValue<T> = T extends Map<any, infer V> ? V : never;

export type NullablePartial<T> = {
  [key in keyof T]+?: T[key] | undefined | null;
};

/**
 * Maps all properties of type T to never.
 */
export type Never<T> = {
  [K in keyof T]: never;
};

export type ContextLoaderExport = () => void;

export type String = string;

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

export type SliceCreator<Slice, Store> = StateCreator<
  Store,
  [["zustand/subscribeWithSelector", never], ["zustand/mutative", never]],
  [],
  Slice
>;
