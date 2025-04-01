import classNames from "classnames";

export default function ShawdowBox({children, className, ...otherProps}){
    return (
        <div className={classNames("shadow-lg", className)} {...otherProps}>
            {children}
        </div>
    );
}