import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  ButtonUnstyledProps,
  ButtonUnstyledTypeMap,
} from '@mui/base/ButtonUnstyled';
import { useButton } from '@mui/base';
import { OverridableComponent } from '@mui/types';
import clsx from 'clsx';

import classes from './Button.module.css';

export const ButtonBase = forwardRef(function ButtonBase<
  BaseComponentType extends React.ElementType = ButtonUnstyledTypeMap['defaultComponent']
>(
  props: ButtonUnstyledProps<BaseComponentType>,
  forwardedRef: React.ForwardedRef<
    HTMLButtonElement | HTMLAnchorElement | HTMLElement
  >
) {
  const {
    action,
    children,
    component,
    disabled,
    focusableWhenDisabled = false,
    onBlur,
    onClick,
    onFocus,
    onFocusVisible,
    onKeyDown,
    onKeyUp,
    onMouseLeave,
    ...other
  } = props;

  const buttonRef = useRef<
    HTMLButtonElement | HTMLAnchorElement | HTMLElement
  >();

  const { active, focusVisible, setFocusVisible, getRootProps } = useButton({
    ...props,
    focusableWhenDisabled,
    onFocusVisible,
  });

  const rootProps = getRootProps({
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    onMouseLeave,
  });

  useImperativeHandle(
    action,
    () => ({
      focusVisible: () => {
        setFocusVisible(true);
        buttonRef.current!.focus();
      },
    }),
    [setFocusVisible]
  );

  const rootClasses = {
    [classes.root]: true,
    [classes.active]: active,
    [classes.disabled]: disabled,
    [classes.focusVisible]: focusVisible,
  };

  const defaultElement = other.href || other.to ? 'a' : 'button';
  const Root: React.ElementType = component ?? defaultElement;

  return (
    <Root
      className={clsx(rootClasses)}
      {...other}
      {...rootProps}
      ref={forwardedRef}
    >
      {children}
    </Root>
  );
}) as OverridableComponent<ButtonUnstyledTypeMap>;
