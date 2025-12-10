import { supabase } from "@/lib/supabase/client";
import RenderNode from "@/components/RenderNode";
import RenderNodeServer from "@/components/RenderNodeServer";

export default async function Page({ params }: { params: { slug: string } }) {
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!page) return <h1>Page not found</h1>;

  return (
<main>
  {(page.blocks || []).map((node: any) => (
    <RenderNodeServer key={node.id} node={node} />
  ))}
</main>


  );
}
