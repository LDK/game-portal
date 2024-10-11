import { useEffect, useRef } from "react";
import { playerByTurnOrder } from "./cards";
import { UnoLogEntry, UnoPlayer } from "../types";;

type LogEntryProps = {
  entry: UnoLogEntry;
  players: UnoPlayer[];
};

const LogEntry = (props:LogEntryProps) => {
  const { entry, players } = props;
  if (!entry) return null;

  const player = playerByTurnOrder(entry.turnOrder, players);

  if (!player) return null;

  let logMessage:string = '';
  let logClass:string = '';

  const group = entry.card?.group === "Wild" ? "" : `${entry.card?.group} `;

  switch (entry.action) {
    case 'c':
      logMessage = `${player.name}* added to the game.`;
      logClass += 'font-bold';
      break;
    case 'j':
      logMessage = `${player.name} joined the game!`
      logClass += 'text-blue-500 font-bold';
      break;
    case 'l':
      logMessage = `${player.name} left the game.`;
      logClass += 'text-red-500 font-bold';
      break;
    case 'g':
      logMessage = `${player.name} started the game.`;
      logClass += 'text-green-500 font-bold';
      break;
    case 'd':
      logMessage = `${player.name} draws a card`;
      break;
    case 'p':
      logMessage = `${player.name} plays a ${group}${entry.card?.face}`;
      break;
    case 's':
      logMessage = `${player.name} is skipped`;
      logClass += 'text-red-500';
      break;
    case 'd2':
      logMessage = `${player.name} draws two cards`;
      logClass += 'text-red-500 font-bold';
      break;
    case 'd4':
      logMessage = `${player.name} draws four cards`;
      logClass += 'text-red-500 font-bold';
      break;
    case 'w':
      logMessage = `${player.name} changes the color to ${entry.color}`;
      logClass += 'text-blue-500';
      break;
    case 'v':
      logMessage = `${player.name} wins the game!`;
      logClass += 'text-green-500 font-bold';
      break;
    case 'to':
      logMessage = `${player.name} turned over a ${group}${entry.card?.face}`;
      logClass += 'text-blue-500 font-bold';
      break;
    case 'nr':
      logMessage = 'Started a new round!';
      logClass += 'font-bold';
      break;
    case 'rw':
      logMessage = `${player.name} wins the round!`;
      logClass += 'text-green-500';
      break;
    case 'r':
      logMessage = `${player.name} reversed the order.`;
      logClass += 'text-blue-500';
      break;
  }

  if (!logMessage.length) return null;

  return (
    <p className={logClass}>{logMessage}</p>
  );
}

export type GameLogProps = {
  gameLog:UnoLogEntry[];
  players:UnoPlayer[];
};

const GameLog = (props:GameLogProps) => {
  const { gameLog, players } = props;
  const gameLogEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (gameLogEndRef.current) {
      // gameLogEndRef.current.scrollIntoView();
    }
  }, [gameLog]);

  return (
    <div className="game-log overflow-y-scroll absolute top-4 right-0 h-64">
      {gameLog.map((entry, idx) => <LogEntry key={idx} {...{ entry, players }} />)}
      <div ref={gameLogEndRef} />
    </div>
  );
}


export default GameLog;