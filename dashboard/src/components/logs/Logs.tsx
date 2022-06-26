import { useEffect, useRef } from "react";
import { useLogsQuery } from "../../apollo/generated";

export function Logs() {
  const { data, startPolling, stopPolling } = useLogsQuery({ variables: { limit: 500 } });
  const scrollableView = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const logs = data?.logs ?? [];

  return (
    <div className="h-full flex justify-center p-4 ">
      <div className="h-full w-full lg:w-11/12 2xl:w-2/3 bg-code rounded-md shadow-md" ref={scrollableView}>
        <div className="py-2 h-full flex flex-col-reverse overflow-auto">
          {logs.length === 0
            ? "No Content"
            : logs.map((l) => {
                return (
                  <div key={l.id} className="flex gap-2 hover:bg-gray-2 hover:bg-opacity-20 px-2">
                    <code className="text-gray-5 shrink-0">{new Date(+l.timestamp).toISOString()}</code>
                    <code
                      className={`${l.level === "warning" ? "text-yellow" : l.level === "error" ? "text-red" : ""}`}
                    >
                      {l.message}
                    </code>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
