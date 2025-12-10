export default function HeroBlock({ data }: { data: any }) {
  return (
    <section style={{ padding: "80px 40px", textAlign: "center" }}>
      <h1 style={{ fontSize: 42, color: "#111" }}>{data.title}</h1>
      <p style={{ fontSize: 18, marginTop: 10, color: "#4b5563" }}>
        {data.subtitle}
      </p>

      {data.buttonText && (
        <button
          style={{
            marginTop: 20,
            padding: "12px 24px",
            background: "#111",
            color: "#fff",
          }}
        >
          {data.buttonText}
        </button>
      )}
    </section>
  );
}
