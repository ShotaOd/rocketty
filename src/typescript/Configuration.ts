import {ObstacleType} from "./sprite/obstacle/Obstacle";
import {Dimensions} from "react-native";
import {SceneryType} from "./sprite/scenery/Scenery";

export const Configuration = {
  // game performance
  fps: 60,
  minFps: 30,
  // view mode
  scale: 1,
  areaPadding: 100,
  visibleGameStyle: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#273452',
  },
  layer: {
    game: {
      back: 0,
      main: 100,
    },
    noGame: {
      base: 1000,
    },
    all: 9999,
  },
  // for DEBUG
  mode: {
    collisionReset: true,
  },
  wall: {
    thick: 5,
    color: 'gray'
  },
  // game balance tuning
  rocket: {
    gravity: 0.0015,
    boost: {
      vector: {
        x: 4,
        y: 7,
      },
      angular: 0.02
    },
  },
  obstacle: {
    spawnRules: [
      {type: ObstacleType.Meteor, ratio: 6},
      {type: ObstacleType.Earth, ratio: 2},
      {type: ObstacleType.Wrench, ratio: 4},
      {type: ObstacleType.UFO, ratio: 1},
    ],
    spawnControl: {
      max: 10,
      minDuration: 1000,
    }
  },
  scenery: {
    spawnRules: [
      {type: SceneryType.Star, ratio: 10},
      {type: SceneryType.ShootingStar, ratio: 1},
    ],
    spawnControl: {
      max: 10,
      minDuration: () => Math.random() * (5000 - 3000) + 3000,
    },
  },
  // auto calculated
  gameRect: {
    origin: {
      x: 0,
      y: 0,
    },
    size: {
      width: 0,
      height: 0,
    },
  },
};

// calc game rect
(() => {
  const {
    width,
    height,
  } = Dimensions.get('window');
  const scaledW = width * Configuration.scale;
  const scaledH = height * Configuration.scale;
  const x = (width - scaledW) / 2;
  const y = (height - scaledH) / 2;
  Configuration.gameRect = {
    origin: {
      x,
      y,
    },
    size: {
      width: scaledW,
      height: scaledH,
    },
  };
})();