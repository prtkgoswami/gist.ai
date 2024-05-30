import React from "react";

export const DataContainer = ({
  label,
  data,
}: {
  label?: string;
  data?: string;
}): React.ReactElement => {
  const dataItems = data?.split("\n").filter((dataItem) => dataItem);

  return (
    <div className="flex flex-col gap-3 border border-solid relative text-2xl text-zinc-200 px-5 py-4 text-wrap">
      <div className="absolute text-xs text-zinc-200 bg-zinc-950 left-3 -top-3 px-2 py-1 uppercase">
        {label}
      </div>
      {dataItems &&
        dataItems.map((dataItem, index) => (
          <p key={`dataItem-${index}`}>{dataItem}</p>
        ))}
    </div>
  );
};
