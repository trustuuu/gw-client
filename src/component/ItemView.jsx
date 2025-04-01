//import {useEffect, useRef} from 'react';

const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  dark:accent-pink-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"

export default function ItemView({
    Item,
    handleChange,
    value,
    labelText,
    labelFor,
    id,
    name,
    type,
    isRequired=false,
    placeholder,
    customClass,
    list,
    company,
    reseller
}){
 
    const showItem = 'my-5 flex items-center text-pretty';
    const hiddenTiem = 'my-5 flex items-center invisible ';
    let inputContext = null;

    switch(type){
      case 'textarea':
        inputContext = <textarea
                disabled
                rows={5}
                id={id}
                name={name}
                value={value}
                onChange={handleChange}
                required={isRequired}
                placeholder={placeholder}
                className={customClass ? customClass : fixedInputClass+customClass}>
                </textarea>
        break;

      case 'select':
        inputContext = list ?
                <select
                id={id}
                name={name}
                onChange={handleChange}
                required={isRequired}
                placeholder={placeholder}
                className={customClass ? customClass : fixedInputClass+customClass}>
                  <option value={Item[id]}>{Item[id]}</option>
                </select>
              :
                <></>
        break;

        case 'checkbox':
          inputContext = <input
                onChange={handleChange}
                value={value}
                id={id}
                name={name}
                type={type}
                required={isRequired}
                className={customClass ? customClass : fixedInputClass+customClass}
                placeholder={placeholder}
                checked={value}
                disabled 
              />
          break;

      default:
        inputContext = <div 
                onChange={handleChange}
                value={value}
                id={id}
                name={name}
                type={type}
                required={isRequired}
                className={customClass ? customClass : fixedInputClass+customClass}
                placeholder={placeholder}
                
              >
                {Item[id]}
              </div>
    }
    
    return(
        <div className={reseller ? (company.type == 'reseller') ? showItem : hiddenTiem : showItem}>
            <label for={labelFor} className="text-wrap ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-48 max-w-48 ">
              {labelText}
            </label>
            { inputContext }
            
          </div>
    )
}