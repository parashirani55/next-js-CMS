"use client";

type Props = {
  onAddElement: (type: "heading" | "paragraph" | "html") => void;
  canAdd: boolean;
};

export default function ElementLibrary({
  onAddElement,
  canAdd,
}: Props) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">Elements</h4>

      {!canAdd && (
        <p className="text-xs text-gray-400 mb-2">
          Select a section to add elements
        </p>
      )}

      <div className="space-y-2">
        <button
          disabled={!canAdd}
          onClick={() => onAddElement("heading")}
          className={`w-full border px-2 py-2 text-left rounded text-sm
            ${canAdd ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed"}`}
        >
          Heading
        </button>

        <button
          disabled={!canAdd}
          onClick={() => onAddElement("paragraph")}
          className={`w-full border px-2 py-2 text-left rounded text-sm
            ${canAdd ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed"}`}
        >
          Paragraph
        </button>

        <button
          disabled={!canAdd}
          onClick={() => onAddElement("html")}
          className={`w-full border px-2 py-2 text-left rounded text-sm
            ${canAdd ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed"}`}
        >
          HTML
        </button>
      </div>
    </div>
  );
}
