// components/StyleEditor.tsx
"use client";

export default function StyleEditor({
  style = {},
  onChange,
}: {
  style?: any;
  onChange: (style: any) => void;
}) {
  const update = (partial: any) =>
    onChange({ ...(style || {}), ...partial });

  return (
    <div className="space-y-3">
      <h4 className="font-semibold mb-1">Style</h4>

      <label className="block text-sm">
        Padding
        <input
          className="border p-2 w-full"
          value={style.padding || ""}
          onChange={(e) => update({ padding: e.target.value })}
          placeholder="e.g. 80px 40px"
        />
      </label>

      <label className="block text-sm">
        Margin
        <input
          className="border p-2 w-full"
          value={style.margin || ""}
          onChange={(e) => update({ margin: e.target.value })}
          placeholder="e.g. 0 0 20px 0"
        />
      </label>

      <label className="block text-sm">
        Background Color
        <input
          type="color"
          className="w-full h-10"
          value={style.backgroundColor || "#ffffff"}
          onChange={(e) =>
            update({ backgroundColor: e.target.value })
          }
        />
      </label>

      <label className="block text-sm">
        Text Color
        <input
          type="color"
          className="w-full h-10"
          value={style.color || "#111111"}
          onChange={(e) => update({ color: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        Button Background
        <input
          type="color"
          className="w-full h-10"
          value={style.buttonBackground || "#111111"}
          onChange={(e) =>
            update({ buttonBackground: e.target.value })
          }
        />
      </label>

      <label className="block text-sm">
        Button Text Color
        <input
          type="color"
          className="w-full h-10"
          value={style.buttonColor || "#ffffff"}
          onChange={(e) => update({ buttonColor: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        Custom CSS (optional)
        <textarea
          className="border p-2 w-full"
          rows={4}
          value={style.customCSS || ""}
          onChange={(e) => update({ customCSS: e.target.value })}
          placeholder="/* use carefully, owner only */"
        />
      </label>
    </div>
  );
}
