export default function ProductLoading() {
  return (
    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2">
      <div className="animate-pulse space-y-4">
        <div className="aspect-square rounded-lg bg-border" />
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-border" />
          ))}
        </div>
      </div>
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded bg-border" />
        <div className="h-9 w-3/4 rounded bg-border" />
        <div className="h-7 w-1/3 rounded bg-border" />
        <div className="h-20 rounded bg-border" />
        <div className="h-11 w-full rounded bg-border" />
      </div>
    </div>
  );
}
