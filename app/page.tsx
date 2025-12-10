import { supabase } from "@/lib/supabase/client";
import RenderNode from "@/components/RenderNode";

export default async function HomePage() {
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", "/")
    .eq("status", "published")
    .limit(1);

  const page = data?.[0];
  if (!page) return <main>Home not found</main>;

  return (
    <main className="mx-auto max-w-5xl">
      {/* Page title (optional) */}
      <h1 className="text-3xl font-bold my-6 text-center">
        {page.title}
      </h1>

      {/* RENDER BLOCKS */}
      {Array.isArray(page.blocks) &&
        page.blocks.map((node: any) => (
          <RenderNode key={node.id} node={node} />
        ))}
    </main>
  );
}
