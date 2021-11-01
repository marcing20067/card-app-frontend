export type FieldsState = {
  [inputId: string]: FieldState;
};

export type FieldState = {
    isFocus: boolean;
}