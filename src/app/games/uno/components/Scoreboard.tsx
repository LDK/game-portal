import { UnoPlayer } from "../types";

export type ScoreboardProps = {
  players:UnoPlayer[];
  turnOrder:number;
};

const Scoreboard = (props:ScoreboardProps) => {
  const { players } = props;

  return (
    <div className="scoreboard overflow-y-scroll absolute top-4 right-72 h-64">
      <h4 className="text-center">Scoreboard</h4>
        {players.map((player, idx) => {
            const { score } = player;

            if (!player || isNaN(score)) return null;

            const textClass:string = (() => { 
              let cName = 'my-0';
              if (player.isCurrentUser) { 
                cName += ' text-orange-600';
              }
              else if (player.cpu) {
                cName += ' text-gray-500';
              } else {
                cName += ' text-green-600';
              }
              return cName;
            })();

            const bgClass:string = (() => {
              let cName = 'grid grid-cols-2';

              if (player.order === props.turnOrder) {
                cName += ' bg-yellow-300';
              }

              return cName;
            }
          )();
            return (
              <div className={bgClass} key={idx}>
                <div>
                  <h6 className={textClass}>{player.name}{player.cpu && '*'}</h6>
                </div>
                <div>
                  <h6 className="my-0" style={{ textAlign: 'right' }}>{score}</h6>
                </div>
              </div>
            );
          
        } )}
    </div>
  );
}


export default Scoreboard;