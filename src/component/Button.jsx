import React from 'react';
import classNames from 'classnames';
import Loader from 'react-spinners/PulseLoader';

const Button = React.forwardRef(({children, isLoading, className, ...props}, ref) => 
    <button ref={ref} className={classNames('btn btn-raised', className)} disabled={isLoading} {...props}>{isLoading ? <Loader color="var(--blue-light)" />  : children}</button>);

export default Button;