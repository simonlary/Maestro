export function Progress({ percentage }: { percentage: number }) {
  return (
    <div className="bg-gray-text h-0.5">
      <div
        className="bg-green w-full h-full"
        style={{ transform: `translateX(-${(100 - percentage) / 2}%) scaleX(${percentage}%)` }}
      ></div>
    </div>
  );
}
