"use client";

import { blockMap } from "./blocks";

export default function RenderBlocks({
  blocks,
  editable = false,
  onSelect,
}: {
  blocks: any[];
  editable?: boolean;
  onSelect?: (idx: number) => void;
}) {
  return (
    <>
      {blocks.map((block, index) => {
        const BlockComponent = blockMap[block.type];
        if (!BlockComponent) return null;

        // ✅ ONLY add onClick in admin mode
        if (editable) {
          return (
            <div
              key={block.id}
              onClick={() => onSelect?.(index)}
              className="hover:outline hover:outline-1 hover:outline-gray-400 cursor-pointer"
            >
              <BlockComponent data={block.data} />
            </div>
          );
        }

        // ✅ Frontend render (NO EVENTS)
        return (
          <div key={block.id}>
            <BlockComponent data={block.data} />
          </div>
        );
      })}
    </>
  );
}
