export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="h-7 w-32 bg-purple-100 rounded-lg animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-5 w-20 bg-purple-50 rounded-lg animate-pulse" />
          <div className="h-5 w-20 bg-purple-50 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="bg-white border-b border-purple-50 py-12">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 space-y-3">
          <div className="h-8 w-40 bg-purple-100 rounded animate-pulse" />
          <div className="h-4 w-80 bg-purple-50 rounded animate-pulse" />
        </div>
      </div>
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-purple-100/50 rounded-2xl overflow-hidden">
              <div className="w-full aspect-video bg-purple-50 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="flex gap-1.5">
                  <div className="h-4 w-12 bg-purple-100 rounded-full animate-pulse" />
                  <div className="h-4 w-16 bg-purple-100 rounded-full animate-pulse" />
                </div>
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-50 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
