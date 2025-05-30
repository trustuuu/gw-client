import React from "react";
import { useState } from "react";
import Checkbox from "../../component/Checkbox";

function GroupMember({ members, parentCallback }) {
  const [checkedItems, setCheckedItems] = useState([]);

  const handleChangeCheck = function (e) {
    const item = e.target.name;
    const isChecked = e.target.checked;

    if (!item) return;

    if (isChecked) {
      parentCallback([
        ...checkedItems,
        ...members.filter((i) => i.id === item),
      ]);
      setCheckedItems([
        ...checkedItems,
        ...members.filter((i) => i.id === item),
      ]);
    } else {
      parentCallback(checkedItems.filter((i) => i.id !== item));
      setCheckedItems(checkedItems.filter((i) => i.id !== item));
    }
  };

  return (
    <div className="p-3">
      {/* Groups */}
      <div>
        <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
          Members
        </header>
        <ul className="my-1">
          {/* Item */}
          <li className="flex px-2">
            <div className="self-center mr-7"></div>
            <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
              <div className="grow flex">
                <div className="self-center uppercase w-1/6 min-w-48">
                  displayName
                </div>
                <div className="text-left uppercase justify-self-start w-4/6">
                  Type
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
          {members ? (
            members.map((member) => {
              return (
                <li
                  className="flex px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer"
                  key={member.id}
                >
                  <div className="self-center mr-3">
                    <Checkbox
                      name={member.id}
                      id={member.id}
                      checked={
                        checkedItems.filter((i) => i.id === member.id).length >
                        0
                      }
                      onChange={handleChangeCheck}
                    />
                    {/* <svg className="w-9 h-9 fill-current text-sky-50" viewBox="0 0 36 36">
                    <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
                  </svg> */}
                  </div>
                  <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
                    <div className="grow flex">
                      <div className="self-center  w-1/6 min-w-48">
                        {member ? member.displayName : ""}
                      </div>
                      <div className="text-left justify-self-start w-4/6">
                        {member ? member.type : ""}
                      </div>
                    </div>
                    <div className="shrink-0 self-end ml-2 w-1/6">
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

export default GroupMember;
