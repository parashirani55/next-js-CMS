import { HeadingBlock } from "./blocks/HeadingBlock";
import { ParagraphBlock } from "./blocks/ParagraphBlock";
import { HtmlBlock } from "./blocks/HtmlBlock";

export default function RenderNodeServer({ node }: { node: any }) {
  if (!node) return null;

  // Section (recursive)
  if (node.type === "section") {
    return (
      <section style={node.data?.style}>
        {(node.data?.children || []).map((child: any) => (
          <RenderNodeServer key={child.id} node={child} />
        ))}
      </section>
    );
  }

  if (node.type === "heading") {
    return <HeadingBlock data={node.data} />;
  }

  if (node.type === "paragraph") {
    return <ParagraphBlock data={node.data} />;
  }

  if (node.type === "html") {
    return <HtmlBlock data={node.data} />;
  }

  return null;
}
