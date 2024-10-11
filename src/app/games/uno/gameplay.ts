import { shuffleDeck, playableCards } from "./cards";
import { playerByTurnOrder } from "./components/cards";
import { PickColorProps, UnoGameState, UnoPlayer, effectProps, CardColor, PlayCardProps, DrawProps, PlayingCardUno, UnoLogEntry } from "./types";

export const pickColor = (props:PickColorProps):UnoGameState => {
  let { color, ...gameState } = props;
  if (!gameState.pickingColor || !color || !gameState.currentCard) return gameState;

  let currentCard = { ...gameState.currentCard, group: color };

  const isDrawFour = currentCard.effect === "draw-four";
  const gameLog = [...gameState.gameLog, { turnOrder: gameState.turnOrder, act: 'w', group: color } as UnoLogEntry];
  const turnOrder = nextTurn(gameState.reverse, gameState.turnOrder, gameState.players, isDrawFour ? 2 : 1);

  return { ...gameState, currentCard, gameLog, turnOrder, pickingColor: null, effectText: null };
};

export const cpuPlayer = (order:number):UnoPlayer => {
  const namePool = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi',
    'Ivan', 'Judy', 'Kevin', 'Linda', 'Mallory', 'Nancy', 'Oscar', 'Peggy',
    'Quentin', 'Randy', 'Steve', 'Trent', 'Ursula', 'Victor', 'Wendy', 'Xander',
    'Yvonne', 'Zelda'
  ];

  return {
    name: namePool[Math.floor(Math.random() * namePool.length)],
    isCurrentUser: false,
    order,
    cpu: true,
    ready: false,
    score: 0,
    cards: []
  };
};

export const nextTurn = (newReverse: boolean, turnOrder: number, players: UnoPlayer[], turnFactor: number):number => {
  let newTurnOrder = turnOrder;

  if (newReverse) {
    newTurnOrder = (turnOrder === 1 ? players.length + 1 - turnFactor : turnOrder - turnFactor);
  } else {
    newTurnOrder = (turnOrder === players.length ? turnFactor : turnOrder + turnFactor);
  }
  
  if (newTurnOrder === 0) {
    console.log('turn order of 0 generated in nextTurn');
  }

  if (newTurnOrder > players.length) {
    newTurnOrder = newTurnOrder - players.length;
  } else if (newTurnOrder < 1) {
    newTurnOrder = players.length + newTurnOrder;
  }

  return newTurnOrder;
}  

export const doEffect = (props:effectProps):UnoGameState => {

  const { firstCard, player, ...gameState } = props;

  // console.log('first card?', firstCard, gameState.currentCard);

  if (!gameState.currentCard) {
    return gameState as UnoGameState;
  }

  let { currentCard: card, players, deck, discardPile, gameLog, turnOrder, reverse } = gameState;

  // console.log('doEffect players', players);

  let newReverse = reverse;

  let effectText:(string | null) = null;

  if (card.effect === "reverse") {  
    newReverse = !reverse;
  }

  if (firstCard) {
    gameLog = [...gameLog, { turnOrder, act: 'to', group: card.group as CardColor, face: card.face }];
  }

  if (!card.effect) return { 
    gameLog,
    players,
    reverse: newReverse,
    pickingColor: null,
    effectText,
    turnOrder,
    discardPile,
    currentCard: card,
    winner: null,
    deck
  };
  // If the card is a Reverse, or the target is the user player, then set the effect text
  if (card.effect === "reverse") {
    effectText = "REVERSE";
  }

  if (['skip', 'draw-two', 'draw-four'].includes(card.effect as string)) {
    let targetOrder = newReverse ? turnOrder - 1 : turnOrder + 1;

    if (firstCard) {
      targetOrder = 1;
    }

    if (targetOrder === 0) {
      targetOrder = players.length;
    } else if (targetOrder > players.length) {
      targetOrder = 1;
    }

    if (playerByTurnOrder(targetOrder, players).isCurrentUser) {
      effectText = card.effect.replace('-', ' ').toUpperCase();
    }

    switch (card.effect) {
      case 'skip':
        gameLog = [...gameLog, { turnOrder: targetOrder, act: 's' }];

        if (firstCard) {
          nextTurn(newReverse, targetOrder, players, 1);
        }

        break;
      case 'draw-two':
        gameLog = [...gameLog, { turnOrder: targetOrder, act: 'd2' }];
        const { players: afterDrawTwoPlayers } = draw({ player: playerByTurnOrder(targetOrder, players), deck, gameLog, players, reverse, pickingColor: null, winner: null, turnOrder, discardPile, currentCard: card, effectText, numCards: 2 });
        players = afterDrawTwoPlayers;
        break;
      case 'draw-four':
        gameLog = [...gameLog, { turnOrder: targetOrder, act: 'd4' }];
        const { players: afterDrawFourPlayers } = draw({ player: playerByTurnOrder(targetOrder, players), deck, gameLog, players, reverse, pickingColor: null, winner: null, turnOrder, discardPile, currentCard: card, effectText, numCards: 4 });
        players = afterDrawFourPlayers;
        break;
    }
  }

  let pickingColor:(UnoPlayer | null) = null;

  if (card.effect === "wild") {
    pickingColor = playerByTurnOrder(turnOrder, players);
  }

  return { gameLog, players, reverse: newReverse, pickingColor, effectText, turnOrder, discardPile, currentCard: card, winner: null, deck };
}

export const playCard = (props:PlayCardProps):UnoGameState => {
  let { card, player, ...gameState } = props;
  let { pickingColor, winner, players, deck, discardPile, gameLog, turnOrder, reverse } = gameState;

  const win = player.cards.length === 1;

  players = players.map(p => {
    if (p.name === player.name) {
      return {
        ...p,
        cards: p.cards.filter(c => c.id !== card.id)
      };
    }

    return p;
  });

  gameLog = [...gameLog, { turnOrder, act: 'p', group: card.group as CardColor, face: card.face }];

  const effectResult = doEffect({ player, firstCard: false, ...{ gameLog, players, deck, discardPile, turnOrder, reverse, currentCard: card, winner: (win ? player : null), pickingColor: null, effectText: null } });

  reverse = effectResult.reverse || reverse;
  players = effectResult.players || players;
  gameLog = effectResult.gameLog || gameLog;

  if (win) {
    gameLog = [...gameLog, { turnOrder, act: 'v' } as UnoLogEntry];
    pickingColor = null;
  }

  const turnFactor = (card.effect === "skip" || card.effect?.includes("draw")) ? 2 : 1;

  if (card.group !== "Wild") {
    turnOrder = nextTurn(reverse, turnOrder, players, turnFactor);
    if (turnOrder === 0) {
      // console.log('turn order of 0 generated in playCard');
    }
  } else {
    pickingColor = player;
  }

  if (win) {
    winner = player;
  }

  return { gameLog, players, reverse, pickingColor, winner, turnOrder, discardPile: [...discardPile, card], currentCard: card, deck, effectText: effectResult.effectText };

}

export const draw = (props:DrawProps):UnoGameState => {
  let { player, numCards, ...gameState } = props;
  let { deck, players, discardPile, gameLog, turnOrder, reverse, pickingColor, winner, currentCard } = gameState;

  for (let i = 0; i < numCards; i++) {
    const drawnCard = deck.cards.shift();

    if (deck.cards.length === 0) {
      deck.cards = shuffleDeck({ name: "discard", cards: discardPile.slice(1) }).cards;
      deck.cards.unshift(discardPile[0]);
      discardPile = [discardPile[0]];
    }

    players = players.map(p => {
      if (p.name === player.name) {
        return {
          ...p,
          cards: [...p.cards, drawnCard as PlayingCardUno]
        };
      }

      return p;
    });
  }

  return { deck, players, discardPile, gameLog, turnOrder, reverse, pickingColor, winner, currentCard, effectText: null };
}

export const passTurn = (gameState:UnoGameState):UnoGameState => {
  let { turnOrder, players, gameLog, reverse } = gameState;
  const player = playerByTurnOrder(turnOrder, players);

  // Draw 1 card
  const drawResult = draw({...gameState, player, numCards: 1});
  players = drawResult.players;
  gameLog = drawResult.gameLog;
  
  turnOrder = nextTurn(reverse, turnOrder, players, 1);
  if (turnOrder === 0) {
    console.log('turn order of 0 generated in passTurn');
  }
  return { ...gameState, players, turnOrder, pickingColor: null, effectText: null, gameLog: [...gameLog, { turnOrder, act: 'd' }] };
};

export const cpuTurn = (gameState:UnoGameState):UnoGameState => {
  let { turnOrder, players, currentCard } = gameState;
  const player = playerByTurnOrder(turnOrder, players);



  // Fetch playable cards
  const playables = playableCards(currentCard as PlayingCardUno, player, gameState.wildColor);

  if (playables.length === 0) {
    return passTurn(gameState);
  }

  let colorCounts: { [key in CardColor]: number } = {
    Blue: 0,
    Green: 0,
    Red: 0,
    Yellow: 0,
    Wild: 0
  };

  player.score;

  player.cards.forEach(card => {
    colorCounts[card.group as CardColor]++;
  });

  if (playables.length === 1) {
    // If there is only one playable card, play it
    gameState = playCard({ card: playables[0], player, ...gameState });
  }
  else if (playables.length > 1) { 
    if (colorCounts.Wild > 0) {
      // If player has a Wild, and other playable options, then choose the non-Wild playable card of the highest value from the smallest-count color group
      let highestValue = 0;
      let chosenCard = playables[0];

      const smallestPlayableGroup = Object.keys(colorCounts).reduce((a, b) => colorCounts[a as CardColor] < colorCounts[b as CardColor] ? a : b) as CardColor;

      // Pick the highest value card from the smallest group
      playables.forEach(card => {
        if (card.value && card.value > highestValue && card.group === smallestPlayableGroup) {
          highestValue = card.value;
          chosenCard = card;
        }
      });

      gameState = playCard({ card: chosenCard, player, ...gameState });
    } else {
      // If there are multiple playable cards, choose the one with the highest value from the highest count color group
      let highestValue = 0;
      let chosenCard = playables[0];

      const largestPlayableGroup = Object.keys(colorCounts).reduce((a, b) => colorCounts[a as CardColor] > colorCounts[b as CardColor] ? a : b) as CardColor;

      // Pick the highest value card from the largest group
      playables.forEach(card => {
        if (card.value && card.value >= highestValue && card.group === largestPlayableGroup) {
          highestValue = card.value;
          chosenCard = card;
        }
      });

      gameState = playCard({ card: chosenCard, player, ...gameState }); 
    }
  }
  return gameState;
}