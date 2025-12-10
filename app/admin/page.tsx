import { supabase } from "@/lib/supabase/client";
import RenderBlocks from "@/components/RenderBlocks";

export default async function HomePage() {
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", "/")
    .eq("status", "published")
    .single();

  if (!page) return <h1>Home not found</h1>;

  return (
    <main>
      {/* ✅ editable NOT passed */}
      <RenderBlocks blocks={page.blocks} />
    </main>
  );
}
