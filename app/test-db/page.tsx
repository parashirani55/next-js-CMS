"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestDB() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("test_table")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setRows(data || []);
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Supabase Connection Test</h2>
      {rows.map((row) => (
        <p key={row.id}>{row.name}</p>
      ))}
    </div>
  );
}
