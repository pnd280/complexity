import { H1 } from "@/components/ui/typography";

export default function MultiLingualSupport() {
  return (
    <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
      <H1 className="x:text-center x:text-balance">Multilingual Support</H1>
      <div className="x:w-full x:text-center x:text-balance x:text-foreground">
        All translations are powered by AI and may not always be precise. If you
        encounter any unclear translations, feel free to contact us through our
        support channels or switch to English for the best experience.
      </div>
      <div className="x:overflow-hidden x:rounded-xl x:border x:border-border/50">
        <img src="https://i.imgur.com/IOW63ev.png" />
      </div>
    </div>
  );
}
