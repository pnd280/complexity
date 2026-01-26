import { H1 } from "@/components/ui/typography";

export default function PluginEcosystem() {
  return (
    <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
      <H1 className="x:text-center x:text-balance">Plugin Ecosystem</H1>

      <div className="x:w-full x:text-center x:text-balance">
        Complexity has a comprehensive set of tweaks/features called{" "}
        <span className="x:font-semibold x:text-primary">PLUGINS</span>. Most
        plugins are isolated and can be enabled/disabled independently. Each
        plugin can have further configuration options.
      </div>

      <div className="x:w-full x:px-8">
        <div className="x:relative x:rounded-xl x:border x:border-primary/50">
          <div className="x:absolute x:top-1/2 x:left-1/2 x:z-0 x:size-[120%] x:-translate-x-1/2 x:-translate-y-1/2 x:rounded-full x:bg-primary/20 x:blur-2xl x:transition-all x:duration-500 x:ease-in-out" />
          <img
            src="https://cdn.cplx.app/images/I576QlN.png"
            alt="Plugin Ecosystem"
            className="x:relative x:w-full x:rounded-xl x:shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
