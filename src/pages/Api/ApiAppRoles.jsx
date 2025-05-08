import React from "react";
import { useState } from "react";
import Checkbox from "../../component/Checkbox";

function ApiAppRoles({
  roles,
  parentCallback,
  onClickDel,
  onClickEdit,
  customClass,
  signleMode,
}) {
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedRole, setSelectRole] = useState({});
  const handleChangeCheck = function (e) {
    const item = e.target.name;
    const isChecked = e.target.checked;

    if (!item) return;

    if (isChecked) {
      parentCallback([...checkedItems, ...roles.filter((i) => i.id === item)]);
      setCheckedItems([...checkedItems, ...roles.filter((i) => i.id === item)]);
    } else {
      parentCallback(checkedItems.filter((i) => i.id !== item));
      setCheckedItems(checkedItems.filter((i) => i.id !== item));
    }
  };

  const singleSelect = (role) => {
    parentCallback(role);
    setSelectRole(role);
  };
  return (
    <div className="p-3">
      {/* Apis */}
      <div>
        <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
          App Roles
        </header>
        <ul className={customClass ? customClass : "my-1 overflow-y-auto"}>
          {/* Item */}
          <li className="grid grid-cols-20 gap-2 px-2 py-2 border-b text-sm font-semibold uppercase text-slate-700 dark:text-slate-300">
            <div className="col-span-1"></div>
            <div className="col-span-4">Display Name</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-2">ID</div>
            <div className="col-span-2">State</div>
            {onClickEdit || onClickDel ? (
              <div className="col-span-2 text-center">Action</div>
            ) : null}
          </li>
          {roles ? (
            roles.map((role) => {
              return (
                <li
                  key={role.id}
                  className={`${
                    selectedRole.id === role.id ? "bg-indigo-400" : ""
                  } grid grid-cols-20 gap-2 px-2 py-2 border-b text-sm hover:bg-indigo-100 dark:hover:bg-indigo-400`}
                  onClick={signleMode ? () => singleSelect(role) : null}
                >
                  <div className="self-center mr-3 col-span-1">
                    {!signleMode ? (
                      <Checkbox
                        name={role.id}
                        id={role.id}
                        checked={
                          checkedItems.filter((i) => i.id === role.id).length >
                          0
                        }
                        onChange={handleChangeCheck}
                      />
                    ) : null}
                  </div>
                  <div className="truncate col-span-4">{role.displayName}</div>
                  <div className="truncate col-span-4">{role.description}</div>
                  <div className="truncate col-span-3">
                    {role.allowedMemberType}
                  </div>
                  <div className="truncate col-span-2">{role.value}</div>
                  <div className="truncate col-span-2">{role.id}</div>
                  <div className="col-span-2">
                    {role.enable ? "enabled" : "disabled"}
                  </div>
                  <div className="flex flex-row gap-3 justify-between items-center  col-span-2">
                    {onClickEdit ? (
                      <div
                        className="text-indigo-500 hover:text-yellow-600 cursor-pointer"
                        onClick={() => onClickEdit?.(role)}
                      >
                        Edit
                      </div>
                    ) : null}
                    {onClickDel ? (
                      <div
                        className="text-indigo-500 hover:text-red-600 cursor-pointer"
                        onClick={() => onClickDel?.(role)}
                      >
                        Delete
                      </div>
                    ) : null}
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

export default ApiAppRoles;
