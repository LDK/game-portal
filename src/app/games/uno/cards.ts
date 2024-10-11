import { UnoDeck, unoColors, CardFace, UnoPlayer, PlayingCardUno, CardColor } from "./types";

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
      short: 'W',
      effect: "wild"
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

export const cardFromCode = (code:string):PlayingCardUno => {
  // code will be formatted like 'b3', 'wd4', 'yd', 'w' or 'rs'
  const groups:{[key:string]:CardColor} = {
    r: "Red",
    g: "Green",
    b: "Blue",
    y: "Yellow",
    w: "Wild"
  };

  const values:{[key:string]:number} = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    s: 20,
    r: 20,
    d: 20,
    d4: 50,
    w: 50
  };

  const faceNames:{[key:string]:CardFace} = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    r: "Reverse",
    s: "Skip",
    d4: "Draw Four",
    d: "Draw Two",
    w: "Wild",
  }

  // let [group, face] = code.split('');

  const group = code[0];
  const face = code.slice(1) || 'w';
  
  const card:PlayingCardUno = {
    id: 0,
    name:  code === 'w' ? 'Wild' : `${groups[group]}${face ? ` ${faceNames[face]}` : ''}`,
    value: face ? values[face] : 50,
    group: groups[group],
    short: face ? face.toUpperCase() : 'W',
    face: faceNames[face] || 'Wild'
  };

  return card;

}

export const playableCards = (currentCard:PlayingCardUno, player:UnoPlayer, wildColor?:CardColor):PlayingCardUno[] => {
  // console.log('currentCard', currentCard);
  // console.log('player', player);
  const matchingCards = player.cards.filter(card => 
    card.face === currentCard.face 
    && card.face !== "Draw Four"
    || (card.group === currentCard.group && card.group !== "Wild")
    || card.name === "Wild"
    || card.group === wildColor);
  const drawFours = player.cards.filter(card => card.name.includes("Draw Four"));

  console.log('currentCard', currentCard);
  // console.log('all cards', player.cards);
  console.log('matchingCards', matchingCards);
  console.log('drawFours', drawFours);
  console.log('wildColor', wildColor);

  if (matchingCards.length === 0) {
    return drawFours; // This will either be empty or contain only Draw Four Wild cards
  }

  return matchingCards;
}