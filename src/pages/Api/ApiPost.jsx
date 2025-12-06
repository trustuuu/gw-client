import { useState, useEffect } from "react";
import { apiFields } from "../../constants/apiFields";
import { useNavigate, useLocation } from "react-router-dom";
import apiApi from "../../api/api-api";
import FormAction from "../../component/FormAction";
import Stepper from "../../component/Stepper";
import { generateString } from "../../utils/Utils";
import { useAuth } from "../../component/AuthContext";
import DisplayPanel from "../../component/DisplayPanel";
import { validateFields } from "../../constants/validateFields";

const fields = apiFields;
const fields_general = fields.filter(
  (a) => a.category === "settings.general" && a.id !== "domain"
);
const fields_token_setting = fields.filter(
  (a) => a.category === "settings.tokenSetting"
);
const fields_rbac = fields.filter((a) => a.category === "settings.rbac");
const fields_access = fields.filter((a) => a.category === "settings.access");

let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type === "checkbox" ? false : "")
);

export default function ApiPost(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState();
  const [mode, setMode] = useState(
    location.state ? location.state.mode : props.mode
  );

  const {
    company: companyState,
    domain: domainState,
    api: apiState,
  } = location.state
    ? location.state
    : { company: null, domain: null, api: null };
  const { company: companyAuth, domain: domainAuth, api: apiAuth } = useAuth();
  const api = apiState ? apiState : apiAuth;

  useEffect(() => {
    if (!api) {
      navigate("/apis");
    }
  }, []);

  const company = companyState ? companyState : companyAuth;
  const domain = domainState ? domainState : domainAuth;
  const [itemState, setItemState] = useState(
    mode === "new"
      ? { ...fieldsState, id: generateString(32), signingAlgorithm: "RS256" }
      : api
  );

  const handleChange = (e) => {
    const currentItem = fields.filter((f) => f.id === e.target.id)[0];
    const itemValue =
      e.target.type === "checkbox"
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
      navigate("/apis");
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
    navigate(-1);
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
      navigate(-1);
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
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
      title: "General Settings",
      page: DisplayPanel(
        "General Settings",
        fields_general,
        api,
        itemState,
        handleChange,
        mode
      ),
      verify: () => validateFields(itemState, fields_general),
    },
    {
      title: "Token Setting",
      page: DisplayPanel(
        "Token Setting",
        fields_token_setting,
        api,
        itemState,
        handleChange,
        mode
      ),
      verify: () => validateFields(itemState, fields_token_setting),
    },
    {
      title: "RBAC Settings",
      page: DisplayPanel(
        "RBAC Settings",
        fields_rbac,
        api,
        itemState,
        handleChange,
        mode
      ),
      verify: () => validateFields(itemState, fields_rbac),
    },
    {
      title: "Access Settings",
      page: DisplayPanel(
        "Access Settings",
        fields_access,
        api,
        itemState,
        handleChange,
        mode
      ),
      verify: () => validateFields(itemState, fields_access),
    },
  ];

  return (
    <div className="flex justify-center">
      <form className="mt-8 space-y-6">
        <h4 className="text-red-400">{errorText}</h4>
        {mode === "new" ? (
          <div>
            {/* {DisplayPanel('Basic Information', fields_basic, api, itemState, handleChange, mode)} */}
            <Stepper steps={steps} handleSubmit={handleSubmit} />
          </div>
        ) : (
          <div>
            {DisplayPanel(
              "General Settings",
              fields_general.filter((f) => f.id !== "domain"),
              api,
              itemState,
              handleChange,
              mode
            )}
            {DisplayPanel(
              "Token Setting",
              fields_token_setting,
              api,
              itemState,
              handleChange,
              mode
            )}
            {DisplayPanel(
              "RBAC Settings",
              fields_rbac,
              api,
              itemState,
              handleChange,
              mode
            )}
            {DisplayPanel(
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
              {mode !== "overview" ? (
                <FormAction handleSubmit={handleEdit} text="Edit" />
              ) : null}
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
