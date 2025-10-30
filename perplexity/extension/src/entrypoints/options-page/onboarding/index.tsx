import { useLocalStorage } from "@uidotdev/usehooks";
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
import CometPatch from "@/entrypoints/options-page/onboarding/CometPatch";
import ExtensionIconAction from "@/entrypoints/options-page/onboarding/ExtensionIconAction";
import MultiLingualSupport from "@/entrypoints/options-page/onboarding/MultiLingualSupport";
import PluginEcosystem from "@/entrypoints/options-page/onboarding/PluginEcosystem";
import SupportChannels from "@/entrypoints/options-page/onboarding/SupportChannels";
import { isCometBrowserSync, isCsInjectableSync } from "@/utils/wrappers/comet";

import TablerCheck from "~icons/tabler/check";

type StepComponentProps = {
  hasCompletedOnboarding: boolean;
};

const getSteps = ({ hasCompletedOnboarding }: StepComponentProps) => {
  return (
    [
      {
        title: "Introduction",
        description: "Welcome",
        component: (
          <FirstStep hasCompletedOnboarding={hasCompletedOnboarding} />
        ),
        skipable: true,
        customNextStepText: undefined,
      },
      {
        title: "Comet Patch",
        description: "Comet Patch",
        component: <CometPatch />,
        skipable: true,
        customPrevStepText: undefined,
        customNextStepText: "I've completed the instructions",
      },
      {
        title: "Permissions",
        description: "Required permissions",
        component: <BasePermissions />,
        skipable: true,
        customPrevStepText: undefined,
        customNextStepText: undefined,
      },
      {
        title: "Extension Icon Action",
        description: "Choose what a left-click on the icon does",
        component: <ExtensionIconAction />,
        skipable: true,
        customPrevStepText: undefined,
        customNextStepText: undefined,
      },
      {
        title: "Plugin Ecosystem",
        description: "Plugin ecosystem",
        component: <PluginEcosystem />,
        skipable: true,
        customPrevStepText: undefined,
        customNextStepText: undefined,
      },
      {
        title: "Multilingual Support",
        description: "Language and translations",
        component: <MultiLingualSupport />,
        skipable: true,
        customPrevStepText: undefined,
        customNextStepText: undefined,
      },
      {
        title: "Need Help?",
        description: "Need help?",
        component: <SupportChannels />,
        skipable: true,
        customPrevStepText: undefined,
        customNextStepText: undefined,
      },
    ] as const satisfies Array<{
      title: string;
      description: string;
      component: React.ReactNode;
      skipable: boolean;
      customPrevStepText?: string;
      customNextStepText?: string;
    }>
  ).filter((step) => {
    if (!isCometBrowserSync() || isCsInjectableSync()) {
      return step.title !== "Comet Patch";
    }

    return true;
  });
};

export function Onboarding() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    "cplx:onboarding:completed",
    false,
  );

  const steps = getSteps({ hasCompletedOnboarding });

  const handleComplete = () => {
    void setHasCompletedOnboarding(true);
    void navigate("/plugins?from=onboarding");
  };

  return (
    <div className="x:flex x:min-h-screen x:bg-background">
      <div className="x:m-auto x:w-full x:max-w-3xl x:px-4 x:md:px-8">
        <div className="x:flex x:justify-center x:rounded-lg x:py-4 x:md:py-8">
          <Steps
            count={steps.length}
            step={currentStep}
            onStepChange={(details) => {
              setCurrentStep(details.step);
              window.scrollTo(0, 0);
            }}
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
                    <TablerCheck className="x:h-8 x:w-8 x:text-primary-foreground x:md:h-10 x:md:w-10" />
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
                    {hasNextStep && steps[currentStep]?.skipable && (
                      <StepsNextTrigger>
                        {steps[currentStep].customNextStepText ?? "Next"}
                      </StepsNextTrigger>
                    )}
                    {!hasNextStep && (
                      <Button size="lg" onClick={handleComplete}>
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

function FirstStep({ hasCompletedOnboarding }: StepComponentProps) {
  return (
    <div className="x:my-8 x:flex x:flex-col x:items-center x:justify-center x:space-y-8 x:md:my-16 x:md:space-y-12">
      <H1 className="x:text-center x:text-balance">
        Meet the better version of Perplexity AI
      </H1>
      <div className="x:space-y-8 x:text-center x:md:space-y-12">
        <div className="x:relative x:before:absolute x:before:right-8 x:before:bottom-8 x:before:-z-30 x:before:h-[280px] x:before:w-[280px] x:before:animate-[blob_35s_ease-in-out_infinite_reverse] x:before:bg-primary/2 x:before:opacity-30 x:before:blur-2xl x:before:content-[''] x:md:before:right-12 x:md:before:bottom-12 x:md:before:h-[360px] x:md:before:w-[360px]">
          <div className="x:group x:relative x:z-0 x:mt-8 x:flex x:flex-col x:place-items-center x:transition-all x:before:absolute x:before:top-1/2 x:before:left-1/2 x:before:h-[360px] x:before:w-[360px] x:before:-translate-x-1/2 x:before:-translate-y-1/2 x:before:rounded-full x:before:bg-linear-to-b x:before:from-primary/8 x:before:to-transparent x:before:opacity-30 x:before:blur-3xl x:before:duration-700 x:before:ease-out x:before:content-[''] x:group-hover:before:scale-110 x:group-hover:before:opacity-35 x:after:absolute x:after:top-1/2 x:after:left-1/2 x:after:-z-20 x:after:h-[520px] x:after:w-[520px] x:after:-translate-x-1/2 x:after:-translate-y-1/2 x:after:animate-[blob_28s_ease-in-out_infinite] x:after:bg-primary/3 x:after:opacity-25 x:after:blur-3xl x:after:duration-10000 x:after:ease-in-out x:after:content-[''] x:md:before:h-[440px] x:md:before:w-[440px] x:md:after:h-[640px] x:md:after:w-[640px] x:lg:mt-0 x:lg:mb-0">
            <Cplx
              className="x:relative x:z-10 x:mx-auto x:size-32 x:fill-foreground x:md:size-48"
              primary="var(--primary)"
            />
          </div>
        </div>
        <div className="x:relative x:z-10">
          <H2 className="x:text-lg x:text-muted-foreground x:md:text-xl">
            Let&apos;s get started with a quick setup
          </H2>
          {hasCompletedOnboarding && (
            <Link
              to="/plugins?from=onboarding"
              className="x:cursor-pointer x:text-center x:text-xs x:leading-relaxed x:text-muted-foreground x:underline x:md:text-base"
            >
              or skip and take me to the dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
