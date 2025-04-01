import React from 'react';
import {useState} from 'react';
import Checkbox from '../../component/Checkbox';

function ApiPermissions({scopes, onClickDel}) {


  return (

      <div className="p-3">
        {/* Apis */}
        <div>
          <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
            Apis
          </header>
          <ul className="my-1">
            {/* Item */}
            <li className="flex px-2">
              <div className="self-center mr-7">
                
              </div>
              <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
              <div className="grow flex">
                <div className="self-center uppercase w-1/6 min-w-48">
                  Permission
                </div>
                <div className="text-left uppercase justify-self-start w-4/6">
                  Description
                </div>
                <div className="shrink-0 self-end ml-2 w-1/6">
                  <a className="font-medium uppercase text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" href="#0">
                    Action
                  </a>
                </div>
              </div>
              </div>
            </li>
            {
              scopes ?
              scopes.map(scope => {
                    return (
              <li className="flex px-2" key={scope.id}>
                <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
                <div className="grow flex">
                  <div className="self-center  w-1/6 min-w-48">
                  {scope ? scope.permission : ""}
                  </div>
                  <div className="text-left justify-self-start w-4/6">
                    {scope ? scope.description : ""}
                  </div>
                </div>
                <div className="shrink-0 self-end ml-2 w-1/6  hover:cursor-pointer" onClick={onClickDel.bind(this, scope)}>
                    <a className="font-medium text-indigo-500 hover:text-yellow-600 dark:hover:text-yellow-400">
                      Delete
                    </a>
                  </div>
                </div>
              </li>
                    )
              })
              : <div></div>
            }
            
          </ul>
        </div>
      </div>

  );
}

export default ApiPermissions;
