type SettingsItemProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};

export default function SettingsItem({
  title,
  description,
  children,
}: SettingsItemProps) {
  return (
    <div className="x:flex x:flex-wrap x:items-center x:justify-between x:gap-8 x:py-4">
      <div>
        <div className="x:font-medium">{title}</div>
        {description != null && (
          <div className="x:text-sm x:text-muted-foreground">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}
