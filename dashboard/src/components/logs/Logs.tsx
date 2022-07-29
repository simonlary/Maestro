import { useEffect, useState } from "react";
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
  const { data, startPolling, stopPolling } = useLogsQuery({ variables: { limit: 500 } });
  const [selectedLogId, setSelectedLogId] = useState<number>();

  useEffect(() => {
    startPolling(2000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const logs = data?.logs ?? [];
  const parsedLogs = logs.map((l) => ({ id: l.id, message: JSON.parse(l.message) }));

  return (
    <div className="h-full flex justify-center p-4 ">
      <div className="h-full w-full lg:w-11/12 2xl:w-2/3 bg-code rounded-md shadow-md">
        <div className="py-2 max-h-full flex flex-col-reverse overflow-auto">
          {parsedLogs.length === 0
            ? "No Content"
            : parsedLogs.map((l) => {
                return (
                  <div
                    key={l.id}
                    className="flex-col w-full gap-2 hover:bg-gray-2 hover:bg-opacity-20 px-2"
                    onClick={() => setSelectedLogId(l.id)}
                  >
                    <div className="flex gap-2 cursor-pointer">
                      <code className="text-gray-5 shrink-0">{dateFormatter.format(l.message.time)}</code>
                      <code
                        className={`${
                          l.message.level === "warn" ? "text-yellow" : l.message.level === "error" ? "text-red" : ""
                        }`}
                      >
                        {l.message.msg}
                      </code>
                    </div>
                    <code className={`${l.id === selectedLogId ? "block" : "hidden"} w-full overflow-x-auto`}>
                      {JSON.stringify(l)}
                    </code>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
