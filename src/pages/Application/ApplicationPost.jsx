import { useState } from "react";
import { applicationFields } from "../../constants/applicationFields";
import { useNavigate, useLocation } from "react-router-dom";
import applicationApi from "../../api/application-api";
import ItemField from "../../component/ItemField";
import FormAction from "../../component/FormAction";
import PanelExpandable from "../../component/PanelExpandable";
import Stepper from "../../component/Stepper";
import { generateString } from "../../utils/Utils";

const fields = applicationFields;
const fields_basic = fields.filter((a) => a.category === "settings.basic");
const fields_settings_properties = fields.filter(
  (a) =>
    a.category === "settings.properties" || a.category === "settings.advanced"
);
const fields_settings_uris = fields.filter(
  (a) => a.category === "settings.uris"
);
const fields_settings_idToken = fields.filter(
  (a) => a.category === "settings.idToken"
);
const fields_settings_refreshTokenRotation = fields.filter(
  (a) => a.category === "settings.refreshTokenRotation"
);
const fields_settings_refreshTokenExpiration = fields.filter(
  (a) => a.category === "settings.refreshTokenExpiration"
);
let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type === "checkbox" ? false : "")
);

export default function ApplicationPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState();
  const { company, domain, application } = location.state;
  const [mode, setMode] = useState(location.state.mode);
  const [itemState, setItemState] = useState(
    mode === "new"
      ? {
          ...fieldsState,
          client_id: String(32),
          client_secret: generateString(32),
          app_type: "SPA",
          permissions_consent_screen: true,
        }
      : application
  );

  const handleChange = (e) => {
    const currentItem = fields.filter((f) => f.id === e.target.id)[0];
    const itemValue =
      e.target.type === "checkbox" //e.target.value === "true" || e.target.value === "false"
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
        id: itemState.client_id,
        companyId: company.id,
        domain: domain.id,
      });

      await applicationApi.create(data);
      navigate(-1);
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.client_name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const handleCancel = (event) => {
    setMode("view");
    //navigate(-1);
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

  // const handlePurchCors = async (event) => {
  //   console.log(
  //     "company.id, domain.id, application.id",
  //     company.id,
  //     domain.id,
  //     application.id
  //   );
  //   await applicationApi.purgeCors(company.id, domain.id, application.id);
  //   event.preventDefault();
  // };

  const saveItem = async () => {
    try {
      await applicationApi.update({
        ...itemState,
        companyId: company.id,
        domain: domain.id,
      });

      await applicationApi.purgeCors(company.id, domain.id, application.id);

      navigate(-1);
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.client_name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  // const customClassEdit =
  //   "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-80 dark:bg-gray-800 bg-gray-400 text-gray-800";
  // const customClass =
  //   "ms-2 text-sm font-medium text-gray-900 dark:text-gray-800 min-w-80 dark:bg-gray-300 ";

  const steps = [
    {
      title: "Basic Information",
      page: displayPanel(
        "Basic Information",
        fields_basic.filter((f) => f.id !== "domain"),
        application,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "Application Properties",
      page: displayPanel(
        "Application Properties",
        fields_settings_properties,
        application,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "Application URIs",
      page: displayPanel(
        "Application URIs",
        fields_settings_uris,
        application,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "ID Token",
      page: displayPanel(
        "ID Token",
        fields_settings_idToken,
        application,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "Refresh Tokken Rotation",
      page: displayPanel(
        "Refresh Tokken Rotation",
        fields_settings_refreshTokenRotation,
        application,
        itemState,
        handleChange,
        mode
      ),
    },
    {
      title: "Refresh Tokken Expiration",
      page: displayPanel(
        "Refresh Tokken Expiration",
        fields_settings_refreshTokenExpiration,
        application,
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
            {/* {displayPanel('Basic Information', fields_basic, application, itemState, handleChange, mode)} */}
            <Stepper steps={steps} handleSubmit={handleSubmit} />
          </div>
        ) : (
          <div>
            {displayPanel(
              "Basic Information",
              fields_basic.filter((f) => f.id !== "domain"),
              application,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Application Properties",
              fields_settings_properties,
              application,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Application URIs",
              fields_settings_uris,
              application,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "ID Tokken",
              fields_settings_idToken,
              application,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Refresh Tokken Rotation",
              fields_settings_refreshTokenRotation,
              application,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "efresh Tokken Expiration",
              fields_settings_refreshTokenExpiration,
              application,
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
            {/* <div>
              <FormAction handleSubmit={handlePurchCors} text="Push Origins" />
            </div> */}
          </div>
        )}
      </form>
    </div>
  );
}

const displayPanel = (title, fields, item, itemState, handleChange, mode) => {
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
  );
};
