import React from "react";

type PageProps = {
  title: string;
} & (
  | {
      page: React.ComponentType;
      children?: never;
    }
  | {
      page?: never;
      children: React.ReactNode;
    }
);

export default function Page({ title, page, children }: PageProps) {
  return (
    <>
      <title>{title}</title>
      {page ? React.createElement(page) : children}
    </>
  );
}
