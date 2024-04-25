import { PlayingCardUno } from "../cards";
import { UnoPlayer } from "../game/[gameId]/page";

export const UnoCard = ({ card, playable, player, onClick }:{card: PlayingCardUno, playable: boolean, player?: UnoPlayer, onClick?: (card: PlayingCardUno, player: UnoPlayer) => void}) => {
  const color = card.group === "Wild" ? "black" : card.group.toLowerCase();

  return (
      <div 
        className={`playing-card uno align-middle text-center card-group-${card.group.toLowerCase()} ${card.effect || ''} bg-${color}`}
        onClick={(playable && onClick && player) ? () => { onClick(card, player) } : undefined}
      >
        <div className="inner">
          <h3>{card.name.replace(card.group + ' ', '')}</h3>
        </div>
      </div>
  );
}

export const CurrentCard = ({ card }:{card: PlayingCardUno}) => {
  if (!card) return null;

  return (
    <div className="current-card">
      <h3>Current Card</h3>
      <UnoCard card={card} playable={false} />
    </div>
  );
}

