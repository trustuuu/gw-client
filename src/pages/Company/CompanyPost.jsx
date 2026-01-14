import { useState } from "react";
import { companyFields } from "../../constants/formFields";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // 1. Import hooks
import companyApi from "../../api/company-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";
import { useAuth } from "../../component/AuthContext";

const fields = companyFields;
let fieldsState = {};
fields.forEach(
  (field) =>
    (fieldsState[field.id] =
      field.type == "checkbox" ? false : field.default ?? "")
);

export default function CompanyPost() {
  const queryClient = useQueryClient();
  const { setIsLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState();
  
  const { header, company, parent } = location.state;
  const [mode, setMode] = useState(location.state.mode);
  const [itemState, setItemState] = useState(
    mode == "new" ? { ...fieldsState, type: "customer" } : { ...company }
  );

  // 3. Define Mutations for Create and Update
  const mutation = useMutation({
    mutationFn: async ({ data, action }) => {
      if (action === "create") {
        return await companyApi.create(
          { ...data, id: data.name, parent: parent.id },
          header
        );
      } else {
        return await companyApi.update(data, header);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      navigate(-1);
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        setError(`Duplicated error: ${itemState.name} already exists!`);
      } else {
        setError(err.message);
      }
    },
    onSettled: () => setIsLoading(false),
  });

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
    event.preventDefault();
    setIsLoading(true);
    mutation.mutate({ data: itemState, action: "create" });
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsLoading(true);
    mutation.mutate({ data: itemState, action: "update" });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    // Simplified cancel logic
    navigate("/onboarding-companies");
  };

  const handleEdit = (event) => {
    event.preventDefault();
    setMode("edit");
  };

  // ... Styling classes (customClass, etc.) remain same
  const customClassEdit = "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-80 dark:bg-gray-800 bg-gray-400 text-gray-800";
  const customClass = "ms-2 text-sm font-medium text-gray-900 dark:text-gray-800 min-w-80 dark:bg-gray-300 ";

  if (mode == "new" || mode == "edit") {
    return (
      <div className="flex justify-center">
        <form className="mt-8 space-y-6" onSubmit={mode === "new" ? handleSubmit : handleSave}>
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) => (
              <Input
                company={parent}
                key={field.id}
                handleChange={handleChange}
                value={itemState[field.id]}
                field={field}
                customClass={field.customClass ? field.customClass : customClass}
                reseller={field.reseller}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction
                handleSubmit={mode == "new" ? handleSubmit : handleSave}
                text={mode == "new" ? "Create" : "Save"}
                disabled={mutation.isPending} // Disable button during save
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
    // View mode remains largely the same...
    return (
      <div className="flex justify-center">
        <div className="mt-8 space-y-6">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) => (
              <ItemView
                Item={company}
                company={parent}
                key={field.id}
                handleChange={handleChange}
                value={itemState[field.id]}
                field={field}
                customClass={field.customClass ? field.customClass : customClassEdit}
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
        </div>
      </div>
    );
  }
}