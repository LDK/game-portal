export type ChaserSequenceList = {
  [name: string]: string[];
};

export type ChaserPlaylist = {
  count?: number;
  name: string;
}[];

export const columnCubes = (x:number, size:number) => {
  const cubes = [];
  for (let y = 1; y <= size; y++) {
    for (let z = 1; z <= size; z++) {
      cubes.push(`matrix-${x}-${y}-${z}`);
    }
  }
  return cubes;
};

export const rowCubes = (y:number, size:number) => {
  const cubes = [];
  for (let x = 1; x <= size; x++) {
    for (let z = 1; z <= size; z++) {
      cubes.push(`matrix-${x}-${y}-${z}`);
    }
  }
  return cubes;
};

export const layerCubes = (z:number, size:number) => {
  const cubes = [];
  for (let x = 1; x <= size; x++) {
    for (let y = 1; y <= size; y++) {
      cubes.push(`matrix-${x}-${y}-${z}`);
    }
  }
  return cubes;
}

export const defaultPlaylist = [
  { name: 'southFaceRun', count: 1 },
  // { name: 'southFaceBackwards', count: 1 },
  // { name: 'eastFaceRun', count: 1 },
  { name: 'eastFaceBackwards', count: 1 },
  { name: 'northFaceRun', count: 1 },
  // { name: 'northFaceBackwards', count: 1 },
  // { name: 'westFaceRun', count: 1 },
  { name: 'westFaceBackwards', count: 1 },
];

const southFaceCubes = (size:number):string[] => {
  const z = 2;

  const cubes = [];

  for (let y = size - 1; y >= 2; y--) {
    for (let x = 2; x <= size - 1; x++) {
      cubes.push(`matrix-${x}-${y}-${z}`);
    }
  }

  return cubes;
}

const eastFaceCubes = (size:number) => {
  const x = size - 1;

  const cubes = [];

  for (let y = size - 1; y >= 2; y--) {
    for (let z = 2; z <= size - 1; z++) {
      cubes.push(`matrix-${x}-${y}-${z}`);
    }
  }
  
  return cubes;
}

const northFaceCubes = (size:number) => {
  const z = size - 1;

  const cubes = [];

  for (let y = size - 1; y >= 2; y--) {
    for (let x = size - 1; x >= 2; x--) {
      cubes.push(`matrix-${x}-${y}-${z}`);
    }
  }

  return cubes;
}

const westFaceCubes = (size:number) => {
  const x = 2;

  const cubes = [];

  for (let y = size - 1; y >= 2; y--) {
    for (let z = size - 1; z >= 2; z--) {
      cubes.push(`matrix-${x}-${y}-${z}`);
    }
  }


  return cubes;
}

const faceRunBackwards = (faceCubes:(size:number) => string[], size:number) => {
  return faceCubes(size).slice(0, Math.floor(faceCubes(size).length / 4)).reverse().concat(
    faceCubes(size).slice(Math.floor(faceCubes(size).length / 4), Math.floor(faceCubes(size).length / 2)).reverse(),
    faceCubes(size).slice(Math.floor(faceCubes(size).length / 2), Math.floor(faceCubes(size).length * 3 / 4)).reverse(),
    faceCubes(size).slice(Math.floor(faceCubes(size).length * 3 / 4), faceCubes(size).length).reverse()
  );
}

export const getSequenceList = (size:number):ChaserSequenceList => {
  const southFaceBackwards = faceRunBackwards(southFaceCubes, size);
  const eastFaceBackwards = faceRunBackwards(eastFaceCubes, size);
  const westFaceBackwards = faceRunBackwards(westFaceCubes, size);
  const northFaceBackwards = faceRunBackwards(northFaceCubes, size);
  
  const sl:ChaserSequenceList = {};
  sl['faceRun'] = southFaceCubes(size).concat(eastFaceCubes(size), northFaceCubes(size), westFaceCubes(size));
  sl['southFaceRun'] = southFaceCubes(size);
  sl['eastFaceRun'] = eastFaceCubes(size);
  sl['westFaceRun'] = westFaceCubes(size);
  sl['northFaceRun'] = northFaceCubes(size);
  sl['faceRunBackwards'] = southFaceBackwards.concat(eastFaceBackwards, northFaceBackwards, westFaceBackwards);
  sl['southFaceBackwards'] = southFaceBackwards;
  sl['eastFaceBackwards'] = eastFaceBackwards;
  sl['westFaceBackwards'] = westFaceBackwards;
  sl['northFaceBackwards'] = northFaceBackwards;

  return sl;
};

// const finalSteps = southFaceBackwards;
// const finalSteps = layerSteps(2, size);

export const getSteps = (size:number) => {
  const steps:string[] = [];

  for (let x = 2; x < size; x++) {
    for (let y = 2; y < size; y++) {
      for (let z = 2; z < size; z++) {
        steps.push(`matrix-${x}-${y}-${z}`);
      }
    }
  }
  return steps;
}
