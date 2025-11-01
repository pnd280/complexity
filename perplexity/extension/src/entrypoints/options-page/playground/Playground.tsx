import { toast } from "@/components/ui/use-toast";

export function Playground() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => {
          toast({
            title: count,
            description: "lorem ipsum dolor sit amet",
          });

          setCount(count + 1);
        }}
      >
        test
      </button>
    </div>
  );
}
