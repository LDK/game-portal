'use client';
import ContentArea from "@/app/components/ContentArea";
import ButtonWell from "@/app/components/buttons/ButtonWell";
import { useState, useEffect, useRef } from "react";
import { deal, playableCards, buildDeck, shuffleDeck } from "@/app/games/uno/cards";
import Box from "@/app/components/Box";
import "@/app/games/uno/game.css";
import Button from "@/app/components/buttons/Button";
import { CurrentCard, UserHand, playerByTurnOrder } from "@/app/games/uno/components/cards";
import { playCard, doEffect, cpuTurn, passTurn, pickColor, cpuPlayer, nextTurn } from "@/app/games/uno/gameplay";
import GameLog from "@/app/games/uno/components/GameLog";
import { UnoDeck, UnoPlayer, PlayingCardUno, UnoGameState, CardColor, UnoLogEntry } from "@/app/games/uno/types";
import PlayersDisplay from "@/app/games/uno/components/Players";
import SiteHeader from "@/app/components/SiteHeader";

const gameDeck:UnoDeck = shuffleDeck(buildDeck());

const SLOW = 1500;
const NORMAL = 1000;
const FAST = 500;
const LIGHTNING = 250;

const startingHandSize = 7;
const cpuPlayerCount = 3;

// cpuPlayer takes order as an argument, starting at 2
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
  ...Array.from({ length: cpuPlayerCount }, (_, i) => cpuPlayer(i + 2))
];

const UnoGame = () => {
  // Generic game state variables
  const [turnOrder, setTurnOrder] = useState<number>(1);
  const [started, setStarted] = useState<boolean>(false);
  const [effectText, setEffectText] = useState<string | null>(null);

  // Uno-specific game state variables
  const [deck, setDeck] = useState<UnoDeck>(gameDeck);
  const [cpuSpeed, setCpuSpeed] = useState<number>(NORMAL);
  const [currentCard, setCurrentCard] = useState<PlayingCardUno | null>(null);
  const [discardPile, setDiscardPile] = useState<PlayingCardUno[]>([]);
  const [reverse, setReverse] = useState<boolean>(false);
  const [players, setPlayers] = useState<UnoPlayer[]>(demoPlayers);
  const [pointLimit, setPointLimit] = useState<number>(500);
  const [gameLog, setGameLog] = useState<UnoLogEntry[]>([]);
  const [winner, setWinner] = useState<UnoPlayer | null>(null);
  const [pickingColor, setPickingColor] = useState<UnoPlayer | null>(null);

  const updateGameState = (state:UnoGameState) => {
    console.log('updating game state', state);
    if (!state.turnOrder) {
      console.log('TURN ORDER 0');
    }
    setPlayers(state.players);
    setDeck(state.deck);
    setDiscardPile(state.discardPile);
    setGameLog(state.gameLog);
    setTurnOrder(state.turnOrder);
    setReverse(state.reverse);
    setCurrentCard(state.currentCard);
    setPickingColor(state.pickingColor);
    setEffectText(state.effectText);
    setWinner(state.winner);
  };

  const handleCardClick = (card:PlayingCardUno, player:UnoPlayer) => {
    if (!started || Boolean(winner)) return;

    const playables = playableCards(currentCard as PlayingCardUno, player);

    if (!playables.includes(card)) {
      return;
    }

    console.log('updating game state from handleCardClick');
    updateGameState(playCard({ card, player, currentCard, players, turnOrder, reverse, deck, discardPile, gameLog, pickingColor, effectText, winner }));
  };

  const handleStartGame = () => {
      setStarted(true);
  };

  

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

      updateGameState(pickColor({ color: leastCommonColor as CardColor, pickingColor, reverse, turnOrder, players, deck, discardPile, gameLog, winner, currentCard, effectText }));
    } else {
      // If not, find the most common color
      const mostCommonColor = colors[colorCounts.indexOf(Math.max(...colorCounts))];
    
      updateGameState(pickColor({ color: mostCommonColor as CardColor, pickingColor, reverse, turnOrder, players, deck, discardPile, gameLog, winner, currentCard, effectText }));
    }


  }, [pickingColor, pickColor]);

  useEffect(() => {
    if (!started) return;

    const { deck: newDeck, players: newPlayers } = deal(players, deck, startingHandSize);

    setPlayers(newPlayers);
    setDeck(newDeck);

    // Grab the top card from the deck and place it in the discard pile, and update deck state
    let topCard = newDeck.cards.shift();

    // If the top card is a Wild Draw Four, then shuffle the deck until it's not
    while (topCard?.effect === "draw-four") {
      newDeck.cards.push(topCard);
      newDeck.cards = shuffleDeck(newDeck).cards;
      topCard = newDeck.cards.shift();
    }

    // Randomize the turn order based on the number of players
    setTurnOrder(Math.floor(Math.random() * players.length));

    if (topCard) {
      updateGameState(doEffect({ currentCard: topCard, players: newPlayers, turnOrder, reverse, deck: newDeck, discardPile, gameLog, winner: null, pickingColor: null, effectText: null, firstCard: true, player: null }));
      if (['draw-four', 'draw-two', 'skip'].includes(topCard.effect || '')) {
        setTurnOrder(nextTurn(reverse, turnOrder, players, 1));
      }
    }

  }, [started]);

  useEffect(() => {
    if (!started || Boolean(winner)) return;

    const currentPlayer = playerByTurnOrder(turnOrder, players);

    // If it's a CPU player, then let the CPU take its turn after a delay based on the CPU speed
    if (currentPlayer.cpu) {
      setTimeout(() => {
        updateGameState(cpuTurn({ players, turnOrder, deck, discardPile, currentCard, reverse, gameLog, pickingColor, winner, effectText }));
      }, cpuSpeed);
    }
  }, [started, turnOrder]);

  const WildDialog = () => {
    if (!pickingColor || !pickingColor.isCurrentUser || !started) return null;

    const ColorButton = ({ color }: { color: CardColor }) => (
      <Button label={color} className={`bg-${color.toLowerCase()} text-white`} onClick={
        () => { 
          console.log('updating game state from WildDialog');
          updateGameState(pickColor({ color, pickingColor, reverse, turnOrder, players, deck, discardPile, gameLog, winner, currentCard, effectText }))
        }
      } />
    );

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-gray-400 p-4 rounded-lg">
            <h3>Choose a color</h3>
            <div className="flex justify-center">
              <ColorButton color="Red" />
              <ColorButton color="Green" />
              <ColorButton color="Blue" />
              <ColorButton color="Yellow" />
            </div>
          </div>
        </div>
    );
  }

  const pass = () => {
    console.log('updating game state from pass');
    updateGameState(passTurn({ players, turnOrder, deck, discardPile, currentCard, reverse, gameLog, pickingColor, winner, effectText }));
  };

  const EffectTextDisplay = () => {
    if (!effectText) return null;

    // Function to trigger the effect
    const triggerEffect = () => {
      // Set timeout to hide text after animations have completed
      setTimeout(() => {
        setEffectText(null);
      }, 400); // Total 400ms for the full animation sequence (300ms scale + 100ms fade)
    };
  
    useEffect(() => {
      // Example trigger for demonstration: triggers on component mount
      triggerEffect();
    }, []);
  
    return (
      <div className="effect-text">{effectText}</div>
    );
  };
  
  return (
    <main>
      <Box className="inner-container">
        <SiteHeader />

        <ContentArea>
          <EffectTextDisplay />
          
          <ButtonWell actions={[
            { label: "Start Game", onClick: handleStartGame, hidden: Boolean(started || winner) },
            ]} />

          <CurrentCard card={currentCard as PlayingCardUno} />
          { started && <PlayersDisplay numRectangles={players.length} {...{ players, turnOrder, reverse }} /> }
          {Boolean(winner) && <p>{winner?.name} wins!</p>}

          <UserHand players={players} currentCard={currentCard as PlayingCardUno} turnOrder={turnOrder} winner={Boolean(winner)} started={started} handleCardClick={handleCardClick} />
          <div className="relative">
            {started && <ButtonWell actions={[
              { label: "Pass", onClick: pass, hidden: !playerByTurnOrder(turnOrder, players).isCurrentUser || Boolean(!started || winner) }
            ]} />}
          </div>

            {/* public/circle-arrow.png */}
          
          <GameLog {...{ gameLog, players, deck, discardPile, turnOrder, currentCard, reverse, winner, pickingColor, effectText }} />
          <WildDialog />
        </ContentArea>
      </Box>
    </main>
  );

};

export default UnoGame;