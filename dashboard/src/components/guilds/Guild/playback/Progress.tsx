export function Progress({ minimum = 0, maximum = 100, value }: { minimum?: number; maximum?: number; value: number }) {
  const clampedValue = Math.min(Math.max(value, minimum), maximum);
  const percentage = ((clampedValue - minimum) / (maximum - minimum)) * 100;
  return (
    <div className="bg-gray-text h-0.5">
      <div
        className="bg-green w-full h-full"
        style={{ transform: `translateX(-${(100 - percentage) / 2}%) scaleX(${percentage}%)` }}
      ></div>
    </div>
  );
}
