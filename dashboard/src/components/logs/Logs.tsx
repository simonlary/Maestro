export function Logs() {
  const logs = "";
  return (
    <div className="h-full flex justify-center p-4 ">
      <div className="p-4 w-full lg:w-11/12 2xl:w-2/3 bg-code rounded-md shadow-md overflow-auto">
        <code>{logs !== "" ? logs : "No Content"}</code>
      </div>
    </div>
  );
}
