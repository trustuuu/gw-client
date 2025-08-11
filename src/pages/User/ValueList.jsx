import { useEffect, useState } from "react";
import { typeFields } from "../../constants/typeFields";
import Checkbox from "../../component/Checkbox";
import Modal from "../../component/Modal";
import Toolbox from "../../component/Toolbox";
import ObjectPost from "./ObjectPost";

const fields = typeFields;
let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type === "checkbox" ? false : "")
);

export default function ValueList({
  modeValue,
  values,
  handleChange,
  propName,
}) {
  //const { setIsLoading } = useAuth();
  //   const location = useLocation();
  //   const navigate = useNavigate();

  const [modalMode, setModalMode] = useState(modeValue);
  const [valuePostMode, setValuePostMode] = useState(modeValue);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [valueList, setValueList] = useState(values);

  useEffect(() => {
    setModalMode(modeValue);
  }, [modeValue]);

  useEffect(() => {
    handleChange(propName, valueList);
  }, [valueList]);

  const handleClose = () => {
    setModalOpen(false);
  };

  const [checkedItems, setCheckedItems] = useState([]);

  const handleChangeCheck = function (e) {
    const item = e.target.name;
    const isChecked = e.target.checked;

    if (!item) return;

    if (isChecked) {
      setCheckedItems([
        ...checkedItems,
        ...valueList.filter((a) => `${a.type}${a.value}` == item),
      ]);
    } else {
      setCheckedItems(
        checkedItems.filter((a) => `${a.type}${a.value}` != item)
      );
    }
  };

  const onClickView = (value) => {
    modalMode == "edit" ? setValuePostMode("edit") : setValuePostMode("view");
    setCurrent(value);
    setModalOpen(true);
  };

  const onClickAdd = async function (event) {
    setValuePostMode("new");
    setModalOpen(true);
    event.preventDefault();
  };

  const onClickDel = async function (event) {
    const removeKeys = new Set(checkedItems.map((a) => `${a.type}${a.value}`));
    setValueList(
      valueList.filter((a) => !removeKeys.has(`${a.type}${a.value}`))
    );

    event.preventDefault();
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const handleCreate = (value) => {
    setValueList([...valueList, value]);
  };

  const handleSave = (value) => {
    const updatedValues = values.map((e) =>
      `${e.type}${e.value}` === `${current.type}${current.value}` ? value : e
    );
    setValueList(updatedValues);
    setCurrent(value);
  };

  const fixedButtonClass =
    "disabled:hover:cursor-not-allowed disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 rounded";

  return (
    <div className="p-3">
      {/* Valuees */}
      <div>
        <header>
          <div className="text-xs uppercase rounded-sm font-semibold p-2 flex flex-row items-start max-w-2">
            <div className="px-2">{propName}</div>
            {modalMode === "edit" || modalMode === "new" ? (
              <Toolbox
                NewButtonLabel="Add"
                onClickNew={onClickAdd}
                onClickDel={onClickDel}
                parentCallback={handleCallback}
                disabledDel={checkedItems.length < 1}
                disableCaption={true}
                customClass={fixedButtonClass}
              />
            ) : (
              <></>
            )}
          </div>
        </header>
        <ul className="my-1">
          {/* Item */}
          <li className="flex px-2 font-bold">
            <div className="self-center mr-7"></div>
            <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
              <div className="grow flex">
                <div className="self-center uppercase w-1/6 min-w-12">Type</div>
                <div className="text-left uppercase justify-self-start w-4/6">
                  {propName}
                </div>
                <div className="text-left uppercase justify-self-start w-1/6">
                  Primary
                </div>
              </div>
            </div>
          </li>
          {valueList ? (
            valueList.map((value, index) => {
              return (
                <li
                  className="flex px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer"
                  key={index}
                >
                  <div className="self-center mr-3">
                    {modalMode === "new" || modalMode === "edit" ? (
                      <Checkbox
                        name={`${value.type}${value.value}`}
                        id={`${value.type}${value.value}`}
                        checked={checkedItems.find(
                          (g) =>
                            `${g.type}${g.value}` ==
                            `${value.type}${value.value}`
                        )}
                        onChange={handleChangeCheck}
                      />
                    ) : (
                      <div className="self-center mr-3"></div>
                    )}
                  </div>
                  <div
                    className="grow flex"
                    onClick={
                      //noDetailView ? null : onClickView.bind(this, value)
                      onClickView.bind(this, value)
                    }
                  >
                    <div className="grow flex items-center text-sm py-2">
                      <div className="self-center uppercase w-1/6 min-w-12">
                        {value ? value.type : ""}
                      </div>
                      <div className="text-left justify-self-start w-4/6">
                        {value ? value.value : ""}
                      </div>
                      <div className="text-left justify-self-start w-1/6">
                        {value.primary ? "True" : "False"}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <div></div>
          )}
        </ul>
      </div>

      <div className="w-full flex items-center justify-center">
        <Modal
          hasCloseBtn={false}
          isOpen={modalOpen}
          //onClose={handleClose}
          //   optionBtnLabel={
          //     modalMode === "edit" || modalMode === "new" ? "Add" : ""
          //   }
          //onOptionBtnClick={onClickAdd}
          customClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm "
        >
          <div className="flex flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col w-1/3 p-4">
              <div>
                <ObjectPost
                  key="myvalue"
                  modeObject={valuePostMode}
                  Item={current}
                  fields={typeFields}
                  handleCancel={handleClose}
                  handleCreate={handleCreate}
                  handleSave={handleSave}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
