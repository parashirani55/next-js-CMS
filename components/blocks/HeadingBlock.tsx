export function HeadingBlock({ data }: any) {
  const Tag = data.tag || "h2";
  return <Tag style={data.style}>{data.text}</Tag>;
}
