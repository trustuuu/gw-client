import React, { useEffect } from "react";
import { useState } from "react";
import Checkbox from "../../component/Checkbox";

function ApiUsersGroups({
  apiUsersAndGroups,
  parentCallback,
  //   onClickDel,
  //   onClickEdit,
  customClass,
  initCheckedItems,
}) {
  const [checkedItems, setCheckedItems] = useState(
    initCheckedItems ? initCheckedItems : []
  );
  useEffect(() => {
    setCheckedItems(initCheckedItems);
  }, [initCheckedItems]);

  const handleChangeCheck = function (e) {
    const item = e.target.name;
    const isChecked = e.target.checked;

    if (!item) return;

    if (isChecked) {
      parentCallback([
        ...checkedItems,
        ...apiUsersAndGroups.filter((i) => i.id === item),
      ]);
      setCheckedItems([
        ...checkedItems,
        ...apiUsersAndGroups.filter((i) => i.id === item),
      ]);
    } else {
      parentCallback(checkedItems.filter((i) => i.id !== item));
      setCheckedItems(checkedItems.filter((i) => i.id !== item));
    }
  };
  return (
    <div className="p-3">
      {/* Apis */}
      <div>
        <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
          Users And Groups
        </header>
        <ul className={customClass ? customClass : "my-1 overflow-y-auto"}>
          {/* Item */}
          <li className="grid grid-cols-10 px-2">
            <div className="col-span-1 self-center"></div>
            <div className="col-span-3 self-center uppercase">Display</div>
            <div className="col-span-3 text-left uppercase">Object Type</div>
            <div className="col-span-3 shrink-0 self-end">Role assigned</div>
          </li>
          {apiUsersAndGroups ? (
            apiUsersAndGroups.map((scope) => {
              return (
                <li
                  className="grid grid-cols-10 px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer"
                  key={scope.id}
                >
                  <div className="col-span-1 self-center">
                    {handleChangeCheck ? (
                      <Checkbox
                        name={scope.id}
                        id={scope.id}
                        checked={
                          checkedItems.filter((i) => i.id === scope.id).length >
                          0
                        }
                        onChange={handleChangeCheck}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col-span-3 self-center">
                    {scope ? scope.displayName : ""}
                  </div>
                  <div className="col-span-3 text-left">
                    {scope ? scope.objectType : ""}
                  </div>
                  <div className="col-span-3 text-left justify-self-start">
                    {scope ? scope.role : ""}
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

export default ApiUsersGroups;
