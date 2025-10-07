import { useNavigate, useRouteError } from "react-router-dom";

import { Result } from "@/components/Result";
import { Button } from "@/components/ui/button";
import { P } from "@/components/ui/typography";

import TablerAlertCircle from "~icons/tabler/alert-circle";

type ErrorPageProps = {
  error?: Error;
  resetError?: () => void;
};

export default function ErrorPage({ error, resetError }: ErrorPageProps) {
  const routerError = useRouteError();

  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (resetError) {
      resetError();
    }
    navigate("/");
  };

  return (
    <div className="x:flex x:h-full x:min-h-screen x:items-center x:justify-center">
      <Result
        icon={TablerAlertCircle}
        title="Something went wrong"
        description={
          <div className="x:text-balance">
            <P className="x:mb-4 x:text-sm x:text-muted-foreground">
              {error?.message ||
                "An unexpected error occurred. Please check the console."}
            </P>
            <Button onClick={handleHomeClick}>Return to Homepage</Button>
            <div className="x:my-4 x:mt-8 x:max-h-[300px] x:overflow-auto x:rounded-md x:bg-secondary x:p-2 x:font-mono">
              Error: {(routerError as Error).message}
            </div>
          </div>
        }
      />
    </div>
  );
}
