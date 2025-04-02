import { useState } from "react";
import { apiFields } from "../../constants/apiFields";
import { useHistory, useLocation } from "react-router-dom";
import apiApi from "../../api/api-api";
import ItemField from "../../component/ItemField";
import FormAction from "../../component/FormAction";
import PanelExpandable from "../../component/PanelExpandable";
import Stepper from "../../component/Stepper";

const fields = apiFields;
const fields_general = fields.filter((a) => a.category === "settings.general");
const fields_token_setting = fields.filter(
  (a) => a.category === "settings.tokenSetting"
);
const fields_rbac = fields.filter((a) => a.category === "settings.rbac");
const fields_access = fields.filter((a) => a.category === "settings.access");

let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type === "checkbox" ? false : "")
);

const generateString = (
  len,
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) =>
  [...Array(len)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");

export default function ApiPost() {
  const location = useLocation();
  const history = useHistory();
  const [errorText, setError] = useState();

  const { company, domain, api } = location.state;
  const [mode, setMode] = useState(location.state.mode);
  const [itemState, setItemState] = useState(
    mode === "new"
      ? { ...fieldsState, id: generateString(32), signingAlgorithm: "RS256" }
      : api
  );

  const handleChange = (e) => {
    const currentItem = fields.filter((f) => f.id === e.target.id)[0];
    const itemValue =
      e.target.value === "true" || e.target.value === "false"
        ? e.target.checked
        : currentItem.valueType !== undefined &&
          currentItem.valueType === "array"
        ? e.target.value.split(/\r\n|\n|\r/)
        : e.target.value;

    setItemState({ ...itemState, [e.target.id]: itemValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createItem();
  };

  const populateItem = async (data) => {
    fields.forEach((field) => {
      if (!field.database && field.database !== undefined) {
        delete data[field.id];
      }
    });
    return data;
  };

  const createItem = async () => {
    try {
      let data = await populateItem({
        ...itemState,
        id: itemState.id,
        companyId: company.id,
        domain: domain.id,
      });
      await apiApi.create(data);
      history.goBack();
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const handleCancel = (event) => {
    history.goBack();
    event.preventDefault();
  };

  const handleEdit = async (event) => {
    setMode("edit");
    event.preventDefault();
  };

  const handleSave = async (event) => {
    saveItem();
    event.preventDefault();
  };

  const saveItem = async () => {
    try {
      await apiApi.update({
        ...itemState,
        companyId: company.id,
        domain: domain.id,
      });
      history.goBack();
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  //   const customClassEdit =
  //     "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-80 dark:bg-gray-800 bg-gray-400 text-gray-800";
  //   const customClass =
  //     "ms-2 text-sm font-medium text-gray-900 dark:text-gray-800 min-w-80 dark:bg-gray-300 ";

  const steps = [
    {
      title: "General Settings",
      page: displayPanel(
        "General Settings",
        fields_general.filter((f) => f.id !== "domain"),
        api,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "Token Setting",
      page: displayPanel(
        "Token Setting",
        fields_token_setting,
        api,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "RBAC Settings",
      page: displayPanel(
        "RBAC Settings",
        fields_rbac,
        api,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "Access Settings",
      page: displayPanel(
        "Access Settings",
        fields_access,
        api,
        itemState,
        handleChange,
        mode
      ),
    },
  ];

  return (
    <div className="flex justify-center">
      <form className="mt-8 space-y-6">
        <h4 className="text-red-400">{errorText}</h4>
        {mode === "new" ? (
          <div>
            {/* {displayPanel('Basic Information', fields_basic, api, itemState, handleChange, mode)} */}
            <Stepper steps={steps} handleSubmit={handleSubmit} />
          </div>
        ) : (
          <div>
            {displayPanel(
              "General Settings",
              fields_general.filter((f) => f.id !== "domain"),
              api,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Token Setting",
              fields_token_setting,
              api,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "RBAC Settings",
              fields_rbac,
              api,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Access Settings",
              fields_access,
              api,
              itemState,
              handleChange,
              mode
            )}
          </div>
        )}
        {mode === "new" || mode === "edit" ? (
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction
                handleSubmit={mode === "new" ? handleSubmit : handleSave}
                text={mode === "new" ? "Create" : "Save"}
              />
            </div>
            <div>
              <FormAction handleSubmit={handleCancel} text="Cancel" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction handleSubmit={handleEdit} text="Edit" />
            </div>
            <div>
              <FormAction handleSubmit={handleCancel} text="Close" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

const displayPanel = (title, fields, item, itemState, handleChange, mode) => {
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
};
