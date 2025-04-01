import React from 'react';
import classNames from 'classnames';

export default function Row({children, className, ...props}) {
  return (
    <div className={classNames('md:flex items-center', className)} {...props}>
      {children}
    </div>
  )
}
