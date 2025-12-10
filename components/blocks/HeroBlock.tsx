// components/blocks/HeroBlock.tsx
export default function HeroBlock({ data }: { data: any }) {
  const style = data.style || {};

  return (
    <section
      style={{
        padding: style.padding || "80px 40px",
        margin: style.margin || "",
        backgroundColor: style.backgroundColor || "transparent",
        color: style.color || "#111",
        textAlign: style.textAlign || "left", // 👈 important
      }}
    >
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>{data.title}</h1>
      {data.subtitle && (
        <p style={{ fontSize: 18, marginBottom: 16, color: "#4b5563" }}>
          {data.subtitle}
        </p>
      )}
      {data.buttonText && (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: style.buttonBackground || "#111",
            color: style.buttonColor || "#fff",
            borderRadius: 6,
            border: "none",
          }}
        >
          {data.buttonText}
        </button>
      )}
    </section>
  );
}
