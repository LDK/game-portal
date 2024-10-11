export type GameTitle = {
  url: string;
  title: string;
  releaseDate: string;
  category: string;
  description: string;
  coverArt?: string;
}

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
  hidden?: boolean;
  disabled?: boolean;
} & MarginOptions & PositionOptions;

export type PlayingCard = {
  id: number;
  name: string;
  value?: number;
  effect?: string;
  short?: string;
  group?: string; // "hearts", "diamonds", "clubs", "spades", "blue", "green", "red", "yellow", "wild", etc.
};

export type Deck = {
  name: string;
  cards: PlayingCard[];
};