type Nullable<T> = T extends null | undefined ? T : never;

export const isNullable = <T>(value: T): value is Nullable<T> => {
  return value == null;
};

export const isNotNullable = <T>(value: T): value is NonNullable<T> => {
  return value != null;
};
