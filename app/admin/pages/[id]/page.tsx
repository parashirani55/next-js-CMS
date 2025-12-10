"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import StyleEditor from "@/components/StyleEditor";
import SectionBlock from "@/components/blocks/SectionBlock";
import ElementLibrary from "@/components/ElementLibrary";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------------- TYPES ---------------- */

type ElementType = "heading" | "paragraph" | "html";

type ElementNode = {
  id: string;
  type: ElementType;
  data: {
    text?: string;
    tag?: string;
    html?: string;
    style: Record<string, any>;
  };
};

type SectionNode = {
  id: string;
  type: "section";
  data: {
    style: Record<string, any>;
    children: ElementNode[];
  };
};

type ActiveNode =
  | { kind: "section"; sectionId: string }
  | { kind: "element"; sectionId: string; elementId: string }
  | null;

/* ---------------- SORTABLE WRAPPER (SECTIONS) ---------------- */

function SortableSection({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-4 text-xs text-gray-400 cursor-grab select-none"
      >
        ⋮⋮
      </div>
      {children}
    </div>
  );
}

/* ---------------- PAGE EDITOR ---------------- */

export default function PageEditor() {
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<{
    id: string;
    title: string;
    slug?: string;
    blocks: SectionNode[];
  } | null>(null);

  const [activeNode, setActiveNode] = useState<ActiveNode>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  /* ---------------- LOAD PAGE ---------------- */

  useEffect(() => {
    if (!pageId) return;

    (async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setPage({
        ...data,
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
      });
    })();
  }, [pageId]);

  if (!page) return <div className="p-6">Loading…</div>;

  /* ---------------- HELPERS ---------------- */

  const updateSections = (fn: (sections: SectionNode[]) => SectionNode[]) => {
    setPage({ ...page, blocks: fn(page.blocks) });
  };

  const createElement = (type: ElementType): ElementNode => {
    switch (type) {
      case "heading":
        return {
          id: crypto.randomUUID(),
          type,
          data: { text: "Heading", tag: "h2", style: {} },
        };
      case "paragraph":
        return {
          id: crypto.randomUUID(),
          type,
          data: { text: "Paragraph text", style: {} },
        };
      case "html":
        return {
          id: crypto.randomUUID(),
          type,
          data: { html: "<p>Custom HTML</p>", style: {} },
        };
    }
  };

  const selectedSectionId =
    activeNode?.kind === "section"
      ? activeNode.sectionId
      : activeNode?.kind === "element"
      ? activeNode.sectionId
      : null;

  /* ---------------- ACTIONS ---------------- */

  const addSection = () => {
    const section: SectionNode = {
      id: crypto.randomUUID(),
      type: "section",
      data: {
        style: {
          padding: "60px",
          maxWidth: "1200px",
          margin: "0 auto",
        },
        children: [],
      },
    };

    updateSections((s) => [...s, section]);
    setActiveNode({ kind: "section", sectionId: section.id });
  };

  const deleteSection = (sectionId: string) => {
    if (!confirm("Delete this section?")) return;

    setPage({
      ...page,
      blocks: page.blocks.filter((s) => s.id !== sectionId),
    });

    setActiveNode(null);
  };

  const addElement = (sectionId: string, type: ElementType) => {
    const element = createElement(type);

    updateSections((sections) =>
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              data: {
                ...s.data,
                children: [...s.data.children, element],
              },
            }
          : s
      )
    );

    setActiveNode({ kind: "element", sectionId, elementId: element.id });
  };

  const updateElementData = (
    sectionId: string,
    elementId: string,
    partial: any
  ) => {
    updateSections((sections) =>
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              data: {
                ...s.data,
                children: s.data.children.map((el) =>
                  el.id === elementId
                    ? { ...el, data: { ...el.data, ...partial } }
                    : el
                ),
              },
            }
          : s
      )
    );
  };

  const moveElement = (
    sectionId: string,
    elementId: string,
    dir: "up" | "down"
  ) => {
    updateSections((sections) =>
      sections.map((s) => {
        if (s.id !== sectionId) return s;

        const items = [...s.data.children];
        const index = items.findIndex((el) => el.id === elementId);
        if (index === -1) return s;

        const next = dir === "up" ? index - 1 : index + 1;
        if (next < 0 || next >= items.length) return s;

        const [moved] = items.splice(index, 1);
        items.splice(next, 0, moved);

        return {
          ...s,
          data: { ...s.data, children: items },
        };
      })
    );
  };

  const deleteElement = (sectionId: string, elementId: string) => {
    if (!confirm("Delete element?")) return;

    updateSections((sections) =>
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              data: {
                ...s.data,
                children: s.data.children.filter((el) => el.id !== elementId),
              },
            }
          : s
      )
    );

    setActiveNode(null);
  };

  /* ---------------- STYLE UPDATE ---------------- */

  const updateStyle = (style: any) => {
    if (!activeNode) return;

    updateSections((sections) =>
      sections.map((s) => {
        if (s.id !== activeNode.sectionId) return s;

        if (activeNode.kind === "section") {
          return {
            ...s,
            data: {
              ...s.data,
              style: { ...s.data.style, ...style },
            },
          };
        }

        return {
          ...s,
          data: {
            ...s.data,
            children: s.data.children.map((el) =>
              el.id === activeNode.elementId
                ? {
                    ...el,
                    data: {
                      ...el.data,
                      style: { ...el.data.style, ...style },
                    },
                  }
                : el
            ),
          },
        };
      })
    );
  };

  /* ---------------- ACTIVE ---------------- */

  const activeSection =
    activeNode && page.blocks.find((s) => s.id === activeNode.sectionId);

  const activeElement =
    activeNode?.kind === "element"
      ? activeSection?.data.children.find(
          (el) => el.id === activeNode.elementId
        )
      : null;

  const activeStyle =
    activeNode?.kind === "section"
      ? activeSection?.data.style
      : activeElement?.data.style;

  /* ---------------- DnD HANDLER (SECTIONS) ---------------- */

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = page.blocks.findIndex((s) => s.id === active.id);
    const newIndex = page.blocks.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newBlocks = arrayMove(page.blocks, oldIndex, newIndex);
    setPage({ ...page, blocks: newBlocks });
  };

  /* ---------------- SAVE ---------------- */

  const save = async () => {
    await supabase
      .from("pages")
      .update({ blocks: page.blocks })
      .eq("id", page.id);
    alert("Saved ✅");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <div>
          <h2 className="font-bold">{page.title}</h2>
          {page.slug && (
            <p className="text-xs text-gray-500">/{page.slug}</p>
          )}
        </div>
        <button
          onClick={save}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-56 border-r p-3 space-y-3 sticky top-0 h-screen overflow-y-auto bg-white">
          <button
            onClick={addSection}
            className="w-full border p-2 rounded"
          >
            + Section
          </button>

          <ElementLibrary
            canAdd={!!selectedSectionId}
            onAddElement={(type) =>
              selectedSectionId && addElement(selectedSectionId, type)
            }
          />
        </aside>

        {/* CANVAS */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-5xl mx-auto p-6 space-y-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={page.blocks.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {page.blocks.map((section) => (
                  <SortableSection key={section.id} id={section.id}>
                    <SectionBlock
                      data={section.data}
                      editable
                      isActive={
                        activeNode?.kind === "section" &&
                        activeNode.sectionId === section.id
                      }
                      activeElementId={
                        activeNode?.kind === "element" &&
                        activeNode.sectionId === section.id
                          ? activeNode.elementId
                          : null
                      }
                      onSelectSection={() =>
                        setActiveNode({
                          kind: "section",
                          sectionId: section.id,
                        })
                      }
                      onDeleteSection={() => deleteSection(section.id)}
                      onAddElement={(type) => addElement(section.id, type)}
                      onSelectElement={(elementId) =>
                        setActiveNode({
                          kind: "element",
                          sectionId: section.id,
                          elementId,
                        })
                      }
                      onMoveElement={(elementId, dir) =>
                        moveElement(section.id, elementId, dir)
                      }
                      onDeleteElement={(id) =>
                        deleteElement(section.id, id)
                      }
                    />
                  </SortableSection>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-72 border-l p-4 sticky top-0 h-screen overflow-y-auto bg-white">
          {!activeNode ? (
            <p className="text-gray-400">Select a section or element</p>
          ) : (
            <>
              {activeElement && (
                <>
                  {activeElement.type === "heading" && (
                    <input
                      className="border p-2 w-full mb-3"
                      value={activeElement.data.text}
                      onChange={(e) =>
                        updateElementData(
                          activeSection!.id,
                          activeElement.id,
                          { text: e.target.value }
                        )
                      }
                    />
                  )}

                  {activeElement.type === "paragraph" && (
                    <textarea
                      className="border p-2 w-full mb-3"
                      rows={4}
                      value={activeElement.data.text}
                      onChange={(e) =>
                        updateElementData(
                          activeSection!.id,
                          activeElement.id,
                          { text: e.target.value }
                        )
                      }
                    />
                  )}

                  {activeElement.type === "html" && (
                    <textarea
                      className="border p-2 w-full mb-3 font-mono text-xs"
                      rows={5}
                      value={activeElement.data.html}
                      onChange={(e) =>
                        updateElementData(
                          activeSection!.id,
                          activeElement.id,
                          { html: e.target.value }
                        )
                      }
                    />
                  )}
                </>
              )}

              {activeStyle && (
                <StyleEditor style={activeStyle} onChange={updateStyle} />
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
