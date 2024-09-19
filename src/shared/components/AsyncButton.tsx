import { ReactNode, useState } from "react";

import Button, { ButtonProps } from "@/shared/components/Button";

interface AsyncButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => Promise<void>;
  loadingText?: ReactNode;
}

export default function AsyncButton({
  onClick,
  children,
  disabled,
  loadingText = "Loading...",
  ...props
}: AsyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button disabled={disabled || isLoading} onClick={handleClick} {...props}>
      {isLoading ? loadingText : children}
    </Button>
  );
}

AsyncButton.displayName = "AsyncButton";
