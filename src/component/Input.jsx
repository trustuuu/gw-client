const fixedInputClass =
  " flex-grow min-w-0 rounded-md relative block px-3 py-2 border border-gray-300 placeholder-gray-200 dark:placeholder-gray-500 dark:accent-pink-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm ";

export default function Input({
  handleChange,
  value,
  field,
  customClass,
  company,
  reseller,
}) {
  const showItem = "flex flex-row w-full items-center p-2 text-pretty";
  const hiddenItem = "flex flex-row w-full items-center p-2 invisible ";

  const {
    labelText,
    labelFor,
    id,
    parentId,
    name,
    type,
    isRequired = false,
    placeholder,
    list,
    source,
    readOnly,
  } = field;
  let inputContext = null;
  switch (type) {
    case "textarea":
      inputContext = (
        <>
          {source ? (
            <Input
              company={company}
              key={source.id}
              handleChange={source.handleChange(handleChange)}
              //listener={}
              value={value}
              field={source}
              parentField={field}
              customClass={
                source.customClass
                  ? source.customClass
                  : customClass +
                    `${source.type == "checkbox" ? " max-w-4 " : " min-w-80 "}`
              }
              reseller={source.reseller}
            />
          ) : null}
          <textarea
            //disabled={source ? true : false}
            rows={5}
            id={id}
            name={name}
            value={Array.isArray(value) ? value.join("\n") : value}
            onChange={handleChange}
            required={isRequired}
            placeholder={placeholder}
            className={
              customClass ? fixedInputClass + customClass : fixedInputClass
            }
          ></textarea>
        </>
      );
      break;

    case "select":
      inputContext = list ? (
        <div className="flex flex-col">
          {source ? (
            <Input
              company={company}
              key={source.id}
              handleChange={source.handleChange(handleChange)}
              //listener={}
              value={source.value}
              field={source}
              parentField={field}
              customClass={
                source.customClass
                  ? source.customClass
                  : customClass +
                    `${source.type == "checkbox" ? " max-w-4 " : " min-w-80 "}`
              }
              reseller={source.reseller}
            />
          ) : null}
          <select
            id={id}
            parentid={parentId}
            name={name}
            onChange={handleChange}
            required={isRequired}
            placeholder={placeholder}
            className={
              customClass ? fixedInputClass + customClass : fixedInputClass
            }
          >
            {list.map((l) => {
              return (
                <option
                  value={l.key}
                  selected={l.key === value ? "selected" : ""}
                >
                  {l.value}
                </option>
              );
            })}
          </select>
        </div>
      ) : (
        <></>
      );
      break;

    default:
      inputContext = (
        <>
          {source ? (
            <Input
              company={company}
              key={source.id}
              handleChange={source.handleChange(handleChange)}
              //listener={}
              value={value}
              field={source}
              parentField={field}
              customClass={
                source.customClass
                  ? source.customClass
                  : customClass +
                    `${source.type == "checkbox" ? " max-w-4 " : " min-w-80 "}`
              }
              reseller={source.reseller}
            />
          ) : null}
          <input
            // ref={inputRef}
            onChange={handleChange}
            value={value}
            id={id}
            name={name}
            type={type}
            required={isRequired}
            className={
              customClass ? fixedInputClass + customClass : fixedInputClass
            }
            placeholder={placeholder}
            checked={value}
            readOnly={readOnly ? true : ""}
          />
        </>
      );
  }

  return (
    <div
      className={
        reseller
          ? company && company.type == "reseller"
            ? showItem
            : hiddenItem
          : showItem
      }
    >
      <label
        htmlFor={labelFor}
        className="text-wrap ms-2 text-sm font-medium min-w-48 max-w-48 "
      >
        {labelText}
      </label>
      {inputContext}
    </div>
  );
}
