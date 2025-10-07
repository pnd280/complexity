import {
  FloatingPanel,
  FloatingPanelBody,
  FloatingPanelContent,
  FloatingPanelDragTrigger,
  FloatingPanelResizeTrigger,
  FloatingPanelTrigger,
} from "@/components/ui/floating-panel";

import TablerGripVertical from "~icons/tabler/grip-vertical";

export default function FloatingPanelTest() {
  const [size, setSize] = useState({ width: 1000, height: 500 });

  return (
    <div className="x:flex x:min-h-screen x:items-center x:justify-center">
      <FloatingPanel size={size} onSizeChange={({ size }) => setSize(size)}>
        <FloatingPanelTrigger>open</FloatingPanelTrigger>
        <FloatingPanelContent className="x:group x:overflow-hidden x:bg-secondary">
          <div className="x:flex x:h-0 x:items-center x:justify-between x:overflow-hidden x:bg-background x:transition-all x:group-hover:h-auto x:group-hover:p-2">
            <FloatingPanelDragTrigger className="x:ml-auto">
              <TablerGripVertical className="x:size-5 x:text-muted-foreground" />
            </FloatingPanelDragTrigger>
          </div>
          <FloatingPanelBody className="x:max-h-(--height)">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            possimus facilis, veniam voluptate incidunt aut dolorum at
            aspernatur voluptatibus eaque, nesciunt optio eos ducimus error,
            perspiciatis deserunt vel? Perferendis, consequuntur! Incidunt quas
            dolorum, quasi temporibus quod accusamus, maxime in laudantium
            distinctio libero, aliquam officia quibusdam iusto nostrum eligendi
            sapiente quae reprehenderit culpa voluptates minima! Inventore
            numquam dignissimos quo repellat natus! Aliquid quas quis impedit
            fuga eaque voluptas illo soluta, nemo voluptates assumenda
            praesentium perferendis libero nesciunt distinctio laudantium
            tempora laborum dolore sed nulla? Dicta nostrum suscipit minima ex
            dolorum corrupti! Enim placeat quos aliquid et minima similique cum
            fugiat, nobis rerum praesentium repellat ea totam vero. Facilis
            deserunt provident soluta. Sapiente voluptas commodi repudiandae
            pariatur quos tenetur corporis! Ipsum, atque. Sapiente labore dolor
            ipsam voluptas natus reiciendis ea amet voluptatum? Perspiciatis
            nisi excepturi laborum, ullam recusandae sit tempora aspernatur
            corrupti dolores architecto explicabo quaerat eum molestias eos
            doloremque quas dicta.
          </FloatingPanelBody>

          <FloatingPanelResizeTrigger axis="n" />
          <FloatingPanelResizeTrigger axis="e" />
          <FloatingPanelResizeTrigger axis="w" />
          <FloatingPanelResizeTrigger axis="s" />
          <FloatingPanelResizeTrigger axis="ne" />
          <FloatingPanelResizeTrigger axis="se" />
          <FloatingPanelResizeTrigger axis="sw" />
          <FloatingPanelResizeTrigger axis="nw" />
        </FloatingPanelContent>
      </FloatingPanel>
    </div>
  );
}
