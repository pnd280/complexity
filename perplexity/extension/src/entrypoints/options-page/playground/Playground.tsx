import { toast } from "@/components/ui/use-toast";

const WrapperContext = createContext(null);

export function Playground() {
  const [count, setCount] = useState(0);

  return (
    <WrapperContext value={null}>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div>{count}</div>
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
    </WrapperContext>
  );
}
