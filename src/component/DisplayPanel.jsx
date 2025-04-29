import ItemField from "./ItemField";
import PanelExpandable from "./PanelExpandable";

export default function DisplayPanel(
  title,
  fields,
  item,
  itemState,
  handleChange,
  mode
) {
  return (
    <div className="py-6">
      <PanelExpandable title={title} initExpand={true}>
        <div className="space-y-4">
          {fields.map((field) =>
            (field.hiddenUpdate || field.hiddenUpdate !== undefined) &&
            mode === "edit" ? (
              <></>
            ) : (
              <ItemField
                key={field.id}
                item={item}
                handleChange={handleChange}
                value={
                  field.valueType === "array" && itemState[field.id]
                    ? itemState[field.id].join("\r\n")
                    : itemState[field.id]
                }
                field={field}
                mode={mode}
              />
            )
          )}
        </div>
      </PanelExpandable>
    </div>
  );
}
