import icon from "./background-icon.svg";

export function NoGuildPage() {
  return (
    <div className="flex items-center justify-center bg-gray-3 h-full w-full rounded-tl-md">
      <div className="flex-col w-96">
        <img className="w-full" src={icon} />
        <div className="w-full text-center text-soft-white">Select one of your servers in the side bar to start.</div>
      </div>
    </div>
  );
}
