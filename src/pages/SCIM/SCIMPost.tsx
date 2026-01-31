import { useState } from "react";
import { scimFields } from "../../constants/scimFields";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import scimApi from "../../api/scim-api";
import applicationApi from "../../api/application-api";
import Input from "../../component/Input";
import FormAction from "../../component/FormAction";
import ItemView from "../../component/ItemView";
import { useAuth } from "../../component/AuthContext";
import { SCIM } from "../../types/SCIM";
import { Company } from "../../types/Company";
import { Domain } from "../../types/Domain";

const fields: any[] = scimFields;
let fieldsState: any = {};
fields.forEach(
  (field) =>
    (fieldsState[field.id] =
      field.type === "checkbox" ? false : (field as any).default ?? "")
);

export default function SCIMPost() {
  const queryClient = useQueryClient();
  const {
    company: companyAuth,
    domain: domainAuth,
    scim: scimAuth,
    setIsLoading,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [errorText, setError] = useState<string>();

  const {
    company: companyState,
    domain: domainState,
    scim: scimState,
    mode: initialMode,
  } = (location.state || {
    company: null,
    domain: null,
    scim: null,
  }) as {
    company: Company | null;
    domain: Domain | null;
    scim: SCIM | null;
    mode?: string;
  };
  const scim = scimState ? scimState : scimAuth;
  const company = companyState ? companyState : companyAuth;
  const domain = domainState ? domainState : domainAuth;

  const [mode, setMode] = useState(initialMode);
  const [itemState, setItemState] = useState<any>(
    mode === "new" ? { ...fieldsState } : { ...scim }
  );
  const [displayedToken, setDisplayedToken] = useState<string>("");

  const handleGetToken = async (e: React.MouseEvent) => {
    e.preventDefault();
    const appId = import.meta.env.VITE_SCIM_APPLICATION; // itemState.applicationId;
    if (!appId) {
      setError("Please select an application first");
      return;
    }

    try {
      setIsLoading(true);
      // Fetch full app details to get client_secret

      const appResponse = await applicationApi.get(
        company.id,
        domain.id,
        appId,
        null
      );
      const app = appResponse.data;
      const tokenResponse = await applicationApi.getToken(
        appId,
        app.client_id,
        app.client_secret
      );
      setDisplayedToken(tokenResponse.data.access_token);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve token");
    } finally {
      setIsLoading(false);
    }
  };

  const { data: applications = [] } = useQuery({
    queryKey: ["applications", company?.id, domain?.id],
    queryFn: async () => {
      const response = await applicationApi.get(
        company.id,
        domain.id,
        null,
        null
      );
      return response.data;
    },
    enabled: !!company?.id && !!domain?.id,
  });

  // Update fields with application list
  const appField = fields.find((f) => f.id === "applicationId");
  if (appField) {
    appField.list = applications.map((app: any) => ({
      key: app.id,
      value: app.client_name,
    }));
  }

  const mutation = useMutation({
    mutationFn: async ({ data, action }: { data: any; action: string }) => {
      if (action === "create") {
        const payload = {
          ...data,
          id: data.name,
        };
        return await scimApi.create(company.id, domain.id, payload);
      } else {
        return await scimApi.update(company.id, domain.id, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scims", company?.id, domain?.id],
      });
      navigate(-1);
    },
    onError: (err: any) => {
      if (err.response?.status === 409) {
        setError(`Duplicated error: ${itemState.name} already exists!`);
      } else {
        setError(err.message);
      }
    },
    onSettled: () => setIsLoading(false),
  });

  const handleChange = (e: any) => {
    setItemState({
      ...itemState,
      [e.target.id]:
        e.target.value === "true" || e.target.value === "false"
          ? e.target.checked
          : e.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    mutation.mutate({ data: itemState, action: "create" });
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    mutation.mutate({ data: itemState, action: "update" });
  };

  const handleCancel = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(-1);
  };

  const handleEdit = (event: React.FormEvent) => {
    event.preventDefault();
    setMode("edit");
  };

  const customClassEdit =
    "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 min-w-80 dark:bg-gray-800 bg-gray-400 text-gray-800";
  const customClass =
    "ms-2 text-sm font-medium text-gray-900 dark:text-gray-800 min-w-80 dark:bg-gray-300 ";

  if (mode === "new" || mode === "edit") {
    return (
      <div className="flex justify-center">
        <form
          className="mt-8 space-y-6"
          onSubmit={mode === "new" ? handleSubmit : handleSave}
        >
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) =>
              field.hiddenUpdate || field.hiddenUpdate !== undefined ? (
                <></>
              ) : (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={itemState[field.id]}
                  field={field}
                  customClass={
                    field.customClass ? field.customClass : customClass
                  }
                  company={company}
                ></Input>
              )
            )}
          </div>
          <div className="flex justify-center">
            <div className="mr-3">
              <FormAction
                handleSubmit={mode === "new" ? handleSubmit : handleSave}
                text={mode === "new" ? "Create" : "Save"}
                disabled={mutation.isPending}
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
        <div className="mt-8 space-y-6">
          <h4 className="text-red-400">{errorText}</h4>
          <div className="space-y-4">
            {fields.map((field) =>
              field.hiddenDisplay || field.hiddenDisplay !== undefined ? (
                <></>
              ) : (
                <ItemView
                  Item={scim}
                  key={field.id}
                  handleChange={handleChange}
                  value={itemState[field.id]}
                  field={field}
                  customClass={
                    field.customClass ? field.customClass : customClassEdit
                  }
                  company={company}
                >
                  {field.id === "applicationId" && (
                    <div className="flex items-center ml-2">
                      <button
                        onClick={handleGetToken}
                        className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Get Token
                      </button>
                    </div>
                  )}
                </ItemView>
              )
            )}
            {displayedToken && (
              <textarea
                disabled
                rows={5}
                value={displayedToken}
                className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-600 dark:accent-pink-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              />
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
        </div>
      </div>
    );
  }
}
