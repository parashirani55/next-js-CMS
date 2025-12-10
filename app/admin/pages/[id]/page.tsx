"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RenderBlocks from "@/components/RenderBlocks";

export default function PageEditor() {
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<any>(null);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("pages")
      .select("*")
      .eq("id", pageId)
      .single()
      .then(({ data }) => {
        if (data?.blocks == null) {
          data.blocks = [];
        }
        setPage(data);
      });
  }, [pageId]);

  if (!page) return <p>Loading...</p>;

  const addHeroBlock = () => {
    const newBlock = {
      id: crypto.randomUUID(),
      type: "hero",
      data: {
        title: "Hero Title",
        subtitle: "Edit from right panel",
        buttonText: "Click Me",
      },
    };

    setPage({
      ...page,
      blocks: [...page.blocks, newBlock],
    });

    setActiveBlock(page.blocks.length);
  };

  const updateBlockData = (key: string, value: string) => {
    const updatedBlocks = [...page.blocks];
    updatedBlocks[activeBlock!].data[key] = value;

    setPage({
      ...page,
      blocks: updatedBlocks,
    });
  };

  const savePage = async () => {
    await supabase
      .from("pages")
      .update({ blocks: page.blocks })
      .eq("id", page.id);

    alert("Saved ✅");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold">Editing: {page.title}</h1>
        <button
          onClick={savePage}
          className="bg-black text-white px-4 py-2"
        >
          Save
        </button>
      </div>

      {/* Builder */}
      <div className="flex flex-1 gap-4">
        {/* Block Adder */}
        <aside className="w-64 bg-white p-4 border">
          <h3 className="font-bold mb-3">Blocks</h3>
          <button
            onClick={addHeroBlock}
            className="w-full text-left mb-2"
          >
            ➕ Hero Block
          </button>
        </aside>

        {/* Live Preview */}
        <main className="flex-1 bg-white border p-4 overflow-auto">
          <RenderBlocks
            blocks={page.blocks}
            editable
            onSelect={setActiveBlock}
          />
        </main>

        {/* Block Editor */}
        <aside className="w-72 bg-white p-4 border">
          {activeBlock === null ? (
            <p className="text-gray-500">Select a block to edit</p>
          ) : (
            <>
              <h3 className="font-bold mb-3">Block Settings</h3>

              {Object.keys(page.blocks[activeBlock].data).map((key) => (
                <div key={key} className="mb-3">
                  <label className="text-sm block mb-1">{key}</label>
                  <input
                    className="border w-full p-2"
                    value={page.blocks[activeBlock].data[key]}
                    onChange={(e) =>
                      updateBlockData(key, e.target.value)
                    }
                  />
                </div>
              ))}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
