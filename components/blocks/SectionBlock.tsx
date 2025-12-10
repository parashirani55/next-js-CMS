"use client";

import { HeadingBlock } from "./HeadingBlock";
import { ParagraphBlock } from "./ParagraphBlock";
import { HtmlBlock } from "./HtmlBlock";

type ElementType = "heading" | "paragraph" | "html";

type SectionBlockProps = {
  data: any;
  editable?: boolean;

  isActive?: boolean;
  activeElementId?: string | null;

  onSelectSection: () => void;
  onDeleteSection: () => void;

  onAddElement: (type: ElementType) => void;
  onSelectElement: (id: string) => void;
  onMoveElement?: (id: string, dir: "up" | "down") => void;
  onDeleteElement: (id: string) => void;
};

export default function SectionBlock({
  data,
  editable = false,
  isActive = false,
  activeElementId,

  onSelectSection,
  onDeleteSection,
  onAddElement,
  onSelectElement,
  onMoveElement,
  onDeleteElement,
}: SectionBlockProps) {
  const children = Array.isArray(data?.children) ? data.children : [];

  const renderElement = (el: any) => {
    switch (el.type) {
      case "heading":
        return <HeadingBlock data={el.data} />;
      case "paragraph":
        return <ParagraphBlock data={el.data} />;
      case "html":
        return <HtmlBlock data={el.data} />;
      default:
        return null;
    }
  };

  return (
    <section
      className={`relative rounded-md transition ${
        editable ? "group" : ""
      } ${isActive ? "outline outline-2 outline-blue-500" : ""}`}
      style={{
        padding: data?.style?.padding ?? "60px",
        maxWidth: data?.style?.maxWidth ?? "1200px",
        margin: data?.style?.margin ?? "0 auto",
        backgroundColor: data?.style?.backgroundColor ?? "transparent",
        border: editable ? "1px dashed #e5e7eb" : "none",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSection();
      }}
    >
      {/* SECTION TOOLBAR */}
      {editable && isActive && (
        <div
          className="absolute -top-8 right-0 z-20 flex items-center gap-2
                     bg-black text-white text-xs px-2 py-1 rounded shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="opacity-70">Section</span>
          <button
            onClick={onDeleteSection}
            className="text-red-400 px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* EMPTY SECTION */}
      {children.length === 0 && editable && (
        <div
          className="text-center text-gray-400 py-12"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-3">Empty section</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <AddBtn onClick={() => onAddElement("heading")} label="Heading" />
            <AddBtn onClick={() => onAddElement("paragraph")} label="Text" />
            <AddBtn onClick={() => onAddElement("html")} label="HTML" />
          </div>
        </div>
      )}

      {/* ELEMENTS LIST */}
      {children.map((el: any) => {
        const isSelected = activeElementId === el.id;

        return (
          <div
            key={el.id}
            className={`relative mb-4 rounded ${
              editable
                ? "hover:outline hover:outline-1 hover:outline-gray-300 cursor-pointer"
                : ""
            } ${isSelected ? "outline outline-2 outline-blue-500" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(el.id);
            }}
          >
            {/* ELEMENT TOOLBAR (only when selected) */}
            {editable && isSelected && (
              <div
                className="absolute -top-7 left-0 z-10 flex items-center gap-1
                           bg-black text-white text-xs px-2 py-1 rounded shadow"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="opacity-70 capitalize">{el.type}</span>

                {onMoveElement && (
                  <>
                    <Btn onClick={() => onMoveElement(el.id, "up")}>↑</Btn>
                    <Btn onClick={() => onMoveElement(el.id, "down")}>↓</Btn>
                  </>
                )}

                <Btn danger onClick={() => onDeleteElement(el.id)}>✕</Btn>
              </div>
            )}

            {/* CONTENT */}
            <div className="px-2 py-2">{renderElement(el)}</div>
          </div>
        );
      })}
    </section>
  );
}

/* ---------- SMALL UI PARTS ---------- */

function AddBtn({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="border px-3 py-1 text-xs rounded hover:bg-gray-50"
    >
      + {label}
    </button>
  );
}

function Btn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-1 ${
        danger ? "text-red-400" : "text-white"
      } hover:opacity-80`}
    >
      {children}
    </button>
  );
}
