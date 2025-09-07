// --- simple skeleton
const Sk = ({ w = 'w-20' }: { w?: string }) => (
  <span
    className={`inline-block h-3 rounded bg-gray-200/60 dark:bg-gray-700/60 ${w} animate-pulse`}
  />
);

// --- skeletons-rows
export const TableSkeletonRows = ({ colCount, rows = 12 }: { colCount: number; rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/40' : ''}`}>
          {Array.from({ length: colCount }).map((__, j) => (
            <td key={j} className="px-3 py-2">
              <div className="flex justify-end">
                <Sk w={j === 0 ? 'w-40' : j === 1 ? 'w-16' : 'w-24'} />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// --- overlay loader
export const LoadingOverlay = () => {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/20">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
    </div>
  );
};
