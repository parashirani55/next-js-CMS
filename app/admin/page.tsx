import { supabase } from "@/lib/supabase/client";
// import RenderBlocksServer from "@/components/RenderBlocksServer";

export default async function HomePage() {
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", "/")
    .eq("status", "published")
    .single();

  if (!page) return <main>Home not found</main>;

  return (
    <main>
      <div className="prose mx-auto">
  {page?.title}
</div>

    </main>
  );
}
