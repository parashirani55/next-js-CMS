export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-bold text-lg mb-6">KS CMS</h2>
        <nav className="space-y-3">
          <a href="/admin/pages" className="block">Pages</a>
          <a href="/admin/blogs" className="block">Blogs</a>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
