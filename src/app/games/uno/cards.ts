import { Deck, PlayingCard } from "../../types/types";
import { UnoPlayer } from "./game/[gameId]/page";

export type CardFace = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'Skip' | 'Reverse' | 'Draw Two' | 'Wild' | 'Draw Four';
export type CardColor = "Red" | "Green" | "Blue" | "Yellow" | "Wild";
export const unoColors:CardColor[] = ["Red", "Green", "Blue", "Yellow", "Wild"];
export type PlayingCardUno = Omit<PlayingCard, "group"> & { group: CardColor; face: CardFace };
export type UnoDeck = Omit<Deck, "cards"> & { cards: PlayingCardUno[] };

export const buildDeck = ():UnoDeck => {
  let id:number = 1;

  const newDeck:UnoDeck = { name: "Uno", cards: [] };

  for (let i = 0; i < 4; i++) {
    const color = unoColors[i];
    
    // Add 0 card
    newDeck.cards.push({
      id: id,
      name: `${color} 0`,
      value: 0,
      group: color,
      face: "0"
    });

    id++;

    // Add 1-9 cards (2 of each)
    for (let j = 1; j < 10; j++) {
      const card = {
        id: id,
        name: `${color} ${j}`,
        value: j,
        group: color,
        face: j.toString() as CardFace
      };

      newDeck.cards.push(card);
      id++;
      newDeck.cards.push({ ...card, id: id });
      id++;
    }

    // 2 Skip, Reverse, Draw 2 cards, each worth 20 points
    const specialCards:CardFace[] = ["Skip", "Reverse", "Draw Two"];

    const shortNames:{[key:string]:string} = {
      "Skip": "S",
      "Reverse": "R",
      "Draw Two": "D2"
    };

    for (let j = 0; j < specialCards.length; j++) {
      const card = {
        id: id,
        name: `${color} ${specialCards[j]}`,
        value: 20,
        group: color,
        face: specialCards[j],
        short: shortNames[specialCards[j]],
        effect: specialCards[j].toLowerCase().replace(" ", "-")
      };

      newDeck.cards.push(card);
      id++;
      newDeck.cards.push({ ...card, id: id });
      id++;
    }

  }

  // 4 Wild cards (non-Draw-Four), each worth 50 points
  for (let i = 0; i < 4; i++) {
    newDeck.cards.push({
      id: id,
      name: "Wild",
      value: 50,
      group: "Wild",
      face: "Wild",
      short: 'W'
    });
    id++;
  }
  
  // 4 Draw Four Wild cards, each worth 50 points
  for (let i = 0; i < 4; i++) {
    newDeck.cards.push({
      id: id,
      name: "Draw Four",
      value: 50,
      group: "Wild",
      effect: "draw-four",
      face: "Draw Four",
      short: 'D4'
    });
    id++;
  }

  return newDeck;
};

export const shuffleDeck = (deck:UnoDeck):UnoDeck => {
  let shuffledDeck:UnoDeck = { name: deck.name, cards: [] };

  while (deck.cards.length > 0) {
    const randomIndex = Math.floor(Math.random() * deck.cards.length);
    shuffledDeck.cards.push(deck.cards.splice(randomIndex, 1)[0]);
  }

  return shuffledDeck;
}

type DealResult = {
  deck: UnoDeck;
  players: UnoPlayer[];
}

export const deal = (players:UnoPlayer[], deck:UnoDeck, numCards:number = 7):DealResult => {
  let newPlayers:UnoPlayer[] = players.map(player => {
    let newPlayer:UnoPlayer = { ...player, cards: [] };

    for (let i = 0; i < numCards; i++) {
      newPlayer.cards.push(deck.cards.shift() as PlayingCardUno);
    }

    return newPlayer;
  });

  return { deck, players: newPlayers };
};

export const playableCards = (currentCard:PlayingCardUno, player:UnoPlayer):PlayingCardUno[] => {
  const matchingCards = player.cards.filter(card => card.face === currentCard.face || card.group === currentCard.group || card.name === "Wild");
  const drawFours = player.cards.filter(card => card.name === "Wild - Draw Four");

  if (matchingCards.length === 0) {
    console.log("Playable cards", drawFours);
    return drawFours; // This will either be empty or contain only Draw Four Wild cards
  }

  console.log("Playable cards", matchingCards);

  return matchingCards;
}