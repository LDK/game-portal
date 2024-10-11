'use client';
import ContentArea from "@/app/components/ContentArea";
import { useState } from "react";
import { buildDeck, shuffleDeck } from "@/app/games/uno/cards";
import Box from "@/app/components/Box";
import "@/app/games/uno/game.css";
import { cpuPlayer } from "@/app/games/uno/gameplay";
import { UnoDeck, UnoPlayer } from "@/app/games/uno/types";
import SiteHeader from "@/app/components/SiteHeader";
import useApi from "@/app/hooks/useApi";
import useUser from "@/app/hooks/useUser";
import ButtonWell from "@/app/components/buttons/ButtonWell";
import { useRouter } from 'next/navigation';
// import { cpuPlayer } from "../../gameplay";

const gameDeck:UnoDeck = shuffleDeck(buildDeck());

const SLOW = 1500;
const NORMAL = 1000;
const FAST = 500;
const LIGHTNING = 250;

const UnoGame = () => {
  const { user } = useUser();
  const router = useRouter();

  // Uno-specific game state variables
  const [cpuSpeed, setCpuSpeed] = useState<number>(NORMAL);
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [pointLimit, setPointLimit] = useState<number>(500);
  const [inviteMode, setInviteMode] = useState<'public' | 'invite'>('public');

  const { apiGet, apiPost } = useApi();
  const csrfToken = getToken('csrftoken');

  function getToken(name:string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  
  return (
    <main>
      <Box className="inner-container">
        <SiteHeader />

        <ContentArea>
        <a href="/games/uno"><h2>Uno</h2></a>

        <h3>New Game</h3>

        <form className="form flex-col" method="post" onSubmit={async (e) => { e.preventDefault(); }}>
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken || ""} />

          <Box className="mb-4">
            <label htmlFor="pointLimit">Point Limit</label>
            <input type="number" id="pointLimit" min={50} max={500} step={50} name="pointLimit" value={pointLimit} style={{ color: "black" }}
              onChange={(e) => setPointLimit(parseInt(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </Box>

          <Box className="mb-4">
            <label htmlFor="maxPlayers">Max Players</label>
            <input type="number" id="maxPlayers" min={2} max={8} step={1} name="maxPlayers" value={maxPlayers} style={{ color: "black" }}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </Box>

          <Box className="mb-4">
            <label htmlFor="cpuSpeed">CPU Speed</label>
            <select id="cpuSpeed" name="cpuSpeed" value={cpuSpeed} style={{ color: "black" }}
              onChange={(e) => setCpuSpeed(parseInt(e.target.value))}
            >
              <option value={SLOW}>Slow</option>
              <option value={NORMAL}>Normal</option>
              <option value={FAST}>Fast</option>
              <option value={LIGHTNING}>Lightning</option>
            </select>
          </Box>

          <Box className="mb-4">
            <label htmlFor="inviteMode">Invite Mode</label>
            <select id="inviteMode" name="inviteMode" value={inviteMode} style={{ color: "black" }}
              onChange={(e) => setInviteMode(e.target.value as 'public' | 'invite')}
            >
              <option value="public">Public</option>
              <option value="invite">Invite Only</option>
            </select>
          </Box>

          <ButtonWell actions={[
            { label: "Create Game", onClick: () => { 
              console.log('creating game');
              apiPost({
                uri: 'http://localhost:8000/uno/game/new',
                payload: { pointLimit, maxPlayers, cpuSpeed, inviteMode },
                onSuccess: (res) => {
                  router.push(`/uno/game/${res.data.id || ''}`);
                },
                onError: (error) => {
                  console.error('error creating game', error);
                }
              });
            } }
          ]} />

        </form>
        </ContentArea>
      </Box>
    </main>
  );

};

export default UnoGame;