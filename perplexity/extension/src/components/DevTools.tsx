import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

export default function DevTools() {
  return (
    <TanStackDevtools
      plugins={[
        {
          name: "Tanstack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
        formDevtoolsPlugin(),
      ]}
    />
  );
}
