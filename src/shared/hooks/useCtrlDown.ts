import { useEffect, useMemo, useState } from "react";

import $ from "jquery";

export default function useCtrlDown() {
  const [ctrlDown, setCtrlDown] = useState(false);

  const id = useMemo(() => Math.random().toString(36).slice(2), []);

  useEffect(() => {
    $(document).on(`keydown.${id}`, (e) => {
      if (e.key === "Control") {
        setCtrlDown(true);
      }
    });

    $(document).on(`keyup.${id}`, (e) => {
      if (e.key === "Control") {
        setCtrlDown(false);
      }
    });

    return () => {
      $(document).off(`keydown.${id}`);
      $(document).off(`keyup.${id}`);
    };
  }, [id]);

  return ctrlDown;
}
