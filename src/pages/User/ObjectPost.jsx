import { useEffect, useState } from "react";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";
import { useAuth } from "../../component/AuthContext";

export default function ObjectPost({
  propName,
  modeObject,
  Item,
  fields,
  handleCancel,
  handleCreate,
  handleSave,
  handleParent,
}) {
  //const fields = addressFields;
  let fieldsState = {};
  fields.forEach(
    (field) => (fieldsState[field.id] = field.type === "checkbox" ? false : "")
  );
  const { setIsLoading } = useAuth();

  const [errorText, setError] = useState();
  //const { addresses } = location.state;
  const [mode, setMode] = useState(modeObject);
  const [itemState, setItemState] = useState(
    mode == "new" ? { ...fieldsState, type: "work" } : Item
  );

  useEffect(() => setMode(modeObject), [modeObject]);

  const handleChange = (e) => {
    const newItemState = {
      ...itemState,
      [e.target.id]:
        e.target.value === "true" || e.target.value === "false"
          ? e.target.checked
          : e.target.value,
    };
    setItemState(newItemState);

    if (handleParent) handleParent(propName, newItemState);
  };

  const populateItem = async (data) => {
    fields.forEach((field) => {
      if (!field.database && field.database !== undefined) {
        delete data[field.id];
      }
    });
    return data;
  };

  const buttonSubmit = async (event) => {
    let data = await populateItem(itemState);
    handleCreate(data);
    handleCancel();
    event.preventDefault();
  };

  const buttonSave = async (event) => {
    setIsLoading(true);
    handleSave(itemState);
    handleCancel();
    setIsLoading(false);
    event.preventDefault();
  };

  const customClassEdit = "ms-2 text-sm font-medium min-w-80 ";
  const customClass = "ms-2 text-sm font-medium min-w-80 ";
  if (itemState === undefined) return <></>;
  if (mode === "new" || mode === "edit") {
    return (
      <div className="flex justify-center">
        <form className="mt-1 space-y-1">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) =>
              (field.hiddenUpdate || field.hiddenUpdate !== undefined) &&
              mode === "edit" ? (
                <></>
              ) : (
                <Input
                  //company={company}
                  key={field.id}
                  handleChange={handleChange}
                  value={itemState[field.id]}
                  field={field}
                  customClass={
                    field.customClass ? field.customClass : customClass
                  }
                  reseller={field.reseller}
                />
              )
            )}
          </div>
          <div className="flex justify-center">
            {(mode === "new") | (mode === "edit") ? (
              <>
                <div className="mr-3">
                  {handleCreate || handleSave ? (
                    <FormAction
                      handleSubmit={mode === "new" ? buttonSubmit : buttonSave}
                      text={mode === "new" ? "Create" : "Save"}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {handleCancel ? (
                    <FormAction handleSubmit={handleCancel} text="Close" />
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <div>
                {handleCancel ? (
                  <FormAction handleSubmit={handleCancel} text="Close" />
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <form className="mt-1 space-y-1">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-1">
            {fields.map((field) =>
              field.hiddenDisplay ||
              field.hiddenDisplay !== undefined ? null : (
                <ItemView
                  Item={Item}
                  //company={company}
                  key={field.id}
                  handleChange={handleChange}
                  value={itemState[field.id]}
                  field={field}
                  customClass={
                    field.customClass ? field.customClass : customClassEdit
                  }
                />
              )
            )}
          </div>
          <div className="flex justify-center">
            <div>
              {handleCancel ? (
                <FormAction handleSubmit={handleCancel} text="Close" />
              ) : (
                <></>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
}
