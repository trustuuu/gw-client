import { useEffect, useState } from "react";
import { userFields } from "../../constants/userFields";
import { useNavigate, useLocation } from "react-router-dom";
import userApi from "../../api/user-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";
import { useAuth } from "../../component/AuthContext";
import DivExpand from "../../component/DivExpand";

const fields = userFields;
let fieldsState = {};
fields.forEach(
  (field) =>
    (fieldsState[field.id] =
      field.type == "checkbox" ? false : field.default ?? "")
);

export default function UserPost(props) {
  const {
    setIsLoading,
    setActiveUser,
    company: companyAuth,
    domain: domainAuth,
    activeUser: userAuth,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [errorText, setError] = useState();

  const {
    company: companyState,
    domain: domainState,
    user: userState,
    mode: initMode,
  } = location.state || {};
  const [mode, setMode] = useState(initMode ? initMode : props.mode ?? "new");
  const user = userState ? userState : userAuth;
  const domain = domainState ? domainState : domainAuth;
  const company = companyState ? companyState : companyAuth;
  const [itemState, setItemState] = useState(
    mode == "new" ? fieldsState : user
  );
  // useEffect(() => {
  //   setItemState(mode == "new" ? fieldsState : user);
  // }, [user]);

  const handleChange = (e) => {
    setItemState({
      ...itemState,
      [e.target.id]:
        e.target.value === "true" ||
        e.target.value === "false" ||
        e.target.value === "on"
          ? e.target.checked
          : e.target.value,
    });
  };

  const changeSubprops = (propName, item) => {
    setItemState((prev) => ({ ...prev, [propName]: item }));
  };
  const handleSubmit = (event) => {
    setIsLoading(true);
    createItem();
    setIsLoading(false);
    event.preventDefault();
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
      if (itemState.authVerification !== itemState.confirmPassword) {
        setError("Password mismatch!");
        return;
      }
      let data = await populateItem(itemState);

      await userApi.create(company.id, domain.id, data);
      navigate(-1);
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.userName} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  // const handleCancel = (event) => {
  //   setMode("view");
  //   event.preventDefault();
  // };

  const handleClose = (event) => {
    event.preventDefault();
    if (window.history.length) {
      navigate("/users");
    } else navigate(-1);
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
      const newitemState = { ...itemState };
      delete newitemState.authVerification;

      await userApi.update(company.id, domain.id, newitemState);
      setActiveUser(newitemState);
      setMode("view");
      //navigate(-1);
    } catch (err) {
      console.log("err", err);
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.userName} already exist!`);
      } else {
        setError(err.message);
      }
      console.log(err);
    }
  };

  const customClassEdit = "ms-2 text-sm font-medium min-w-80 ";
  const customClass = "ms-2 text-sm font-medium min-w-80 ";
  if (mode === "new" || mode === "edit") {
    return (
      <div className="flex justify-center">
        <form className="mt-8 space-y-6">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) =>
              (field.hiddenUpdate || field.hiddenUpdate !== undefined) &&
              mode === "edit" ? (
                <></>
              ) : field.type !== "component" ? (
                <Input
                  company={company}
                  key={field.id}
                  handleChange={handleChange}
                  value={itemState[field.id]}
                  field={field}
                  customClass={
                    field.customClass ? field.customClass : customClass
                  }
                  reseller={field.reseller}
                />
              ) : Array.isArray(itemState[field.id]) ? (
                <DivExpand
                  key={`editDiv${field.id}`}
                  title={`${
                    field.id.charAt(0).toUpperCase() + field.id.slice(1)
                  } ${
                    Array.isArray(itemState[field.id])
                      ? "(" + itemState[field.id].length + ")"
                      : ""
                  }`}
                  initOpen={field.initOpen}
                >
                  {field.component({
                    mode: mode,
                    values: itemState[field.id],
                    handleChange: changeSubprops,
                    propName: field.id,
                  })}
                </DivExpand>
              ) : (
                <DivExpand
                  key={`editDiv${field.id}`}
                  title={`${
                    field.id.charAt(0).toUpperCase() + field.id.slice(1)
                  } ${
                    Array.isArray(itemState[field.id])
                      ? "(" + itemState[field.id].length + ")"
                      : ""
                  }`}
                  initOpen={field.initOpen}
                >
                  {field.component({
                    mode: mode,
                    values: itemState[field.id],
                    handleChange: changeSubprops,
                    propName: field.id,
                  })}
                </DivExpand>
              )
            )}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction
                handleSubmit={mode === "new" ? handleSubmit : handleSave}
                text={mode === "new" ? "Create" : "Save"}
              />
            </div>
            <div>
              <FormAction handleSubmit={handleClose} text="Cancel" />
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
            {fields.map((field) =>
              field.hiddenDisplay ||
              field.hiddenDisplay !== undefined ? null : field.type !==
                "component" ? (
                <ItemView
                  Item={user}
                  company={company}
                  key={field.id}
                  handleChange={handleChange}
                  value={itemState[field.id]}
                  field={field}
                  customClass={
                    field.customClass ? field.customClass : customClassEdit
                  }
                />
              ) : (
                <DivExpand
                  key={`viewDiv${field.id}`}
                  title={`${
                    field.id.charAt(0).toUpperCase() + field.id.slice(1)
                  } ${
                    Array.isArray(itemState[field.id])
                      ? "(" + itemState[field.id].length + ")"
                      : ""
                  }`}
                  initOpen={field.initOpen}
                >
                  {field.component({
                    mode: mode,
                    values: itemState[field.id],
                    handleChange: changeSubprops,
                    propName: field.id,
                  })}
                </DivExpand>
              )
            )}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction handleSubmit={handleEdit} text="Edit" />
            </div>
            <div>
              <FormAction handleSubmit={handleClose} text="Close" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
