import { useState } from "react";
import { connectionFields } from "../../constants/formFields";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";
import domainApi from "../../api/domain-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";

const fields = connectionFields;
let fieldsState = {};
fields.forEach(
  (field) =>
    (fieldsState[field.id] =
      field.type == "checkbox" ? false : field.default ?? "")
  // : field.type == "select"
  // ? field.default ?? ""
  // : "")
);

export default function ConnectionPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState();
  const {
    domain: domainState,
    company: companyState,
    connection,
  } = location.state;
  const [mode, setMode] = useState(location.state.mode);
  const { company: companyAuth, domain: domainAuth, setIsLoading } = useAuth();
  const company = companyState ? companyState : companyAuth;
  const domain = domainState ? domainState : domainAuth;

  const [itemState, setItemState] = useState(
    mode == "new" ? { ...fieldsState } : { ...connection }
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
    // setItemState({
    //   ...itemState,
    //   [e.target.id]:
    //     e.target.value == "true" || e.target.value == "false"
    //       ? e.target.checked
    //       : e.target.value,
    // });
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    createConnection();
    setIsLoading(false);
    event.preventDefault();
  };

  const createConnection = async () => {
    try {
      const data = {
        ...itemState,
        id: itemState.name,
      };
      await domainApi.addConnection(company.id, domain.id, data);
      navigate(-1);
    } catch (err) {
      if (err.response && err.response.status == 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setMode("view");
    if (event.target.innerText === "Close") navigate("/onboarding-connections");
    if (mode === "new" && event.target.innerText === "Cancel")
      navigate("/onboarding-connections");
    // event.preventDefault();

    // if (window.history.length) {
    //   setMode("view");
    //   if (mode === "new" && event.target.innerText === "Cancel")
    //     navigate("/onboarding-connections");
    // } else navigate(-1);
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
      await domainApi.updateConnection(company.id, domain.id, itemState);
      navigate(-1);
    } catch (err) {
      if (err.response && err.response.status == 409) {
        setError(`duplicated error: ${itemState.name} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyClick = async (e) => {
    try {
      e.preventDefault();
      // 1. Copy the text using the Clipboard API
      await navigator.clipboard.writeText(connection.clientSecret);

      // 2. Set the state to 'copied' to show the checkmark
      setIsCopied(true);

      // 3. Set a timer to revert the button back to the copy icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy content: ", err);
      // Optional: Handle error feedback here
    }
  };
  const customClassEdit =
    "ms-2 text-sm font-medium text-gray-900 flex-grow min-w-0 dark:text-gray-300 dark:bg-gray-800 bg-gray-400 text-gray-800";
  const customClass =
    "ms-2 text-sm font-medium text-gray-900 flex-grow min-w-0 dark:text-gray-800 dark:bg-gray-300";

  if (mode == "new" || mode == "edit") {
    return (
      <div className="flex justify-center">
        <form className="mt-8 space-y-6 w-full max-w-screen-lg">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) => (
              <Input
                key={field.id}
                handleChange={handleChange}
                value={itemState[field.id]}
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
        <form className="mt-8 space-y-6  w-full max-w-screen-lg">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) => (
              <div className="flex flex-row w-full ">
                <ItemView
                  Item={connection}
                  key={field.id}
                  handleChange={handleChange}
                  value={itemState[field.id]}
                  field={field}
                  customClass={
                    field.customClass ? field.customClass : customClassEdit
                  }
                />
                {field.component
                  ? field.component({
                      handleCopyClick: handleCopyClick,
                      isCopied: isCopied,
                    })
                  : null}
              </div>
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
