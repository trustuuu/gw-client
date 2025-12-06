import ItemField from "./ItemField";
import PanelExpandable from "./PanelExpandable";

const DisplayPanel = (title, fields, item, itemState, handleChange, mode) => {
  return (
    <PanelExpandable title={title} initExpand={true}>
      <div className="space-y-4 w-full">
        {fields.map((field) =>
          (field.hiddenUpdate || field.hiddenUpdate !== undefined) &&
          mode === "edit" ? (
            <></>
          ) : (
            <ItemField
              key={field.name}
              item={item}
              handleChange={handleChange}
              value={
                field.valueType === "array" &&
                itemState[field.id] &&
                Array.isArray(itemState[field.id])
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
  );
};

export default DisplayPanel;
