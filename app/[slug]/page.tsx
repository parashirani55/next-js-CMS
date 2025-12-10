import { supabase } from "@/lib/supabase/client";
import RenderBlocks from "@/components/RenderBlocks";

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
      <RenderBlocks blocks={page.blocks} />
    </main>
  );
}
