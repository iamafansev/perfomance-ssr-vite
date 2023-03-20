import {
  ElementType,
  ReactNode,
  ForwardedRef,
  forwardRef,
  ComponentPropsWithRef,
} from 'react';
import { OverridableComponent, OverrideProps } from '@mui/types';
import clsx from 'clsx';

import classes from './Typography.module.css';

export type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'overline'
  | 'inherit';

export type TypographyTypeMap<P = object, D extends ElementType = 'span'> = {
  props: P & {
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    className?: string;
    children?: ReactNode;
    color?: 'primary' | 'textPrimary' | 'secondary' | 'textSecondary' | 'error';
    gutterBottom?: boolean;
    noWrap?: boolean;
    paragraph?: boolean;
    variant?: Variant;
  };
  defaultComponent: D;
};

type TypographyProps<
  D extends React.ElementType = TypographyTypeMap['defaultComponent'],
  P = object
> = OverrideProps<TypographyTypeMap<P, D>, D>;

const variantMapping: Record<Variant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
  button: 'span',
  inherit: 'span',
};

export const Typography = forwardRef(function Typography<
  ComponentType extends ElementType = TypographyTypeMap['defaultComponent']
>(
  props: TypographyProps<ComponentType>,
  forwardedRef: ForwardedRef<HTMLElement>
) {
  const {
    align,
    className,
    component,
    color,
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    variant = 'body1',
    ...other
  } = props;

  const Component =
    component || (paragraph ? 'p' : variantMapping[variant]) || 'span';

  const rootProps: ComponentPropsWithRef<'span'> = {
    ref: forwardedRef,
    className: clsx(className, classes.root, {
      [classes[`${align}Align`]]: align,
      [classes[`${color}Color`]]: color,
      [classes[`${variant}Variant`]]: variant,
      [classes.gutterBottom]: gutterBottom,
      [classes.noWrap]: noWrap,
      [classes.paragraph]: paragraph,
    }),
  };

  return <Component {...other} {...rootProps} />;
}) as OverridableComponent<TypographyTypeMap>;
