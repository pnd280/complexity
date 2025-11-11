export function Playground() {
  // "use no memo";

  const [count, setCount] = useState(0);

  return (
    <div className="x:flex x:gap-2">
      <HelloWorld />
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

function HelloWorld() {
  console.log("HelloWorld Component Rerender");

  return <div>Hello World</div>;
}
