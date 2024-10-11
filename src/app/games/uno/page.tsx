// app/uno.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ButtonWell, { ButtonTypeProps } from '../../components/buttons/ButtonWell';
import ContentArea from '../../components/ContentArea';
import Box from '@/app/components/Box';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';
import useApi from '@/app/hooks/useApi';
import { UnoGameState, UnoPlayer } from './types';
import useUser from '@/app/hooks/useUser';
import { deleteButton, leaveButton, playButton, startButton, viewButton } from './buttons';

export default function Uno() {
  const router = useRouter();

  const { apiGet, apiPost } = useApi();
  const [ openGames, setOpenGames ] = useState<UnoGameState[]>([]);
  const [ userGames, setUserGames ] = useState<UnoGameState[]>([]);
  const [ recentGames, setRecentGames ] = useState<UnoGameState[]>([]);

  const { user } = useUser();

  const fetchGames = () => {
    apiGet({
      uri: 'http://localhost:8000/uno/games/open',
      onSuccess: (res) => {
        setOpenGames(res.data);
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });

    apiGet({
      uri: 'http://localhost:8000/uno/games/user',
      onSuccess: (res) => {
        setUserGames(res.data.map((game:any) => {
          game.players = game.players.map((player:UnoPlayer) => {
            player.isCurrentUser = player.user_id === user?.id;
            return player;
          });

          game.started = Boolean(game.date_started);

          return game;
        }));
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });

    apiGet({
      uri: 'http://localhost:8000/uno/games/recent',
      onSuccess: (res) => {
        setRecentGames(res.data);
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });
  };


  useEffect(() => {
    let gamesCheck:any;

    if (user) {
      fetchGames();

      gamesCheck = setInterval(() => {
        fetchGames();
      }, 10000);
    } else {
      setOpenGames([]);
      setUserGames([]);
      setRecentGames([]);
      clearInterval(gamesCheck);
    }
    return () => {
      clearInterval(gamesCheck);
    }
}, [user]);

  const startGame = (gameId:number) => {
    if (!gameId) {
      return;
    }

    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/start`,
      onSuccess: (res) => {
        router.push(`/uno/game/${res.data.id}`);
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });
  }

  const leaveGame = (gameId:number) => {
    if (!gameId) { 
      return;
    }

    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/leave`,
      onSuccess: (res) => {
        fetchGames();
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });
  }

  const joinGame = (gameId:number) => {
    if (!gameId) {
      return;
    }

    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/join`,
      onSuccess: (res) => {
        router.push(`/uno/game/${res.data.id}`);
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });
  }

  const deleteGame = (gameId:number) => {
    if (!gameId) {
      return;
    }

    apiPost({
      uri: `http://localhost:8000/uno/game/${gameId}/delete`,
      onSuccess: (res) => {
        fetchGames();
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });
  }

  const GameListings = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <div>
      <h3>Your Games</h3>
      { userGames.map((game, index) => { 
        
        const userStarter = game.starter?.user_id === user?.id;
        const viewProps = { started: game.started, winner: game.winner, handleOpenGame: () => { router.push(`/uno/game/${game.id}`) } };
        const deleteProps = { userStarter, started: game.started, handleDeleteGame: () => { deleteGame(game.id || 0) } };
        const leaveProps = { started: game.started, winner: game.winner, handleLeaveGame: () => { leaveGame(game.id || 0) } };
        const startProps = { userStarter, started: game.started, handleStartGame: () => { startGame(game.id || 0) } };

        const playBtn = playButton(viewProps);
        const viewBtn = viewButton(viewProps, userStarter);
        const deleteBtn = deleteButton(deleteProps, true);
        const leaveBtn = leaveButton(leaveProps);
        let actions:ButtonTypeProps[] = [];

        if (!game.started && Boolean(game.starter) && game.starter?.user_id === user?.id && game.players.length > 1) {
          actions.push(startButton(startProps));
          console.log('actions', actions);
        }


        return (
        <div className="game-link" key={index}>
          <h6 className="text-shadow-xs">Game #{game.id}</h6>
          <p>Players: {game.players.length} of {game.maxPlayers}</p>


          <ButtonWell key={index} actions={actions} cancel={userStarter ? deleteBtn : leaveBtn} confirm={(game.started && !game.winner) ? playBtn : viewBtn} />
        </div>
      ); } ) }
    </div>

    <div>
      <h3>Open Games</h3>

      { openGames.map((game, index) => (
        <div className="game-link" key={index}>
          <h6 className="text-shadow-xs">Game #{game.id}</h6>
          {game.starter?.name && <p>Started by: {game.starter.name}</p>}

          <p>Players: {game.players.length} of {game.maxPlayers}</p>
          <ButtonWell key={index} actions={[
            { label: "Join Game", onClick: () => { joinGame(game.id || 0) } }
          ]} />
        </div>
      )) }
    </div>

    <div>
      <h3>Recent Games</h3>

      { recentGames.map((game, index) => (
        <div className="game-link" key={index}>
          <h6 className="text-shadow-xs">Game #{game.id}</h6>
          {game.winner && <p>Winner: {game.winner.name}{ !game.winner.user_id && '*' }</p>}

          <ButtonWell key={index} actions={[
            { label: "View Game", onClick: () => { router.push(`/uno/game/${game.id}`) } }
          ]} />
        </div>
      )) }
    </div>
  </div>
  );

  return (
    <main>
      <Box className="inner-container">
        <SiteHeader />
          <ContentArea>
            <h2>Uno</h2>

            { user && <GameListings />}

            <ButtonWell className="bottom-12 left-4 absolute" actions={[
              { label: "New Game", hidden: !user, onClick: () => { router.push('/uno/game/new'); } }
            ]} />

          </ContentArea>
      </Box>
    </main>
  );
}
