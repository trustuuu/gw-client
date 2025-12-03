import { useState } from "react";
import { tokenExchangePolicyFields } from "../../constants/tokenExchangePolicyFields";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";
import applicationApi from "../../api/application-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";
import ItemField from "../../component/ItemField";

const fields = tokenExchangePolicyFields;
let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type == "checkbox" ? false : "")
);

export default function ApplicationTokenExchangePost({ props }) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    company: companyState,
    domain: domainState,
    application: applicationState,
    policy,
  } = location.state
    ? location.state
    : { company: null, domain: null, application: null, policy: null };
  const {
    company: companyAuth,
    domain: domainAuth,
    application: applicationAuth,
    setIsLoading,
  } = useAuth();
  const application = applicationState ? applicationState : applicationAuth;
  const company = companyState ? companyState : companyAuth;
  const domain = domainState ? domainState : domainAuth;

  const [errorText, setError] = useState();
  const [mode, setMode] = useState(
    location.state ? location.state.mode : props.mode
  );
  const [itemState, setItemState] = useState(
    mode == "new" ? { ...fieldsState } : { ...policy }
  );

  if (!mode) navigate("/applications-view-token-exchange");
  // const handleChange = (e) => {
  //   setItemState({
  //     ...itemState,
  //     [e.target.id]:
  //       e.target.value == "true" || e.target.value == "false"
  //         ? e.target.checked
  //         : e.target.value,
  //   });
  // };

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
        if (Array.isArray(itemState[targetId])) {
          if (!itemState[targetId].find((i) => i === childValue)) {
            setItemState({
              ...itemState,
              [targetId]: [...(itemState[targetId] || []), childValue],
            });
          }
        } else {
          setItemState({
            ...itemState,
            [targetId]: [childValue],
          });
        }
      } else {
        setItemState({ ...itemState, [targetId]: childValue });
      }
      return;
    }
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    createTokenExchange();
    setIsLoading(false);
    event.preventDefault();
  };

  const createTokenExchange = async () => {
    try {
      const data = {
        ...itemState,
        //id: itemState.name,
      };
      await applicationApi.createTokenExchange(application.id, data);
      navigate(-1);
    } catch (err) {
      if (err.response.status == 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    if (window.history.length) {
      navigate("/applications-view-token-exchange");
    } else navigate(-1);
  };

  const handleEdit = (event) => {
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
      await applicationApi.updateTokenExchange(application.id, itemState);
      navigate(-1);
    } catch (err) {
      if (err.response.status == 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const customClassEdit =
    "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-80 dark:bg-gray-800 bg-gray-400 text-gray-800";
  const customClass =
    "ms-2 text-sm font-medium text-gray-900 dark:text-gray-800 min-w-80 dark:bg-gray-300";

  if (mode == "new" || mode == "edit") {
    return (
      <div className="flex justify-center">
        <form className="mt-8 space-y-6">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) => (
              <Input
                key={field.id}
                handleChange={handleChange}
                value={
                  field.valueType === "array" &&
                  itemState[field.id] &&
                  Array.isArray(itemState[field.id])
                    ? itemState[field.id].join("\r\n")
                    : itemState[field.id]
                }
                field={field}
                customClass={
                  field.customClass ? field.customClass : customClass
                }
              />
            ))}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction
                handleSubmit={mode == "new" ? handleSubmit : handleSave}
                text={mode == "new" ? "Create" : "Save"}
              />
            </div>
            <div>
              <FormAction handleSubmit={handleCancel} text="Cancel" />
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <form className="mt-8 space-y-6">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) => (
              <ItemView
                Item={policy}
                key={field.id}
                handleChange={handleChange}
                value={
                  field.valueType === "array" &&
                  itemState[field.id] &&
                  Array.isArray(itemState[field.id])
                    ? itemState[field.id].join("\r\n")
                    : itemState[field.id]
                }
                field={field}
                customClass={
                  field.customClass ? field.customClass : customClassEdit
                }
              />
            ))}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction handleSubmit={handleEdit} text="Edit" />
            </div>
            <div>
              <FormAction handleSubmit={handleCancel} text="Close" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
