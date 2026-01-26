type SettingsSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section>
      <div className="x:flex x:items-baseline x:gap-2">
        <h2 className="x:mb-4 x:text-base x:font-medium">{title}</h2>
        {description && (
          <p className="x:mb-4 x:text-sm x:text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="x:divide-y x:divide-border/50 x:overflow-hidden x:rounded-xl x:bg-secondary x:px-4">
        {children}
      </div>
    </section>
  );
}
