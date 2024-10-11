import { Deck, PlayingCard } from "../../types/types";
export type CardFace = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'Skip' | 'Reverse' | 'Draw Two' | 'Wild' | 'Draw Four';
export type CardColor = "Red" | "Green" | "Blue" | "Yellow" | "Wild";
export const unoColors:CardColor[] = ["Red", "Green", "Blue", "Yellow", "Wild"];
export type PlayingCardUno = Omit<PlayingCard, "group"> & { group: CardColor; face: CardFace };
export type UnoDeck = Omit<Deck, "cards"> & { cards: PlayingCardUno[] };

export type UnoPlayer = {
  cards: PlayingCardUno[];
  score: number;
  order: number;
  name: string;
  cpu: boolean;
  ready: boolean;
  isCurrentUser: boolean;
  user_id?: number;
};

export type UnoLogEntry = {
  turnOrder: number;
  action: 'to' | 'd' | 'p' | 's' | 'r' | 'd2' | 'd4' | 'w' | 'v' | 'nr' | 'rw' | 'j' | 'l' | 'g' | 'c'; // turn over, draw, play, skip, draw 2, draw 4, wild, victory, new round, round winner, join, leave, game start, cpu player added
  card?: PlayingCardUno;
  color?: CardColor;
};

export type UnoGameState = {
  id?: number;
  started?: boolean;
  maxPlayers?: number;
  starter?: UnoPlayer;
  quick?: boolean;
  players: UnoPlayer[];
  deck: UnoDeck;
  discardPile: PlayingCardUno[];
  gameLog: UnoLogEntry[];
  turnOrder: number;
  reverse: boolean;
  winner: UnoPlayer | null;
  roundWinner: UnoPlayer | null;
  currentCard: PlayingCardUno | null;
  pickingColor: UnoPlayer | null;
  effectText: string | null;
  wildColor?: CardColor;
};

export type PickColorProps = UnoGameState & { color:CardColor };

export type effectProps = UnoGameState & { player:UnoPlayer | null; firstCard:boolean };

export type PlayCardProps = UnoGameState & { card:PlayingCardUno, player:UnoPlayer };

export type DrawProps = UnoGameState & { player:UnoPlayer, numCards:number };

