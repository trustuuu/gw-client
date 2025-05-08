import Input from "./Input";
import ItemView from "./ItemView";

const customClassEdit =
  "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 dark:bg-gray-800 bg-gray-400 text-gray-800 placeholder-gray-300";
const customClass =
  "ms-2 text-sm font-medium text-gray-900 dark:text-gray-800 dark:bg-gray-300 ";

export default function ItemField({
  item,
  field,
  value,
  handleChange,
  company,
  mode,
}) {
  return mode == "view" ? (
    <ItemView
      Item={item}
      company={company}
      key={field.id}
      handleChange={handleChange}
      value={value}
      labelText={field.labelText}
      labelFor={field.labelFor}
      id={field.id}
      name={field.name}
      type={field.type}
      isRequired={field.isRequired}
      placeholder={field.placeholder}
      list={field.list}
      customClass={
        field.customClass
          ? field.customClass
          : customClassEdit +
            +`${field.type == "checkbox" ? " max-w-4 " : " min-w-80 "}`
      }
    />
  ) : (
    <Input
      company={company}
      key={field.id}
      handleChange={handleChange}
      value={value}
      labelText={field.labelText}
      labelFor={field.labelFor}
      id={field.id}
      name={field.name}
      type={field.type}
      isRequired={field.isRequired}
      placeholder={field.placeholder}
      list={field.list}
      customClass={
        field.customClass
          ? field.customClass
          : customClass +
            `${field.type == "checkbox" ? " max-w-4 " : " min-w-80 "}`
      }
      reseller={field.reseller}
    />
  );
}
