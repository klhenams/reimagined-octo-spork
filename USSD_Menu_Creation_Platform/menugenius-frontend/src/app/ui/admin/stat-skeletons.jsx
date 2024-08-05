export function CardSkeleton() {
  return (
    <div className="animate-pulse flex items-center w-full h-24 bg-gray-200 rounded-2xl p-4 gap-4">
      <div className="animate-pulse bg-gray-300 h-14 w-14 rounded-full flex justify-center items-center"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
}
