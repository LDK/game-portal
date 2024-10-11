import { UnoPlayer } from "../types";
import { playerByTurnOrder } from "./cards";

const PlayersDisplay = ({ numRectangles, players, reverse, turnOrder, started }: { numRectangles: number; players: UnoPlayer[]; reverse: boolean; turnOrder: number, started:boolean }) => {
  const radius = players.length <= 6 ? 80 : 100; // radius of the circle
  const rectWidth = players.length <= 4 ? 100 : 70;
  const nameCutoff = players.length <= 6 ? 10 : 9;
  const rectHeight = 60;
  const angleStep = 360 / numRectangles;

  return (
    <div className="circle-container">
      <div className="circle relative" style={{ width: radius * 2, height: radius * 2 }}>
        <img src="/circle-arrow.png" className={`circle-arrow${reverse ? ' reverse' : ''}`} style={{ transform: `rotate(${reverse ? 180 : 0}deg)` }} />
        {Array.from({ length: numRectangles }).map((_, index) => {
          const angle = angleStep * index;
          const transform = `
            rotate(${angle}deg) 
            translate(${radius}px) 
            rotate(-${angle}deg)
          `;

          const player = playerByTurnOrder(index + 1, players);

          return (
            <div
              key={index}
              className="rectangle"
              style={{
                width: rectWidth,
                height: rectHeight,
                transform: transform,
                color: 'black',
                textAlign: 'center',
                backgroundColor: player?.order === turnOrder ? 'gold' : 'white',
              }}>
                {/* <span className="font-extrabold w-100 block">Christopher…</span> */}
                <span className="font-normal w-100 block">{player.name.length > nameCutoff ? player.name.slice(0, nameCutoff) + '…' : player.name}</span>
                <div className="mx-auto rounded-md w-6 h-8 bg-black inline-block text-white text-xs">
                  OH<br />
                  NO
                </div>
                
                <span>x{player.cards.length}</span>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayersDisplay;