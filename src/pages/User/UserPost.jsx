import { useState } from "react";
import { userFields } from "../../constants/formFields";
import { useNavigate, useLocation } from "react-router-dom";
import userApi from "../../api/user-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";
import { useAuth } from "../../component/AuthContext";

const fields = userFields;
let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type === "checkbox" ? false : "")
);

export default function UserPost() {
  const { setIsLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [errorText, setError] = useState();
  const { company, domain, user } = location.state;
  const [mode, setMode] = useState(location.state.mode);
  const [itemState, setItemState] = useState(
    mode == "new" ? fieldsState : user
  );
  const handleChange = (e) => {
    setItemState({
      ...itemState,
      [e.target.id]:
        e.target.value === "true" || e.target.value === "false"
          ? e.target.checked
          : e.target.value,
    });
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
        setError(`duplicated error: ${itemState.username} already exist!`);
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
    setIsLoading(true);
    saveItem();
    setIsLoading(false);
    event.preventDefault();
  };

  const saveItem = async () => {
    try {
      await userApi.update(company.id, domain.id, itemState);
      navigate(-1);
    } catch (err) {
      if (err.response.status === 409) {
        setError(`duplicated error: ${itemState.username} already exist!`);
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
              ) : (
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
            {fields.map((field) =>
              field.hiddenDisplay ||
              field.hiddenDisplay !== undefined ? null : (
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
              )
            )}
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
