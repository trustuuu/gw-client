import React from "react";
import { useEffect, useState } from "react";
import { apiAppRolesFields } from "../../constants/apiFields";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import ApiAppRoles from "./ApiAppRoles";
import apiApi from "../../api/api-api";
import Modal from "../../component/Modal";
import ItemField from "../../component/ItemField";
import { generateString } from "../../utils/Utils";
import { useAuth } from "../../component/AuthContext";

const fields = apiAppRolesFields;
let fieldsState = {};

function ApiAppRolePage({ mode, api: apiState }) {
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const { api: apiAuth, setIsLoading } = useAuth();
  const api = apiState ? apiState : apiAuth;

  const [roleMode, setRoleMode] = useState(mode);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState({
    displayName: "",
    description: "",
    value: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);
  const [checkedItems, setCheckedItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemState, setItemState] = useState(
    roleMode === "new"
      ? {
          ...fieldsState,
          displayName: "",
          description: "",
          value: "",
        }
      : fieldsState
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    roles.length > 0 ? roles.slice(indexOfFirstPost, indexOfLastPost) : [];
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const onClickAddrole = async function () {
    setRoleMode("new");
    setRole({
      displayName: "",
      allowedMemberType: "UsersGroups",
      description: "",
      value: "",
    });
    setItemState({
      displayName: "",
      allowedMemberType: "UsersGroups",
      description: "",
      value: "",
    });
    setModalOpen(true);
  };

  const onCloseroleModal = async function () {
    setModalOpen(false);
  };

  const onClickNew = async function () {
    setIsLoading(true);
    const surfix = generateString(5);
    await apiApi.createAppRole(api.id, {
      ...itemState,
      id: `${itemState.value}${surfix}`,
    });
    setRole({ displayName: "", description: "", value: "" });
    setItemState({ displayName: "", description: "", value: "" });
    await getApiroles();
    setIsLoading(false);
    setModalOpen(false);
  };

  const onClickEdit = async function (role) {
    setRoleMode("edit");
    setRole(role);
    setItemState(role);
    setModalOpen(true);
  };

  const onClickApply = async function () {
    setIsLoading(true);
    await apiApi.updateAppRole(api.id, itemState);
    setRole({ displayName: "", description: "", value: "" });
    setItemState({ displayName: "", description: "", value: "" });
    await getApiroles();
    setIsLoading(false);
    setModalOpen(false);
  };

  const onClickDel = async function (e) {
    //const api = await apiApi.get(company.id, domain.id, checkedItems);
    setIsLoading(true);
    await apiApi.removeAppRole(api.id, e.id);
    await getApiroles();
    setIsLoading(false);
  };

  const onClickDelMulti = async function () {
    setIsLoading(true);
    await apiApi.removeAppRole(api.id, checkedItems);
    await getApiroles();
    setIsLoading(false);
  };

  const getApiroles = async () => {
    if (!api || !api.id) return;

    const items = await apiApi.getAppRoles(api.id);
    setRoles(items.data);
    setPageEnd(
      Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
        ? Math.ceil(items.data.length / postsPerPage)
        : pageDisplayCount
    );
  };

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

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  useEffect(() => {
    setIsLoading(true);
    getApiroles();
    setIsLoading(false);
  }, []);

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex items-center justify-between">
        <div className="space-y-4 ml-10">
          <label
            htmlFor="description"
            className="text-pretty ms-2 text-sm font-medium min-w-48 max-w-48 "
          ></label>
          <br />
          <Toolbox
            NewButtonLabel="Add"
            onClickNew={onClickAddrole}
            onClickDel={onClickDelMulti}
            parentCallback={handleCallback}
            disabledDel={checkedItems.length < 1}
          />
        </div>
      </header>
      <div className="w-full p-3">
        {/* roles */}
        <ApiAppRoles
          roles={currentPosts}
          parentCallback={handleCallback}
          onClickDel={onClickDel}
          onClickEdit={onClickEdit}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={roles.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(roles.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(roles.length / postsPerPage)
              : pageDisplayCount
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>

      <div className="flex items-center justify-center">
        <Modal
          hasCloseBtn={true}
          isOpen={modalOpen}
          onClose={onCloseroleModal}
          optionBtnLabel={roleMode === "new" ? "Add" : "Apply"}
          onOptionBtnClick={roleMode === "new" ? onClickNew : onClickApply}
        >
          <div className="space-y-4">
            {fields.map((field) =>
              (field.hiddenUpdate || field.hiddenUpdate !== undefined) &&
              roleMode === "edit" ? (
                <></>
              ) : (
                <ItemField
                  key={field.name}
                  item={role}
                  handleChange={handleChange}
                  value={
                    field.valueType === "array" && itemState[field.id]
                      ? itemState[field.id].join("\r\n")
                      : itemState[field.id]
                  }
                  field={field}
                  mode={roleMode}
                />
              )
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ApiAppRolePage;
