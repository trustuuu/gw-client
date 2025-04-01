const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"

export default function Input({
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


    const showItem = 'my-5 flex items-center';
    const hiddenItem = 'my-5 flex items-center invisible';

    let inputContext = null;
    switch(type){
      case 'textarea':
        inputContext = <textarea
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
                  {list.map( l => {return <option value={l.key}>{l.value}</option>})}
                </select>
                :<></>
        break;
        
      default:
        inputContext = <input
                // ref={inputRef}
                onChange={handleChange}
                value={value}
                id={id}
                name={name}
                type={type}
                required={isRequired}
                className={customClass ? customClass : fixedInputClass+customClass}
                placeholder={placeholder}
                checked={value}
              />
    }
    
    return(
        <div className={reseller ? (company.type == 'reseller') ? showItem : hiddenItem : showItem}>
            <label for={labelFor} className="text-pretty ms-2 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-48 max-w-48 ">
              {labelText}
            </label>
            {
              inputContext
            }
            
          </div>
    )
}