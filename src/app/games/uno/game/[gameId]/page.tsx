'use client';
import ContentArea from "@/app/components/ContentArea";
import ButtonWell from "@/app/components/buttons/ButtonWell";
import { useState, useEffect, useRef } from "react";
import { UnoDeck, PlayingCardUno, CardColor, deal, playableCards, buildDeck, shuffleDeck } from "../../cards";
import Box from "@/app/components/Box";
import { SiteHeader } from "@/app/page";
import "../../game.css";
import Action from "@/app/components/buttons/Action";
import Button from "@/app/components/buttons/Button";
import { CurrentCard, UnoCard } from "../../components/cards";

const gameDeck:UnoDeck = shuffleDeck(buildDeck());

const SLOW = 1500;
const NORMAL = 1000;
const FAST = 500;
const LIGHTNING = 250;

export type UnoPlayer = {
  cards: PlayingCardUno[];
  score: number;
  order: number;
  name: string;
  cpu: boolean;
  ready: boolean;
  isCurrentUser: boolean;
};

const startingHandSize = 7;

const demoPlayers:UnoPlayer[] = [
  {
    name: 'Daniel',
    isCurrentUser: true,
    order: 1,
    cpu: false,
    ready: false,
    score: 0,
    cards: []
  },
  {
    name: 'Mary',
    isCurrentUser: false,
    order: 2,
    cpu: true,
    ready: false,
    score: 0,
    cards: []
  },
  {
    name: 'Henri',
    isCurrentUser: false,
    order: 3,
    cpu: true,
    ready: false,
    score: 0,
    cards: []
  },
  {
    name: 'Pat',
    isCurrentUser: false,
    order: 4,
    cpu: true,
    ready: false,
    score: 0,
    cards: []
  }
];

type UnoLogEntry = {
  turnOrder: number;
  act: 'd' | 'p' | 's' | 'd2' | 'd4' | 'w' | 'v'; // draw, play, skip, draw 2, draw 4, wild, victory
  group?: CardColor;
  face?: string;
};

const UnoGame = () => {
  // Generic game state variables
  const [ready, setReady] = useState<number>(0);
  const [turnOrder, setTurnOrder] = useState<number>(1);
  const [started, setStarted] = useState<boolean>(false);

  // Uno-specific game state variables
  const [deck, setDeck] = useState<UnoDeck>(gameDeck); // deck also serves as the draw pile
  const [cpuSpeed, setCpuSpeed] = useState<number>(NORMAL);
  const [currentCard, setCurrentCard] = useState<PlayingCardUno | null>(null);
  const [discardPile, setDiscardPile] = useState<PlayingCardUno[]>([]);
  const [reverse, setReverse] = useState<boolean>(false);
  const [players, setPlayers] = useState<UnoPlayer[]>(demoPlayers);
  const [pointLimit, setPointLimit] = useState<number>(500);
  const [gameLog, setGameLog] = useState<UnoLogEntry[]>([]);
  const [winner, setWinner] = useState<UnoPlayer | null>(null);
  const [pickingColor, setPickingColor] = useState<UnoPlayer | null>(null);

  const pickColor = (player:UnoPlayer, color:CardColor) => {
    if (!player || !color || !currentCard) return;

    setCurrentCard({ ...currentCard, group: color as CardColor });
    const isDrawFour = currentCard.effect === "draw-four";
    setGameLog([...gameLog, { turnOrder: turnOrder, act: 'w', group: color }]);
    nextTurn(reverse, turnOrder, players, isDrawFour ? 2 : 1);
    setPickingColor(null);
  }

  const LogEntry = ({ entry }: { entry: UnoLogEntry }) => {
    const player = playerByTurnOrder(entry.turnOrder);

    if (!player) return null;

    let logMessage:string = '';

    switch (entry.act) {
      case 'd':
        logMessage = `${player.name} draws a card`;
        break;
      case 'p':
        logMessage = `${player.name} plays a ${entry.group} ${entry.face}`;
        break;
      case 's':
        logMessage = `${player.name} is skipped`;
        break;
      case 'd2':
        logMessage = `${player.name} draws two cards`;
        break;
      case 'd4':
        logMessage = `${player.name} draws four cards`;
        break;
      case 'w':
        logMessage = `${player.name} changes the color to ${entry.group}`;
        break;
      case 'v':
        logMessage = `${player.name} wins!`;
        break;
    }

    if (!logMessage.length) return null;

    return (
      <p>{logMessage}</p>
    );
  }

  const GameLog = () => {
    const gameLogEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (gameLogEndRef.current) {
        gameLogEndRef.current.scrollIntoView();
      }
    }, [gameLog]);

    return (
      <div className="game-log overflow-y-scroll absolute top-0 right-0 h-64">
        {gameLog.map((entry, idx) => <LogEntry key={idx} entry={entry} />)}
        <div ref={gameLogEndRef} />
      </div>
    );
  }

  const handleCardClick = (card:PlayingCardUno, player:UnoPlayer) => {
    if (!started || Boolean(winner)) return;

    const playables = playableCards(currentCard as PlayingCardUno, player);

    if (!playables.includes(card)) {
      return;
    }

    playCard(card, player);
  };

  const handleStartGame = () => {
      setStarted(true);
  };

  const playerByTurnOrder = (order:number):UnoPlayer => {
    return players.find(player => player.order === (order || 1)) as UnoPlayer;
  }

  const nextTurn = (newReverse: boolean, turnOrder: number, players: UnoPlayer[], turnFactor: number) => {
    console.log('Next Turn', newReverse, turnOrder, players, turnFactor);
    let newTurnOrder = turnOrder;

    if (newReverse) {
      newTurnOrder = (turnOrder === 1 ? players.length + 1 - turnFactor : turnOrder - turnFactor);
    } else {
      newTurnOrder = (turnOrder === players.length ? turnFactor : turnOrder + turnFactor);
    }
    
    if (newTurnOrder > players.length) {
      newTurnOrder = newTurnOrder - players.length;
    } else if (newTurnOrder < 1) {
      newTurnOrder = players.length + newTurnOrder;
    }

    console.log('New Turn Order', newTurnOrder);
    setTurnOrder(newTurnOrder);
  }  

  const playCard = (card:PlayingCardUno, player:UnoPlayer) => {
    if (!card) return;

    const win = player.cards.length === 1;

    let newPlayers = players.map(p => {
      if (p.name === player.name) {
        return {
          ...p,
          cards: p.cards.filter(c => c.id !== card.id)
        };
      }

      return p;
    });

    setPlayers(newPlayers);
    setCurrentCard(card);
    setDiscardPile([card, ...discardPile]);

    const newReverse = card.effect === "reverse" ? !reverse : reverse;

    if (newReverse !== reverse) {
      setReverse(newReverse);
    }

    const turnFactor = (card.effect === "skip" || card.effect?.includes("draw")) ? 2 : 1;

    let newGameLog = gameLog;

    newGameLog = [...gameLog, { turnOrder, act: 'p', group: card.group as CardColor, face: card.face }];

    if (['skip', 'draw-two', 'draw-four'].includes(card.effect as string)) {
      let targetOrder = reverse ? turnOrder - 1 : turnOrder + 1;
      if (targetOrder === 0) {
        targetOrder = players.length;
      } else if (targetOrder > players.length) {
        targetOrder = 1;
      }

      switch (card.effect) {
        case 'skip':
          newGameLog = [...newGameLog, { turnOrder: targetOrder, act: 's' }];
          break;
        case 'draw-two':
          newGameLog = [...newGameLog, { turnOrder: targetOrder, act: 'd2' }];
          // draw(deck, playerByTurnOrder(targetOrder), 2, newPlayers);
          const { players: afterDrawTwoPlayers } = draw(deck, playerByTurnOrder(targetOrder), 2, newPlayers);
          setPlayers(afterDrawTwoPlayers);
          break;
        case 'draw-four':
          newGameLog = [...newGameLog, { turnOrder: targetOrder, act: 'd4' }];
          const { players: afterDrawFourPlayers } = draw(deck, playerByTurnOrder(targetOrder), 4, newPlayers);
          setPlayers(afterDrawFourPlayers);
          break;
      }
    }

    if (win) {
      newGameLog = [...newGameLog, { turnOrder, act: 'v' }];
    }

    setGameLog(newGameLog);

    if (card.group !== "Wild") {
      nextTurn(newReverse, turnOrder, players, turnFactor);
    } else {
      setPickingColor(player);
    }

    if (win) {
      setWinner(player);
    }

  }

  const draw = (deck:UnoDeck, player:UnoPlayer, numCards:number = 1, players:UnoPlayer[]) => {
    const newDeck = { ...deck };
    let newPile = [...discardPile];
    let newPlayers = players;

    for (let i = 0; i < numCards; i++) {
      const drawnCard = newDeck.cards.shift();

      if (newDeck.cards.length === 0) {
        newDeck.cards = shuffleDeck({ name: "discard", cards: discardPile.slice(1) }).cards;
        newDeck.cards.unshift(discardPile[0]);
        newPile = [discardPile[0]];
      }

      newPlayers = players.map(p => {
        if (p.name === player.name) {
          return {
            ...p,
            cards: [...p.cards, drawnCard as PlayingCardUno]
          };
        }

        return p;
      });
    }

    setDeck(newDeck);
    setDiscardPile(newPile);

    return { deck: newDeck, players: newPlayers };
  }

  const passTurn = () => {
    const current = playerByTurnOrder(turnOrder);

    // Draw 1 card
    const { players: newPlayers } = draw(deck, current, 1, players);
    
    nextTurn(reverse, turnOrder, newPlayers, 1);
    setPlayers(newPlayers);
    setGameLog([...gameLog, { turnOrder, act: 'd' }]);
  };

  const cpuTurn = (player:UnoPlayer) => {
    // Fetch playable cards
    const playables = playableCards(currentCard as PlayingCardUno, player);

    if (playables.length === 0) {
      passTurn();
      return;
    }

    let colorCounts: { [key in CardColor]: number } = {
      Blue: 0,
      Green: 0,
      Red: 0,
      Yellow: 0,
      Wild: 0
    };

    player.cards.forEach(card => {
      colorCounts[card.group as CardColor]++;
    });

    if (playables.length === 1) {
      // If there is only one playable card, play it
      playCard(playables[0], player);
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

        playCard(chosenCard, player);
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

        playCard(chosenCard, player);
      }
    }
  }

  useEffect(() => {
    if (!started || winner) return;
    
    if (!pickingColor?.cpu) return;

    const colors = ["Red", "Green", "Blue", "Yellow"];
    const colorCounts = colors.map(color => {
      return pickingColor.cards.filter(card => card.group === color).length;
    });

    // If the player still has a Wild or Wild Draw 4...
    if (pickingColor.cards.find(card => card.group === "Wild")) {
      // Find your least common color
      const leastCommonColor = colors[colorCounts.indexOf(Math.min(...colorCounts))];

      pickColor(pickingColor, leastCommonColor as CardColor);
    } else {
      // If not, find the most common color
      const mostCommonColor = colors[colorCounts.indexOf(Math.max(...colorCounts))];
    
      pickColor(pickingColor, mostCommonColor as CardColor);
    }


  }, [pickingColor, pickColor]);

  useEffect(() => {
    if (!started) return;

    const { deck: newDeck, players: newPlayers } = deal(players, deck, startingHandSize);

    setPlayers(newPlayers);
    setDeck(newDeck);

    // Grab the top card from the deck and place it in the discard pile, and update deck state
    const topCard = newDeck.cards.shift();

    if (topCard) {
      setDiscardPile([topCard, ...discardPile]);
      setDeck({ ...newDeck });
      setCurrentCard(topCard);
    }

    // Randomize the turn order based on the number of players
    setTurnOrder(Math.floor(Math.random() * players.length));
  }, [started]);

  useEffect(() => {
    if (!started || Boolean(winner)) return;

    const currentPlayer = playerByTurnOrder(turnOrder);

    // If it's a CPU player, then let the CPU take its turn after a delay based on the CPU speed
    if (currentPlayer.cpu) {
      setTimeout(() => {
        cpuTurn(currentPlayer);
      }, cpuSpeed);
    }
  }, [started, turnOrder]);

  const WildDialog = () => {
    if (!pickingColor || !pickingColor.isCurrentUser) return null;

    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-gray-400 p-4 rounded-lg">
          <h3>Choose a color</h3>
          <div className="flex justify-center">
            <Button label="Red" onClick={() => pickColor(pickingColor, "Red")} className="bg-red text-white" />
            <Button label="Green" onClick={() => pickColor(pickingColor, "Green")} className="bg-green text-white" />
            <Button label="Blue" onClick={() => pickColor(pickingColor, "Blue")} className="bg-blue text-white" />
            <Button label="Yellow" onClick={() => pickColor(pickingColor, "Yellow")} className="bg-yellow text-black" />
          </div>
        </div>
      </div>
    );
  }

  const UserHand = () => {
    const userPlayer = players.find(player => player.isCurrentUser);

    if (!userPlayer) return null;

    const yourTurn = playerByTurnOrder(turnOrder).isCurrentUser;

    const playables:PlayingCardUno[] = yourTurn ? playableCards(currentCard as PlayingCardUno, userPlayer) : [];
  
    return (
      <div className="clear-both block">
          {Boolean(started && !winner) && <h3>Your Hand</h3>}
          <div className="hand-wrapper">
            <div className="uno hand relative">
                {userPlayer.cards.map((card, idx) => (
                  (
                    <div key={card.id} style={{ position: "absolute", left: `${idx * 50}px` }} className={`${playables.includes(card) ? 'playable' : ''}`}>
                      <UnoCard card={card} playable={playables.includes(card)} player={userPlayer} onClick={handleCardClick} />
                    </div>
                  )
                  ))}
            </div>
          </div>
      </div>
    );
  }

  return (
    <main>
    <Box className="inner-container">
      <SiteHeader />

        <ContentArea>  
          <ButtonWell actions={[
            { label: "Start Game", onClick: handleStartGame, hidden: Boolean(started || winner) },
            ]} />

          <CurrentCard card={currentCard as PlayingCardUno} />
          {Boolean(started && !winner) && <p>Current Turn: {playerByTurnOrder(turnOrder).name}</p>}
          {Boolean(winner) && <p>{winner?.name} wins!</p>}

          <UserHand />
          <div className="relative">
            {started && <ButtonWell actions={[
              { label: "Pass", onClick: passTurn, hidden: !playerByTurnOrder(turnOrder).isCurrentUser || Boolean(!started || winner) }
            ]} />}
          </div>

          <GameLog />
          <WildDialog />
        </ContentArea>
    </Box>
  </main>
  );

};

export default UnoGame;