import Input from "./Input";
import ItemView from "./ItemView";

const customClassEdit = "ms-2 text-sm font-medium placeholder-gray-300";
const customClass = "ms-2 text-sm font-medium ";

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
      field={field}
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
      field={field}
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
