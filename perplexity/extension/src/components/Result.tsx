import TablerQuestionMark from "~icons/tabler/question-mark";

type ResultProps = {
  title: string;
  description: React.ReactNode;
  icon?: React.ElementType;
};

export function Result({
  title,
  description,
  icon: Icon = TablerQuestionMark,
}: ResultProps) {
  return (
    <div className="x:my-4 x:flex x:flex-col x:items-center x:justify-center x:gap-4 x:p-4">
      <div className="x:flex x:flex-col x:items-center x:gap-2 x:text-center">
        <Icon className="x:size-12 x:text-muted-foreground" />
        <h1 className="x:text-2xl x:font-semibold">{title}</h1>
        <div className="x:text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
