export type PaddingOptions = {
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  px?: number;
  py?: number;
  p?: number;
};

export type MarginOptions = {
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  mx?: number;
  my?: number;
  m?: number;
};

export type PositionOptions = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  position?: "absolute" | "relative" | "fixed";
};

export type ButtonProps = {
  className?: string;
  onClick?: () => void;
  label?: string;
} & MarginOptions & PositionOptions;