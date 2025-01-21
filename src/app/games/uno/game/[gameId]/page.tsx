'use client';
import ContentArea from "@/app/components/ContentArea";
import ButtonWell from "@/app/components/buttons/ButtonWell";
import { useState, useEffect } from "react";
import { playableCards, buildDeck, shuffleDeck, cardFromCode } from "@/app/games/uno/cards";
import Box from "@/app/components/Box";
import "@/app/games/uno/game.css";
import Button from "@/app/components/buttons/Button";
import { CurrentCard, UserHand, playerByTurnOrder } from "@/app/games/uno/components/cards";
import { cpuTurn, pickColor } from "@/app/games/uno/gameplay";
import GameLog from "@/app/games/uno/components/GameLog";
import { UnoDeck, UnoPlayer, PlayingCardUno, UnoGameState, CardColor, UnoLogEntry } from "@/app/games/uno/types";
import PlayersDisplay from "@/app/games/uno/components/Players";
import { usePathname, useRouter } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import { AxiosResponse } from "axios";
import useApi from "@/app/hooks/useApi";
import useUser from "@/app/hooks/useUser";
import { PortalUser } from "@/app/redux/user";
import { startButton, joinButton, deleteButton, leaveButton } from "@/app/games/uno/buttons";
import Scoreboard from "../../components/Scoreboard";
// import { cpuPlayer } from "../../gameplay";

const gameDeck:UnoDeck = shuffleDeck(buildDeck());

const SLOW = 1500;
const NORMAL = 1000;
const FAST = 500;
const LIGHTNING = 250;

const startingHandSize = 7;
const cpuPlayerCount = 3;

const UnoGame = () => {
  // Generic game state variables
  const [turnOrder, setTurnOrder] = useState<number>(1);
  const [started, setStarted] = useState<boolean>(false);
  const [effectText, setEffectText] = useState<string | null>(null);
  const [maxPlayers, setMaxPlayers] = useState<number>(4);

  const pathName = usePathname();
  const gameId = pathName.split('/').pop();

  const router = useRouter();

  const { user } = useUser();

  if (!gameId || isNaN(parseInt(gameId))) {
    router.push('/uno');
  }

    // Uno-specific game state variables
  const [deck, setDeck] = useState<UnoDeck>(gameDeck);
  const [cpuSpeed, setCpuSpeed] = useState<number>(NORMAL);
  const [currentCard, setCurrentCard] = useState<PlayingCardUno | null>(null);
  const [discardPile, setDiscardPile] = useState<PlayingCardUno[]>([]);
  const [reverse, setReverse] = useState<boolean>(false);
  const [players, setPlayers] = useState<UnoPlayer[]>([]);
  const [pointLimit, setPointLimit] = useState<number>(500);
  const [gameLog, setGameLog] = useState<UnoLogEntry[]>([]);
  const [winner, setWinner] = useState<UnoPlayer | null>(null);
  const [roundWinner, setRoundWinner] = useState<UnoPlayer | null>(null);
  const [pickingColor, setPickingColor] = useState<UnoPlayer | null>(null);
  const [wildColor, setWildColor] = useState<CardColor | undefined>(undefined);

  const [userStarter, setUserStarter] = useState<boolean>(false);
  const [userJoined, setUserJoined] = useState<boolean>(false);

  const { apiGet, apiPost } = useApi();

  const updateGameState = (state:UnoGameState) => {
    // if (!state.turnOrder) {
    //   console.log('TURN ORDER 0', state);
    // }
    console.log('state', state);
    setPlayers(state.players);
    setDeck(state.deck);
    setDiscardPile(state.discardPile);
    setGameLog(state.gameLog || []);
    setTurnOrder(state.turnOrder);
    setReverse(state.reverse);
    setCurrentCard(state.currentCard);
    setPickingColor(state.pickingColor);
    setEffectText(state.effectText);
    setWinner(state.winner);
    setRoundWinner(state.roundWinner);
    setStarted(Boolean(state.started));
    setWildColor(state.wildColor);

    // console.log('state', state);
  };

  const fetchGame = async () => {
    apiGet({
      uri: `http://localhost:8000/uno/game/${gameId}`,
      onSuccess: (response) => {
        // console.log('response', response);
        let newPlayers = prepPlayers(response, setUserStarter, user, setUserJoined);
        console.log('roundWinner', response.data.roundWinner);
        let newState = { ...response.data, gameLog: response.data.game_log, turnOrder: response.data.turn_order, started: Boolean(response.data.date_started), players: newPlayers, roundWinner: response.data.roundWinner || null, currentCard: response.data.current ? cardFromCode(response.data.current) : null };

        if (response.data.maxPlayers) {
          setMaxPlayers(response.data.maxPlayers);
        }

        if (['wd4','w'].includes(response.data.current)) {
          newState.pickingColor = playerByTurnOrder(response.data.turn_order, newPlayers);
        }
        // console.log('newPlayers', newPlayers);
        updateGameState(newState);
      },
      onError: (error) => {
        console.error('error', error);
      }
    });
  };

  useEffect(() => {
    fetchGame();
    const gameCheck = setInterval(() => {
      fetchGame();
    }, 5000);

    return () => {
      clearInterval(gameCheck);
    } 
  }, []);


  const handleCardClick = (card:PlayingCardUno, player:UnoPlayer) => {
    if (!started || Boolean(winner)) return;

    const playables = playableCards(currentCard as PlayingCardUno, player, wildColor);

    if (!playables.includes(card)) {
      return;
    }

    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/move`,
      payload: { action: 'play', card: card },
      onSuccess: (response) => {
        const newPlayers = prepPlayers(response, setUserStarter, user, setUserJoined);
        let newState = { ...response.data, gameLog: response.data.game_log, turnOrder: response.data.turn_order, started: Boolean(response.data.date_started), players: newPlayers, currentCard: response.data.current ? cardFromCode(response.data.current) : null };
        newState.pickingColor = card.group === 'Wild' ? playerByTurnOrder(response.data.turn_order, newPlayers) : null;
        console.log('newState', newState);
        updateGameState(newState);
      },
      onError: (error) => {
        console.error('error', error);
      }
    });
  };

  const processGameState = (response: AxiosResponse<any,any>) => {
    const newPlayers = prepPlayers(response, setUserStarter, user, setUserJoined);
    const newState = { ...response.data, gameLog: response.data.game_log, turnOrder: response.data.turn_order, started: Boolean(response.data.date_started), players: response.data.players, currentCard: response.data.current ? cardFromCode(response.data.current) : null };

    if (['wd4','w'].includes(response.data.current)) {
      newState.pickingColor = playerByTurnOrder(response.data.turn_order, newPlayers);
    }

    updateGameState(newState);
  };

  const processGameStateError = (error: any) => {
    console.error('error', error);
  }

  const handleStartGame = () => {
    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/start`,
      payload: { },
      onSuccess: processGameState,
      onError: processGameStateError
    });
  };

  const handleJoinGame = () => {
    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/join`,
      payload: { },
      onSuccess: (response) => {
        processGameState(response);
        setUserJoined(true);
      },
      onError: processGameStateError
    });
  };

  const handleLeaveGame = () => {
    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/leave`,
      payload: { },
      onSuccess: processGameState,
      onError: processGameStateError
    });
  };

  const handleDeleteGame = () => {
    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/delete`,
      payload: { },
      onSuccess: (response) => {
        router.push('/uno');
      },
      onError: (error) => {
        console.error('error', error);
      }
    });
  };

  const WildDialog = () => {
    if (roundWinner || !pickingColor || !pickingColor.isCurrentUser || !started || wildColor || Boolean(winner)) return null;

    const ColorButton = ({ color }: { color: CardColor }) => (
      <Button label={color} className={`bg-${color.toLowerCase()} text-white`} onClick={
        () => { 
          apiPost({
            uri: `http://localhost:8000/uno/game/${gameId}/move`,
            payload: { action: 'color', color: color },
            onSuccess: processGameState,
            onError: processGameStateError
          });
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

  const RoundDialog = () => {
    if (!roundWinner) return null;

    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-gray-400 p-4 rounded-lg">
          <h3>{roundWinner.user_id === user?.id ? 'You win' : `${roundWinner.name} wins`} the round!</h3>
          <Button label="Continue" hidden={!userStarter} onClick={() => 
            apiPost({
              uri: `http://localhost:8000/uno/game/${gameId}/move`,
              payload: { action: 'next-round' },
              onSuccess: processGameState,
              onError: processGameStateError
            })
          } />

          { !userStarter && <p>Waiting for the game starter to start next round...</p> }
        </div>
      </div>
    );
  }

  const pass = () => {
    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/move`,
      payload: { action: 'pass' },
      onSuccess: processGameState,
      onError: processGameStateError
    });
  };

  const EffectTextDisplay = () => {
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
  
    if (!effectText) return null;

    return (
      <div className="effect-text">{effectText}</div>
    );
  };
  
  const prepPlayers = (response: AxiosResponse<any,any>, setUserStarter: Function, user: (PortalUser | null), setUserJoined: Function) => {
    let newPlayers = response.data.players;
    setUserStarter(response.data.starter?.user_id === user?.id);

    for (let i = 0; i < newPlayers.length; i++) {
      if (newPlayers[i].user_id && user && newPlayers[i].user_id === user.id) {
        newPlayers[i].isCurrentUser = true;
        setUserJoined(true);
  
        if (newPlayers[i].cards) {
          newPlayers[i].cards = newPlayers[i].cards.map((card: string) => cardFromCode(card));
        }
      } else if (!isNaN(newPlayers[i].card_count)) {
        newPlayers[i].cards = Array.from({ length: newPlayers[i].card_count }, (_, j) => ({ group: "Red", face: "-1" }));
      }
    }
    return newPlayers;
  }
  
  // console.log('players', players);

  const startBtn = startButton({ started, handleStartGame, winner, userStarter, playerCount: players.length });
  const joinBtn = joinButton({ userJoined, handleJoinGame, started, winner, userStarter });
  const deleteBtn = deleteButton({ userStarter, handleDeleteGame, started });
  const leaveBtn = leaveButton({ userJoined, handleLeaveGame, winner, started });

  const gameFull = players.length >= maxPlayers || started;

  return (
    <main>
      <Box className="inner-container">
        <SiteHeader />

        <ContentArea>
          <a href="/games/uno"><h2>Uno</h2></a>
          <h4 className="text-shadow-xs">Game #{gameId}</h4>
          <EffectTextDisplay />
          
          { started && <CurrentCard card={currentCard as PlayingCardUno} wildColor={wildColor} /> }
          { <PlayersDisplay numRectangles={players.length} {...{ players, turnOrder, reverse, started }} /> }
          {Boolean(winner) && <p>{winner?.name} wins!</p>}

          <UserHand {...{ players, started, handleCardClick, wildColor, turnOrder }} currentCard={currentCard as PlayingCardUno} winner={Boolean(winner)} />

          <div className="relative">
            {started && <ButtonWell className="bottom-right" actions={[
              { label: "Pass", onClick: pass, hidden: !playerByTurnOrder(turnOrder, players).isCurrentUser || Boolean(!started || winner) }
            ]} />}
          </div>

            {/* public/circle-arrow.png */}
          
          <GameLog {...{ gameLog, players, deck, discardPile, turnOrder, currentCard, reverse, winner, pickingColor, effectText }} />
          <Scoreboard {...{ players, turnOrder }} />

          <ButtonWell className="bottom-right" 
            confirm = { userStarter ? startBtn : (!userJoined ? joinBtn : undefined) }
            cancel = { userStarter ? deleteBtn : (userJoined ? leaveBtn : undefined) }
          />

          <ButtonWell className="bottom-left" actions={[
            { label: "Invite Player", hidden: gameFull || !userStarter, onClick: () => {
              console.log('Invite Player');
              apiPost({
                'uri': `http://localhost:8000/uno/game/${gameId}/invite`,
                'payload': {},
                'onSuccess': (response) => {
                  console.log('response', response);
                },
                'onError': (error) => {
                  console.error('error', error);
                }});
            } },
            { label: "Add CPU Player", hidden: gameFull || !userStarter, onClick: () => {
              console.log('Add CPU Player');
              apiPost({
                'uri': `http://localhost:8000/uno/game/${gameId}/add-cpu`,
                'payload': {},
                'onSuccess': processGameState,
                'onError': processGameStateError
              });
            }},
          ]} />

          <WildDialog />
          <RoundDialog />
        </ContentArea>
      </Box>
    </main>
  );

};

export default UnoGame;