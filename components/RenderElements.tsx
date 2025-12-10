"use client";

import { blockMap } from "./blocks";

export default function RenderElements({ elements }: any) {
  return (
    <>
      {elements.map((el: any) => {
        const Component = blockMap[el.type];
        if (!Component) return null;

        return (
          <div key={el.id} className="mb-4">
            <Component data={el.data} />
          </div>
        );
      })}
    </>
  );
}
