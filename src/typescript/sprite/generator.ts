// library
import * as Matter from "matter-js";
// conf / support
import {Configuration} from "../Configuration";
import {oAbsC, Rectangle} from "../support/Coordination";
import {randBool} from "../support/Random";
// game
import {ObstacleSeed, ScenerySeed} from "../Game";
// sprites
import {SpriteLabel} from "./SpriteLabel";
import {SceneryType} from "./scenery/Scenery";
import Star from "./scenery/star";
import {ObstacleProp, ObstacleType} from "./obstacle/Obstacle";
import UFO from "./obstacle/ufo";

const sceneryTotal = Configuration.scenery.spawnRules.map(spawn => spawn.ratio).reduce((p, c) => p + c);
const getSceneryType = () => {
  const targetN = Math.round(Math.random() * (sceneryTotal - 1));
  let prev = 0;
  for (let i = 0; i < Configuration.scenery.spawnRules.length; i++) {
    const {type, ratio} = Configuration.scenery.spawnRules[i];
    if (prev + ratio - 1 >= targetN) return type;
    prev += ratio;
  }
  return SceneryType.Star;
};
const obstacleTotal = Configuration.obstacle.spawnRules.map(spawn => spawn.ratio).reduce((p, c) => p + c);
const getObstacleType = () => {
  const targetN = Math.round(Math.random() * (obstacleTotal - 1));
  let prev = 0;
  for (let i = 0; i < Configuration.obstacle.spawnRules.length; i++) {
    const {type, ratio} = Configuration.obstacle.spawnRules[i];
    if (prev + ratio - 1 >= targetN) return type;
    prev += ratio;
  }
  return ObstacleType.Meteor;
};

export const generateRandomScenery = (oAbsC: oAbsC, rect: Rectangle, bodyRef: (b: Matter.Body) => void): ScenerySeed => {
  const xRange = 0.8;
  const id = Date.now();
  const type = getSceneryType();

  const baseSeed = {
    id,
    type,
    prop: {
      id,
      label: SpriteLabel.Scenery,
      angle: 0,
      bodyRef,
      // overwritten
      center: {x: 0, y: 0},
    },
    updateBody: Star.updateBody,
  };

  switch (type) {
    case SceneryType.Star:
      const starX = Math.random() * rect.size.width * xRange + rect.size.width * (1 - xRange) / 2;
      baseSeed.prop.center = oAbsC({x: starX, y: 0});
      break;
    case SceneryType.ShootingStar:
    default:
      const shootX = randBool() ? 0 : rect.size.width;
      baseSeed.prop.center = oAbsC({x: shootX, y: 0});
      break;
  }

  return baseSeed;
};

export const generateRandomObstacle = (oAbsC: oAbsC, rect: Rectangle, bodyRef: (b: Matter.Body) => void): ObstacleSeed => {
  const margin = 50;
  const {size} = rect;
  const id = Date.now();
  const isLeft = randBool();
  // calc from
  const fromRotateTarget = {x: isLeft ? -margin : size.width + margin, y: -margin};
  const fromRotateOrigin = {x: isLeft ? 0 : size.width, y: 0};
  const fromRotateAngle = (isLeft ? 1 : -1) * Math.random() * Math.PI / 2;
  const from = Matter.Vector.rotateAbout(oAbsC(fromRotateTarget), fromRotateAngle, oAbsC(fromRotateOrigin));
  // calc to
  const toRotateTarget = {x: isLeft ? size.width + margin : -margin, y: size.height + margin};
  const toRotateOrigin = {x: isLeft ? size.width : 0, y: size.height};
  const toRotateAngle = (isLeft ? -1 : 1) * Math.random() * Math.PI;
  const to = Matter.Vector.rotateAbout(oAbsC(toRotateTarget), toRotateAngle, oAbsC(toRotateOrigin));
  // velocity
  const subVector = Matter.Vector.sub(to, from);
  const velocity = Matter.Vector.mult(subVector, 0.003);

  const prop: ObstacleProp = {
    id,
    center: from,
    velocity,
    angle: -1,
    bodyRef,
    label: SpriteLabel.Obstacle
  };

  const type = getObstacleType();
  let updateBody;
  switch (type) {
    case ObstacleType.Meteor:
      break;
    case ObstacleType.Earth:
      break;
    case ObstacleType.Wrench:
      prop.angle = 0;
      break;
    case ObstacleType.UFO:
    default:
      updateBody = UFO.generateUpdateBody();
      break;
  }
  return {
    id,
    escape: false,
    type,
    prop,
    updateBody,
  };
};
