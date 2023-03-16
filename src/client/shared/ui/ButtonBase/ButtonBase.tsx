import { ForwardedRef, ElementType, forwardRef } from 'react';
import ButtonUnstyled, {
  ButtonUnstyledProps,
  ButtonUnstyledTypeMap,
} from '@mui/base/ButtonUnstyled';
import { OverridableComponent } from '@mui/types';
import clsx from 'clsx';

import classes from './ButtonBase.module.css';

export const ButtonBase = forwardRef(function ButtonBase<
  BaseComponentType extends ElementType = ButtonUnstyledTypeMap['defaultComponent']
>(
  props: ButtonUnstyledProps<BaseComponentType>,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { disabled, className, ...other } = props;

  return (
    <ButtonUnstyled
      {...other}
      className={clsx(className, classes.root, disabled && classes.disabled)}
      disabled={disabled}
      ref={forwardedRef}
    />
  );
}) as OverridableComponent<ButtonUnstyledTypeMap>;
