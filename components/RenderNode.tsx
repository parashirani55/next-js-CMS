import React from "react";

type ElementNode = {
  id: string;
  type: "heading" | "paragraph" | "html";
  data: any;
};

type SectionNode = {
  id: string;
  type: "section";
  data: {
    style?: any;
    children: ElementNode[];
  };
};

export default function RenderNode({ node }: { node: SectionNode }) {
  if (node.type !== "section") return null;

  return (
    <section
      style={{
        padding: node.data?.style?.padding,
        maxWidth: node.data?.style?.maxWidth,
        margin: node.data?.style?.margin,
        backgroundColor: node.data?.style?.backgroundColor,
      }}
    >
      {node.data?.children?.map((el) => {
        switch (el.type) {
          case "heading":
            return (
              <h2 key={el.id} style={el.data?.style}>
                {el.data?.text}
              </h2>
            );

          case "paragraph":
            return (
              <p key={el.id} style={el.data?.style}>
                {el.data?.text}
              </p>
            );

          case "html":
            return (
              <div
                key={el.id}
                style={el.data?.style}
                dangerouslySetInnerHTML={{ __html: el.data?.html }}
              />
            );

          default:
            return null;
        }
      })}
    </section>
  );
}
