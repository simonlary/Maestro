import { useEffect } from "react";
import { useLogsQuery } from "../../apollo/generated";

const dateFormatter = new Intl.DateTimeFormat("fr", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
});

export function Logs() {
  const { data, startPolling, stopPolling } = useLogsQuery({ variables: { limit: 200 } });

  useEffect(() => {
    startPolling(2000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const logs = data?.logs ?? [];

  return (
    <div className="h-full flex justify-center p-4 ">
      <div className="h-full w-full lg:w-11/12 2xl:w-2/3 bg-code rounded-md shadow-md">
        <div className="py-2 max-h-full flex flex-col-reverse overflow-auto">
          {logs.length === 0
            ? "No Content"
            : logs.map((log) => {
                const colorClass = log.level === "warning" ? "text-yellow" : log.level === "error" ? "text-red" : "";
                return (
                  <div key={log.id} className="flex gap-2 hover:bg-gray-2 hover:bg-opacity-20 px-2">
                    <code className="text-gray-5 shrink-0">{dateFormatter.format(+log.timestamp)}</code>
                    <code className={`whitespace-pre-wrap ${colorClass}`}>{log.message}</code>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
