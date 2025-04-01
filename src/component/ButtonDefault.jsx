import React from 'react';
import classNames from 'classnames';
import Button from './Button';

const ButtonDanger = React.forwardRef(({className, ...props}, ref) => <Button ref={ref} className={classNames('btn-default', className)} {...props} />);

export default ButtonDanger;