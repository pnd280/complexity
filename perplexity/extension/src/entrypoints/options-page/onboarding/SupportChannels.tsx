import { H1 } from "@/components/ui/typography";

export default function SupportChannels() {
  return (
    <div className="x:mx-auto x:flex x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
      <H1 className="x:text-center x:text-balance">Need Help?</H1>
      <div className="x:w-full x:text-center x:text-balance">
        Having trouble configuring or using Complexity? Connect with us through
        the support options available below.
      </div>

      <div className="x:flex x:w-full x:flex-col x:gap-8 x:md:flex-row">
        <div className="x:flex x:flex-1 x:flex-col x:items-center x:gap-4">
          <h3 className="x:text-xl x:font-semibold x:text-card-foreground">
            Discord Community
          </h3>
          <a
            href="https://discord.cplx.app"
            target="_blank"
            rel="noreferrer"
            className="x:block x:transition-transform x:duration-200 x:hover:scale-[1.02]"
          >
            <div className="x:mx-auto x:h-[300px] x:w-[400px] x:overflow-hidden x:rounded-xl x:border x:border-border/50">
              <img
                src="https://images2.imgbox.com/dc/dd/nPOEmVsb_o.png"
                alt="Discord Community"
                className="x:h-full x:w-full x:object-cover x:object-left-top x:shadow-lg"
              />
            </div>
          </a>
          <p className="x:max-w-[400px] x:text-center x:text-sm x:text-muted-foreground">
            Join our Discord server for real-time chat, community support, bug
            reports, feature requests, and quick answers.
          </p>
        </div>

        <div className="x:flex x:flex-1 x:flex-col x:items-center x:gap-4">
          <h3 className="x:text-xl x:font-semibold x:text-card-foreground">
            GitHub Issues
          </h3>
          <a
            href="https://github.com/pnd280/complexity/issues"
            target="_blank"
            rel="noreferrer"
            className="x:block x:transition-transform x:duration-200 x:hover:scale-[1.02]"
          >
            <div className="x:mx-auto x:h-[300px] x:w-[400px] x:overflow-hidden x:rounded-xl x:border x:border-border/50">
              <img
                src="https://images2.imgbox.com/fe/64/XooVAoQp_o.png"
                alt="GitHub Issues"
                className="x:h-full x:w-full x:object-cover x:object-left-top x:shadow-lg"
              />
            </div>
          </a>
          <p className="x:max-w-[400px] x:text-center x:text-sm x:text-muted-foreground">
            For formal bug reports, feature requests, and browsing existing
            issues in a structured environment.
          </p>
        </div>
      </div>
    </div>
  );
}
