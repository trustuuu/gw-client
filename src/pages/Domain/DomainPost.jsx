import { useState } from "react";
import { domainFields } from "../../constants/formFields";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";
import domainApi from "../../api/domain-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";

const fields = domainFields;
let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type == "checkbox" ? false : "")
);

export default function Domain() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState();
  const { domain, company, domainCount } = location.state;
  const [mode, setMode] = useState(location.state.mode);
  const [itemState, setItemState] = useState(
    mode == "new" ? { ...fieldsState } : { ...domain }
  );
  const { saveDomain } = useAuth();

  const handleChange = (e) => {
    setItemState({
      ...itemState,
      [e.target.id]:
        e.target.value == "true" || e.target.value == "false"
          ? e.target.checked
          : e.target.value,
    });
  };

  const handleSubmit = (event) => {
    createDomain();
    event.preventDefault();
  };

  const createDomain = async () => {
    try {
      const data = {
        ...itemState,
        id: itemState.name,
        primary: domainCount == 0 ? true : false,
      };
      await domainApi.create(company.id, data);
      const domainSession = {
        id: data.id,
        name: data.name,
        description: data.description,
      };
      if (data.primary) saveDomain(domainSession);
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
    navigate(-1);
    event.preventDefault();
  };

  const handleEdit = (event) => {
    setMode("edit");
    event.preventDefault();
  };

  const handleSave = async (event) => {
    saveItem();
    event.preventDefault();
  };

  const saveItem = async () => {
    try {
      await domainApi.update(company.id, itemState);
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
                value={itemState[field.id]}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
                list={field.list}
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
                Item={domain}
                key={field.id}
                handleChange={handleChange}
                value={itemState[field.id]}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
                list={field.list}
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
