export function HtmlBlock({ data }: any) {
  return (
    <div dangerouslySetInnerHTML={{ __html: data.html }} />
  );
}
