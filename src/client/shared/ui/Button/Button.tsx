import { ForwardedRef, forwardRef, useMemo } from 'react';
import {
  ButtonUnstyledProps,
  ButtonUnstyledTypeMap,
  ButtonUnstyledOwnProps,
} from '@mui/base/ButtonUnstyled';
import { OverridableComponent } from '@mui/types';
import clsx from 'clsx';

import { ButtonBase } from '../ButtonBase/ButtonBase';

import classes from './Button.module.css';

type Props = {
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef(function Button(
  props: ButtonUnstyledProps & Props,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { children, fullWidth, ...rest } = props;

  const slotProps = useMemo<ButtonUnstyledOwnProps['slotProps']>(
    () => ({
      root: (ownerState) => {
        return {
          className: clsx(
            ownerState.active && classes.active,
            ownerState.disabled && classes.disabled,
            ownerState.focusVisible && classes.focusVisible
          ),
        };
      },
    }),
    []
  );

  return (
    <ButtonBase
      {...rest}
      className={clsx(classes.root, fullWidth && classes.fullWidth)}
      ref={forwardedRef}
      slotProps={slotProps}
    >
      {children}
    </ButtonBase>
  );
}) as OverridableComponent<ButtonUnstyledTypeMap<Props>>;
