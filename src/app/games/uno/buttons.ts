import { ButtonTypeProps } from "@/app/components/buttons/ButtonWell";
import { UnoPlayer } from "./types";

export type UnoButtonProps = {
  started?: boolean;
  winner?: UnoPlayer | null;
  userStarter?: boolean;
  userJoined?: boolean;
  playerCount?: number;
  handleStartGame?: () => void;
  handleJoinGame?: () => void;
  handleLeaveGame?: () => void;
  handleDeleteGame?: () => void;
  handleOpenGame?: () => void;
};

export const startButton = (props:UnoButtonProps, shortHand?:boolean):ButtonTypeProps => {
  console.log('startButton', props, props.playerCount);
  return { 
    label: shortHand ? "Start" : "Start Game", 
    onClick: props.handleStartGame, 
    hidden: Boolean(props.started || props.winner || !props.userStarter || !props.playerCount || props.playerCount < 2)
  }
};

export const joinButton = (props:UnoButtonProps, shortHand?:boolean):ButtonTypeProps => {
  return { 
    label: shortHand ? "Join" : "Join Game",
    onClick: props.handleJoinGame, 
    hidden: Boolean(props.started || props.winner || props.userJoined || props.userStarter) 
  }
};

export const leaveButton = (props:UnoButtonProps, shortHand?:boolean):ButtonTypeProps => {
  return { 
    label: shortHand ? "Leave" : "Leave Game",
    onClick: props.handleLeaveGame, 
    hidden: Boolean(props.started || props.winner || !props.userJoined) 
  }
};

export const deleteButton = (props:UnoButtonProps, shortHand?:boolean):ButtonTypeProps => {
  return { 
    label: shortHand ? "Delete" : "Delete Game",
    onClick: props.handleDeleteGame, 
    hidden: Boolean(props.started || !props.userStarter) 
  }
}

export const playButton = (props:UnoButtonProps, shortHand?:boolean):ButtonTypeProps => {
  return { 
    label: shortHand ? "Play" : "Play Game",
    onClick: props.handleOpenGame,
    hidden: Boolean(!props.started || props.winner) 
  }
}

export const viewButton = (props:UnoButtonProps, shortHand?:boolean):ButtonTypeProps => {
  return { 
    label: shortHand ? "View" : "View Game",
    onClick: props.handleOpenGame,
    hidden: Boolean(props.started && !props.winner) 
  }
}