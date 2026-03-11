import { useState } from "react";
import Checkbox from "../../component/Checkbox";

function ApisSystem({
  apis,
  parentCallback,
  onClickView,
  onClickEdit,
  customClass,
}) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const handleChangeCheck = function (e) {
    const item = e.target.name;
    const isChecked = e.target.checked;

    if (!item) return;

    if (isChecked) {
      parentCallback([...checkedItems, ...apis.filter((i) => i.id == item)]);
      setCheckedItems([...checkedItems, ...apis.filter((i) => i.id == item)]);
    } else {
      parentCallback(checkedItems.filter((i) => i.id != item));
      setCheckedItems(checkedItems.filter((i) => i.id != item));
    }
  };

  return (
    <div className="p-3">
      {/* Apis */}
      <div>
        <header className="text-xs uppercase dark:bg-opacity-50 rounded-sm font-semibold p-2">
          Service Permissions
        </header>
        <ul className={customClass ? customClass : "my-1 overflow-y-auto"}>
          {/* Item */}
          <li className="flex px-2 font-bold">
            <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
              <div className="grow flex">
                <div className="self-center uppercase w-1/6 min-w-48">Name</div>
              </div>
            </div>
          </li>
          {apis ? (
            apis.map((api) => {
              return (
                <li
                  className={
                    selected === api.id
                      ? "bg-indigo-400 flex px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer"
                      : "flex px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer"
                  }
                  key={api.id}
                  onClick={() => setSelected(api.id)}
                >
                  <div className="grow flex items-center text-sm py-2">
                    <div
                      className="grow flex"
                      onClick={onClickView ? onClickView.bind(this, api) : null}
                    >
                      <div className="self-center  w-1/6 min-w-48">
                        {api ? api.name : ""}
                      </div>
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

export default ApisSystem;
