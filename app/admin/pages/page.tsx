"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("pages").select("*").order("created_at").then(({ data }) => {
      if (data) setPages(data);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Pages</h1>
        <button className="bg-black text-white px-4 py-2">+ New Page</button>
      </div>

      {pages.map((page) => (
        <div
          key={page.id}
          className="bg-white p-4 mb-2 flex justify-between"
        >
          <div>
            <p className="font-medium">{page.title}</p>
            <small>{page.slug}</small>
          </div>
          <Link
            href={`/admin/pages/${page.id}`}
            className="text-blue-600"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}
