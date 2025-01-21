// /app/games/babylon/components/Matrix/colorSequence.ts
export const colorSequence = (() => {
  let seq:number[][] = [];
  const floor = 0;
  const keyColors:number[][] = [
    [1,1,1],
    [1,1,floor],
    [1,floor,floor],
    [1,floor,1],
    [floor,1,floor],
    [floor,1,1],
    [floor,floor,1],
    [1,floor,1]  
  ];

  for (let i in keyColors) { 
    const color = keyColors[i];
    const nextColor = keyColors[parseInt(i) + 1] || keyColors[0];
    const colorSequenceStep = [];
    for (let j = 0; j < 10; j++) {
      colorSequenceStep.push([
        color[0] + (nextColor[0] - color[0]) * j / 10,
        color[1] + (nextColor[1] - color[1]) * j / 10,
        color[2] + (nextColor[2] - color[2]) * j / 10
      ]);
    }
    seq.push(...colorSequenceStep);
  }

  seq = seq.slice().reverse();
  return seq;
})();