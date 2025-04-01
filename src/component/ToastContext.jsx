import React from 'react';
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from 'react-toastify';

const defaultOptions = {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 10000
};

const ToastContext = React.createContext();
const ToastContextProvider = ({children}) => {
    const value = {
        success: (message, option) => toast.success(message, option || defaultOptions),
        error: (message, option) => toast.error(message, option || defaultOptions),
        warn: (message, option) => toast.warn(message, option || defaultOptions),
        info: (message, option) => toast.info(message, option || defaultOptions),
        default: (message, option) => toast(message, option || defaultOptions)
    };
    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer style={{width: "100%", maxWidth: "600px"}}/>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = React.useContext(ToastContext);
    if(context === undefined){
        throw new Error("useToastContext should be used within a ToastContextProvider.");
    }
    return context;
};

export {useToast, ToastContextProvider};