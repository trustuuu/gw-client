import { useEffect, useState } from "react";
import Checkbox from "../../component/Checkbox";
import { SCIM } from "../../types/SCIM";
type SCIMsProps = {
  scims: SCIM[];
  parentCallback: (items: string[]) => void;
  loading?: boolean;
  onClickView: (scim: SCIM) => void;
  onClickEdit: (scim: SCIM) => void;
};

function SCIMList({
  scims,
  parentCallback,
  loading,
  onClickView,
  onClickEdit,
}: SCIMsProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleChangeCheck = function (e: React.ChangeEvent<HTMLInputElement>) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    if (isChecked) {
      const newItems = [...checkedItems, item];
      parentCallback(newItems);
      setCheckedItems(newItems);
    } else {
      const newItems = checkedItems.filter((i) => i != item);
      parentCallback(newItems);
      setCheckedItems(newItems);
    }
  };

  useEffect(() => {
    setCheckedItems([]);
  }, [scims]);

  if (loading) {
    return <h2>...loading</h2>;
  }

  return (
    <div className="p-3">
      <div>
        <header className="text-xs uppercase dark:bg-opacity-50 rounded-sm font-semibold p-2">
          SCIMs
        </header>
        <ul className="my-1">
          {/* Header */}
          <li className="flex px-2 font-bold">
            <div className="self-center mr-7"></div>
            <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
              <div className="grow flex">
                <div className="self-center uppercase w-1/6 min-w-48">Name</div>
                <div className="text-left uppercase justify-self-start w-4/6">
                  Display Name
                </div>
                <div className="shrink-0 self-end ml-2 w-1/6">
                  <a
                    className="font-medium uppercase text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    href="#0"
                  >
                    Action
                  </a>
                </div>
              </div>
            </div>
          </li>
          {scims && scims.length > 0 ? (
            scims.map((scim) => {
              return (
                <li
                  className="flex px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer"
                  key={scim.id}
                >
                  <div className="self-center mr-3">
                    <Checkbox
                      name={scim.id}
                      id={scim.id}
                      checked={checkedItems.indexOf(scim.id) > -1}
                      onChange={handleChangeCheck}
                    />
                  </div>
                  <div className="grow flex items-center text-sm py-2">
                    <div
                      className="grow flex"
                      onClick={() => onClickView(scim)}
                    >
                      <div className="self-center uppercase w-1/6 min-w-48">
                        {scim.name}
                      </div>
                      <div className="text-left justify-self-start w-4/6">
                        {scim.displayName}
                      </div>
                    </div>
                    <div
                      className="shrink-0 self-end ml-2 w-1/6"
                      onClick={() => onClickEdit(scim)}
                    >
                      <a className="font-medium text-indigo-500 hover:text-yellow-600 dark:hover:text-yellow-400">
                        Edit
                      </a>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <div></div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SCIMList;
