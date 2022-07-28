export function NotAuthorized() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex-col text-center font-mono">
        <div className="text-3xl">🚫 Not Authorized 🚫</div>
        <div className="text-lg mt-4 mb-12">
          Sorry, but you don&apos;t have access to the page you&apos;re trying to view.
        </div>
        <div className="text-9xl">403</div>
      </div>
    </div>
  );
}
