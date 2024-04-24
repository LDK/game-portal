'use client';
import ContentArea from "@/app/components/ContentArea";
import ButtonWell from "@/app/components/buttons/ButtonWell";
import { useState, useEffect } from "react";
import { UnoDeck, PlayingCardUno, CardColor, deal, playableCards, buildDeck, shuffleDeck } from "../../cards";
import Box from "@/app/components/Box";
import { SiteHeader } from "@/app/page";
import "../../game.css";

const gameDeck:UnoDeck = shuffleDeck(buildDeck());

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

const UnoGame = () => {
  const [score, setScore] = useState<number>(0);
  const [deck, setDeck] = useState<UnoDeck>(gameDeck); // deck also serves as the draw pile
  const [currentCard, setCurrentCard] = useState<PlayingCardUno | null>(null);
  const [discardPile, setDiscardPile] = useState<PlayingCardUno[]>([]);
  const [reverse, setReverse] = useState<boolean>(false);
  const [turnOrder, setTurnOrder] = useState<number>(0);
  const [players, setPlayers] = useState<UnoPlayer[]>(demoPlayers);
  const [ready, setReady] = useState<UnoPlayer[]>([]);
  const [pointLimit, setPointLimit] = useState<number>(500);
  const [started, setStarted] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState<CardColor | null>(null);

  const handleCardClick = () => {
      setScore(score + 1);  // Example interaction
  };

  const handleStartGame = () => {
      setStarted(true);
  };

  useEffect(() => {
    console.log("Uno deck", deck);
  }, []);

  useEffect(() => {
    if (!started) return;

    const { deck: newDeck, players: newPlayers } = deal(players, deck, startingHandSize);

    setPlayers(newPlayers);
    setDeck(newDeck);

    console.log("Uno players", players);
    // Grab the top card from the deck and place it in the discard pile, and update deck state
    const topCard = newDeck.cards.shift();

    if (topCard) {
      console.log('new deck', newDeck);
      setDiscardPile([topCard, ...discardPile]);
      setDeck({ ...newDeck });
      setCurrentCard(topCard);
    }

    // Randomize the turn order based on the number of players
    setTurnOrder(Math.floor(Math.random() * players.length));
  }, [started]);

  useEffect(() => {
    if (!currentCard) return;

    setActiveGroup(currentCard.group);
    console.log("Current card", currentCard);
    console.log("Players", players);
  }, [currentCard]);

  useEffect(() => {
    console.log(`${deck.cards.length} cards left in the deck`);
  }, [deck]);

  const UnoCard = (card:PlayingCardUno) => {
    const color = card.group === "Wild" ? "black" : card.group.toLowerCase();
    const cardType = card.name.toLowerCase().replace(" ", "-");

    return (
        <div 
          className={`playing-card uno align-middle text-center card-group-${card.group.toLowerCase()} ${card.effect || ''} bg-${color}`}
          onClick={handleCardClick}
        >
          <div className="inner">
            <h3>{card.name.replace(card.group + ' ', '')}</h3>
          </div>
        </div>
    );
  }

  const CurrentCard = () => {
    if (!currentCard) return null;

    return (
      <div className="current-card">
        <h3>Current Card</h3>
        {UnoCard(currentCard)}
      </div>
    );
  }

  const UserHand = () => {
    const userPlayer = players.find(player => player.isCurrentUser);

    if (!userPlayer) return null;

    const yourTurn = players[turnOrder].isCurrentUser;

    const playables:PlayingCardUno[] = yourTurn ? playableCards(currentCard as PlayingCardUno, userPlayer) : [];
  
    return (
      <div className="clear-both block">
          {started && <h3>Your Hand</h3>}
          <div className="hand-wrapper">
            <div className="uno hand relative">
                {userPlayer.cards.map((card, idx) => (
                  (
                    <div style={{ position: "absolute", left: `${idx * 50}px` }} className={`${playables.includes(card) ? 'playable' : ''}`}>
                      <UnoCard key={card.id} {...card} />
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
            { label: "Start Game", onClick: handleStartGame, hidden: started },
            ]} />

          <CurrentCard />
          {started && <p>Current Turn: {players[turnOrder].name}</p>}

          <UserHand />
        </ContentArea>
    </Box>
  </main>
  );

};

export default UnoGame;