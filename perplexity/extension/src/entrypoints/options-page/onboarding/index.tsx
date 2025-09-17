import { LuCheck } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

import Cplx from "@/components/icons/Cplx";
import { Button } from "@/components/ui/button";
import {
  Steps,
  StepsContent,
  StepsCompletedContent,
  StepsPrevTrigger,
  StepsNextTrigger,
  StepsContext,
} from "@/components/ui/steps";
import { H1, H2, H3, P } from "@/components/ui/typography";
import BasePermissions from "@/entrypoints/options-page/onboarding/BasePermissions";
import MultiLingualSupport from "@/entrypoints/options-page/onboarding/MultiLingualSupport";
import DashboardAccess from "@/entrypoints/options-page/onboarding/DashboardAccess";
import ExtensionIconAction from "@/entrypoints/options-page/onboarding/ExtensionIconAction";
import NeedHelp from "@/entrypoints/options-page/onboarding/NeedHelp";
import PluginEcosystem from "@/entrypoints/options-page/onboarding/PluginEcosystem";
import useIsFromAlpha from "@/entrypoints/options-page/onboarding/useIsFromAlpha";

const steps = [
  {
    title: "Introduction",
    description: "Welcome",
    component: <FirstStep />,
  },
  {
    title: "Permissions",
    description: "Required permissions",
    component: <BasePermissions />,
  },
  {
    title: "Dashboard Access",
    description: "Dashboard access",
    component: <DashboardAccess />,
  },
  {
    title: "Extension Icon Action",
    description:
      "Customize the behavior when left-click on the extension's icon",
    component: <ExtensionIconAction />,
  },
  {
    title: "Plugin Ecosystem",
    description: "Plugin ecosystem",
    component: <PluginEcosystem />,
  },
  {
    title: "Beta Notifications",
    description: "Beta notifications",
    component: <MultiLingualSupport />,
  },
  {
    title: "Need Help?",
    description: "Need help?",
    component: <NeedHelp />,
  },
];

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="x:flex x:min-h-screen x:bg-background">
      <div className="x:m-auto x:w-full x:max-w-3xl x:px-4 x:md:px-8">
        <div className="x:flex x:justify-center x:rounded-lg x:py-4 x:md:py-8">
          <Steps
            count={steps.length}
            onStepChange={() => window.scrollTo(0, 0)}
          >
            {steps.map((step, index) => (
              <StepsContent key={index} index={index}>
                {step.component}
              </StepsContent>
            ))}

            <StepsCompletedContent>
              <div className="x:flex x:flex-col x:items-center x:justify-center x:space-y-8 x:animate-in x:fade-in x:md:space-y-12">
                <div className="x:rounded-full x:bg-primary/10 x:p-6 x:md:p-8">
                  <div className="x:rounded-full x:bg-foreground x:p-4 x:md:p-5">
                    <LuCheck className="x:h-8 x:w-8 x:text-primary-foreground x:md:h-10 x:md:w-10" />
                  </div>
                </div>
                <H3 className="x:text-xl x:font-semibold x:md:text-2xl">
                  Setup Complete! 🎉
                </H3>
                <P className="x:text-center x:leading-relaxed x:text-muted-foreground">
                  You&apos;re all set to start using the extension.
                </P>
              </div>
            </StepsCompletedContent>

            <div className="x:mx-auto x:mt-6 x:flex x:max-w-max x:justify-between x:gap-3 x:md:mt-8 x:md:gap-4">
              <StepsContext>
                {({ hasPrevStep, hasNextStep }) => (
                  <>
                    {hasPrevStep && (
                      <StepsPrevTrigger>Previous</StepsPrevTrigger>
                    )}
                    {hasNextStep && <StepsNextTrigger>Next</StepsNextTrigger>}
                    {!hasNextStep && (
                      <Button
                        size="lg"
                        onClick={() => navigate("/plugins?from=onboarding")}
                      >
                        Continue to Dashboard
                      </Button>
                    )}
                  </>
                )}
              </StepsContext>
            </div>
          </Steps>
        </div>
      </div>
    </div>
  );
}

function FirstStep() {
  const fromAlpha = useIsFromAlpha();

  return (
    <div className="x:my-8 x:flex x:flex-col x:items-center x:justify-center x:space-y-8 x:md:my-16 x:md:space-y-12">
      <H1 className="x:text-center x:text-balance">
        Meet the better version of Perplexity AI
      </H1>
      <div className="x:space-y-8 x:text-center x:md:space-y-12">
        <div className="x:relative">
          <div className="x:group x:relative x:z-0 x:mt-8 x:flex x:flex-col x:place-items-center x:transition-all x:before:absolute x:before:h-[300px] x:before:w-full x:before:-translate-x-1/2 x:before:rounded-full x:before:bg-gradient-to-br x:before:from-transparent x:before:to-primary x:before:opacity-10 x:before:blur-2xl x:before:duration-1000 x:before:ease-in-out x:before:content-[''] x:before:animate-in x:before:fade-in x:before:zoom-in-0 x:after:absolute x:after:-z-20 x:after:h-[180px] x:after:w-[240px] x:after:translate-x-1/3 x:after:bg-conic-180 x:after:from-primary x:after:via-primary x:after:opacity-40 x:after:blur-2xl x:after:duration-1000 x:after:ease-in-out x:after:content-[''] x:after:animate-in x:after:fade-in x:after:zoom-in-0 x:sm:before:w-[560px] x:md:mt-12 x:md:before:h-[400px] x:md:after:h-[240px] x:md:after:w-[320px] x:lg:mt-0 x:lg:mb-0 x:before:lg:h-[480px]">
            <Cplx
              className="x:mx-auto x:size-32 x:fill-foreground x:md:size-48"
              primary="var(--primary)"
            />
          </div>
        </div>
        <div className="x:relative x:z-10">
          {fromAlpha ? (
            <H2 className="x:text-lg x:text-muted-foreground x:md:text-xl">
              A brand new version of Complexity is here!
            </H2>
          ) : (
            <>
              <H2 className="x:text-lg x:text-muted-foreground x:md:text-xl">
                Let&apos;s get started with a quick setup
              </H2>
              <Link
                to="/"
                className="x:cursor-pointer x:text-center x:text-base x:leading-relaxed x:text-muted-foreground x:underline x:md:text-lg"
              >
                or skip and take me to the dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
