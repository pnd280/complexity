import type { ReactNode } from "react";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type AsyncButtonProps = Omit<ButtonProps, "onClick"> & {
  onClick: () => Promise<void>;
  loadingText?: ReactNode;
};

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
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
    setIsLoading(false);
  };

  return (
    <Button disabled={disabled || isLoading} onClick={handleClick} {...props}>
      {isLoading ? loadingText : children}
    </Button>
  );
}
