// components/blocks/TextBlock.tsx
export default function TextBlock({ data }: { data: any }) {
  const style = data.style || {};

  return (
    <section
      style={{
        padding: style.padding || "20px 0",
        margin: style.margin || "",
        backgroundColor: style.backgroundColor || "transparent",
        color: style.color || "#374151",
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: data.html || `<p>${data.text || ""}</p>`,
        }}
      />
    </section>
  );
}
