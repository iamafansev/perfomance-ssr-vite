import { ElementType, ForwardedRef, ReactNode, Ref, forwardRef } from 'react';
import { OverridableComponent, OverrideProps } from '@mui/types';
import clsx from 'clsx';

import classes from './Link.module.css';

type OwnProps = {
  href?: string;
  to?: string;
  underline?: boolean;
  className?: string;
  children?: ReactNode;
};

type RootProps = Pick<OwnProps, 'href' | 'className' | 'to' | 'children'> & {
  ref: Ref<HTMLAnchorElement | HTMLButtonElement | HTMLElement>;
};

type LinkTypeMap<P = object, D extends ElementType = 'a'> = {
  props: P & OwnProps;
  defaultComponent: D;
};

type LinkProps<D extends React.ElementType = LinkTypeMap['defaultComponent']> =
  OverrideProps<LinkTypeMap<object, D>, D> & {
    component?: D;
  };

export const Link = forwardRef(function Link<
  ComponentType extends ElementType = LinkTypeMap['defaultComponent']
>(
  props: LinkProps<ComponentType>,
  forwardedRef: ForwardedRef<
    HTMLAnchorElement | HTMLButtonElement | HTMLElement
  >
) {
  const { children, className, underline, ...other } = props;

  const defaultElement = props.href || props.to ? 'a' : 'button';
  const Component: ElementType = props.component ?? defaultElement;

  const rootProps: RootProps = {
    ...other,
    className: clsx(className, classes.root),
    children,
    ref: forwardedRef,
  };

  return <Component {...rootProps} />;
}) as OverridableComponent<LinkTypeMap>;
