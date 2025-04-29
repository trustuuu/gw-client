import { useNavigate } from "react-router-dom";
import FormAction from "../FormAction";

export default function TabBody(props) {
  const navigate = useNavigate();

  const handleCancel = (event) => {
    navigate(-1);
    event.preventDefault();
  };

  return (
    <div className="w-full py-2">
      {props.data[props.visibleTab].content}
      <div
        className={`flex items-center justify-center ${
          props.data[props.visibleTab].closeButton ? "" : "invisible"
        }`}
      >
        <div className="max-w-40">
          <FormAction handleSubmit={handleCancel} text="Close" />
        </div>
      </div>
    </div>
  );
}
