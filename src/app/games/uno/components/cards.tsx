import { playableCards } from "../cards";
import { CardColor, PlayingCardUno, UnoPlayer } from "../types";

export const UnoCard = ({ card, playable, player, onClick }:{card: PlayingCardUno, playable: boolean, player?: UnoPlayer, onClick?: (card: PlayingCardUno, player: UnoPlayer) => void}) => {
  const color = card.group === "Wild" ? "black" : card.group.toLowerCase();

  return (
      <div 
        className={`playing-card uno align-middle text-center card-group-${card.group.toLowerCase()} ${card.effect || ''} bg-${color}`}
        onClick={(playable && onClick && player) ? () => { onClick(card, player) } : undefined}
      >
        <div className="top-left">
          <span>{card.short || card.face}</span>
        </div>

        <div className="bottom-right">
          <span>{card.short || card.face}</span>
        </div>

        <div className="inner">
          <h3>{card.name.replace(card.group + ' ', '')}</h3>
        </div>
      </div>
  );
}

export const CurrentCard = ({ card, wildColor }:{ card?: PlayingCardUno, wildColor?: CardColor }) => {
  if (!card) return null;

  const displayCard = wildColor ? { ...card, group: wildColor } : card;

  return (
    <div className="current-card">
      <h5 className="text-shadow-xs">Current Card</h5>
      <UnoCard card={displayCard} playable={false} />
    </div>
  );
}

export const playerByTurnOrder = (order:number, players:UnoPlayer[]) => {
  return players.find(player => player.order === (order || 1)) as UnoPlayer;
};

export const UserHand = ({players, currentCard, turnOrder, handleCardClick, started, winner, wildColor}:{players:UnoPlayer[], currentCard:PlayingCardUno, turnOrder:number, handleCardClick:(card:PlayingCardUno, player:UnoPlayer) => void, started:boolean, winner:boolean, wildColor?:CardColor}) => {
  if (!started) return null;
  
  const userPlayer = players.find(player => player.isCurrentUser);

  if (!userPlayer) return null;

  const yourTurn = winner ? false : playerByTurnOrder(turnOrder, players).isCurrentUser;

  const playables:PlayingCardUno[] = yourTurn ? playableCards(currentCard as PlayingCardUno, userPlayer, wildColor) : [];

  return (
    <div className="clear-both block mt-16 md:mt-8">
        {Boolean(started && !winner) && <h3>Your Hand</h3>}
        <div className="hand-wrapper mt-12 md:mt-0">
          <div className="uno hand relative">
              {userPlayer.cards.map((card, idx) => (
                (
                  <div key={idx} style={{ position: "absolute", left: `${idx * 50}px` }} className={`${playables.includes(card) ? 'playable' : ''}`}>
                    <UnoCard card={card} playable={playables.includes(card)} player={userPlayer} onClick={handleCardClick} />
                  </div>
                )
                ))}
          </div>
        </div>
    </div>
  );
};


