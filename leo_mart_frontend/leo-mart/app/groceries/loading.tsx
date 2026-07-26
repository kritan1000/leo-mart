export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="h-7 w-32 bg-purple-100 rounded-lg animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-5 w-20 bg-purple-50 rounded-lg animate-pulse" />
          <div className="h-5 w-20 bg-purple-50 rounded-lg animate-pulse" />
          <div className="h-5 w-20 bg-purple-50 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-8 flex gap-8">
        <aside className="w-60 shrink-0 space-y-6">
          <div className="bg-white border border-purple-100/60 rounded-2xl p-5 space-y-4">
            <div className="h-3 w-16 bg-purple-100 rounded animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-3 bg-purple-50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </aside>
        <section className="flex-1 space-y-6">
          <div className="h-6 w-48 bg-purple-100 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-purple-100/50 rounded-2xl p-4 space-y-4">
                <div className="aspect-square bg-purple-50 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-purple-100 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
