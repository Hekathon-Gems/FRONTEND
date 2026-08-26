export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="w-full animate-pulse space-y-4 lg:w-64 lg:shrink-0">
          <div className="h-5 w-24 rounded bg-border" />
          <div className="h-32 rounded bg-border" />
          <div className="h-32 rounded bg-border" />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-square rounded-md bg-border" />
                <div className="h-4 w-3/4 rounded bg-border" />
                <div className="h-4 w-1/3 rounded bg-border" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
