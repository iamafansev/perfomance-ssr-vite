import {
  ComponentProps,
  ElementType,
  ForwardedRef,
  ReactNode,
  Ref,
  forwardRef,
} from 'react';
import { OverridableComponent, OverrideProps } from '@mui/types';
import clsx from 'clsx';

import { Typography } from 'client/shared/ui';

import classes from './Link.module.css';

type TypographyProps = ComponentProps<typeof Typography>;

type OwnProps = {
  href?: string;
  to?: string;
  underline?: boolean;
  className?: string;
  children?: ReactNode;
} & Pick<TypographyProps, 'variant'>;

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
  const {
    children,
    className,
    underline,
    variant = 'inherit',
    ...other
  } = props;

  const defaultElement = props.href || props.to ? 'a' : 'button';
  const Component: ElementType = props.component ?? defaultElement;

  const rootProps: RootProps = {
    ...other,
    className: clsx(
      className,
      classes.root,
      Component === 'button' && classes.asButtonBase
    ),
    children,
    ref: forwardedRef,
  };

  return <Typography component={Component} variant={variant} {...rootProps} />;
}) as OverridableComponent<LinkTypeMap>;
