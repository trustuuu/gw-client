import { useState } from "react";
import { applicationFields } from "../../constants/applicationFields";
import { useNavigate, useLocation } from "react-router-dom";
import applicationApi from "../../api/application-api";
import ItemField from "../../component/ItemField";
import FormAction from "../../component/FormAction";
import PanelExpandable from "../../component/PanelExpandable";
import Stepper from "../../component/Stepper";
import { generateString } from "../../utils/Utils";
import { useAuth } from "../../component/AuthContext";

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

export default function ApplicationPost(props) {
  const { setIsLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState();
  //const { company, domain, application } = location.state;

  const {
    company: companyState,
    domain: domainState,
    application: applicationState,
  } = location.state
    ? location.state
    : { company: null, domain: null, application: null };
  const {
    company: companyAuth,
    domain: domainAuth,
    application: applicationAuth,
  } = useAuth();
  const application = applicationState ? applicationState : applicationAuth;
  const company = companyState ? companyState : companyAuth;
  const domain = domainState ? domainState : domainAuth;

  const [mode, setMode] = useState(
    location.state ? location.state.mode : props.mode
  );

  if (!mode) navigate("/applications");

  const [itemState, setItemState] = useState(
    mode === "new"
      ? {
          ...fieldsState,
          client_id: generateString(32),
          client_secret: generateString(32),
          app_type: "SPA",
          permissions_consent_screen: true,
        }
      : application
  );

  const handleChange = (e, childValue) => {
    const targetId = e.target.getAttribute("parentid")
      ? e.target.getAttribute("parentid")
      : e.target.id;
    const currentItem = fields.filter((f) => f.id === targetId)[0];

    if (!childValue) {
      const itemValue =
        e.target.type === "checkbox"
          ? e.target.checked
          : currentItem.valueType !== undefined &&
            currentItem.valueType === "array"
          ? e.target.value.split(/\r\n|\n|\r/)
          : e.target.value;
      setItemState({ ...itemState, [targetId]: itemValue });
    } else {
      if (currentItem.valueType === "array") {
        if (!itemState[targetId].find((i) => i === childValue)) {
          setItemState({
            ...itemState,
            [targetId]: [...(itemState[targetId] || []), childValue],
          });
        }
      } else {
        setItemState({ ...itemState, [targetId]: childValue });
      }
      return;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    createItem();
    setIsLoading(false);
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
      navigate("/applications");
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
    if (event.target.innerText === "Close") navigate("/applications");
    if (mode === "new" && event.target.innerText === "Cancel")
      navigate("/applications");
    event.preventDefault();
  };

  const handleEdit = async (event) => {
    setMode("edit");
    event.preventDefault();
  };

  const handleSave = async (event) => {
    setIsLoading(true);
    saveItem();
    setIsLoading(false);
    event.preventDefault();
  };

  const saveItem = async () => {
    try {
      const app = await applicationApi.update({
        ...itemState,
        companyId: company.id,
        domain: domain.id,
      });

      await applicationApi.purgeCors(company.id, domain.id, application.id);
      setItemState(app.data);
      setMode("view");
      //navigate("/applications");
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.client_name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

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
              itemState,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Application Properties",
              fields_settings_properties,
              itemState,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Application URIs",
              fields_settings_uris,
              itemState,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "ID Tokken",
              fields_settings_idToken,
              itemState,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "Refresh Tokken Rotation",
              fields_settings_refreshTokenRotation,
              itemState,
              itemState,
              handleChange,
              mode
            )}
            {displayPanel(
              "efresh Tokken Expiration",
              fields_settings_refreshTokenExpiration,
              itemState,
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
              {mode !== "overview" ? (
                <FormAction handleSubmit={handleEdit} text="Edit" />
              ) : null}
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
