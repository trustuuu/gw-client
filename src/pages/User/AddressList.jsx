import { useEffect, useState } from "react";
import { addressFields } from "../../constants/addressFields";
import Checkbox from "../../component/Checkbox";
import Modal from "../../component/Modal";
import ObjectPost from "./ObjectPost";
import Toolbox from "../../component/Toolbox";

const fields = addressFields;
let fieldsState = {};
fields.forEach(
  (field) => (fieldsState[field.id] = field.type === "checkbox" ? false : "")
);

export default function AddressList({
  modeAddress,
  addresses,
  handleChange,
  propName,
}) {
  //const { setIsLoading } = useAuth();
  //   const location = useLocation();
  //   const navigate = useNavigate();

  const [modalMode, setModalMode] = useState(modeAddress);
  const [addressPostMode, setAddressPostMode] = useState(modeAddress);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [addrs, setAddresses] = useState(addresses);

  useEffect(() => {
    setModalMode(modeAddress);
  }, [modeAddress]);

  useEffect(() => {
    handleChange(propName, addrs);
  }, [addrs]);

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
        ...addrs.filter(
          (a) => `${a.streetAddress}${a.locality}${a.country}` == item
        ),
      ]);
    } else {
      setCheckedItems(
        checkedItems.filter(
          (a) => `${a.streetAddress}${a.locality}${a.country}` != item
        )
      );
    }
  };

  const onClickView = (address) => {
    modalMode == "edit"
      ? setAddressPostMode("edit")
      : setAddressPostMode("view");
    setCurrent(address);
    setModalOpen(true);
  };

  const onClickAdd = async function (event) {
    setAddressPostMode("new");
    setModalOpen(true);
    event.preventDefault();
  };

  const onClickDel = async function (event) {
    const removeKeys = new Set(
      checkedItems.map((a) => `${a.streetAddress}${a.locality}${a.country}`)
    );
    setAddresses(
      addrs.filter(
        (a) => !removeKeys.has(`${a.streetAddress}${a.locality}${a.country}`)
      )
    );

    event.preventDefault();
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const handleCreate = (address) => {
    setAddresses([...addrs, address]);
  };

  const handleSave = (address) => {
    const updatedAddresses = addrs.map((a) =>
      `${a.streetAddress}${a.locality}${a.country}` ===
      `${current.streetAddress}${current.locality}${current.country}`
        ? address
        : a
    );
    setAddresses(updatedAddresses);
    setCurrent(address);
  };
  const fixedButtonClass =
    "disabled:hover:cursor-not-allowed disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 rounded";

  return (
    <div className="p-3">
      {/* Addresses */}
      <div>
        <header>
          <div className="text-xs uppercase rounded-sm font-semibold p-2 flex flex-row items-start max-w-2">
            <div className="px-2">Addresses </div>
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
                  Address
                </div>
                <div className="text-left uppercase justify-self-start w-4/6">
                  City
                </div>
                <div className="text-left uppercase justify-self-start w-1/6">
                  State
                </div>
              </div>
            </div>
          </li>
          {addrs ? (
            addrs.map((address, index) => {
              return (
                <li
                  className="flex px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer"
                  key={index}
                >
                  <div className="self-center mr-3">
                    {modalMode === "new" || modalMode === "edit" ? (
                      <Checkbox
                        name={`${address.streetAddress}${address.locality}${address.country}`}
                        id={`${address.streetAddress}${address.locality}${address.country}`}
                        checked={checkedItems.find(
                          (g) =>
                            `${g.streetAddress}${g.locality}${g.country}` ==
                            `${address.streetAddress}${address.locality}${address.country}`
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
                      //noDetailView ? null : onClickView.bind(this, address)
                      onClickView.bind(this, address)
                    }
                  >
                    <div className="grow flex items-center text-sm py-2">
                      <div className="self-center uppercase w-1/6 min-w-12">
                        {address ? address.type : ""}
                      </div>
                      <div className="text-left justify-self-start w-4/6">
                        {address ? address.streetAddress : ""}
                      </div>
                      <div className="text-left justify-self-start w-4/6">
                        {address ? address.locality : ""}
                      </div>
                      <div className="text-left justify-self-start w-1/6">
                        {address ? address.region : ""}
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
                  key="myaddress"
                  modeObject={addressPostMode}
                  Item={current}
                  fields={addressFields}
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
