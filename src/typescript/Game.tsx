// libraries
import * as React from 'react';
import {Component, ReactNode} from 'react';
import {Dimensions, Text, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import * as PropTypes from 'prop-types';
import * as Matter from 'matter-js';
import {IPair} from 'matter-js';
// supports
import {Configuration} from "./Configuration";
import {aVec, getOAbsC, oAbsC, rVecX, rVecY, Vector} from "./support/Coordination";
import {Side} from "./define/Side";
// uis
import CircleButton from "./support/CircleButton";
import WaitBoard from "./board";
// sprites
import RectangleBody from './sprite/RectangleBody';
import {ObstacleProp, ObstacleType} from "./sprite/obstacle/Obstacle";
import Rocket, {RocketProp} from './sprite/rocket';
// obstacles
import Wrench from "./sprite/obstacle/wrench";
import Earth from "./sprite/obstacle/earth";
import UFO from "./sprite/obstacle/ufo/index";
import {BlackHoleProp, default as BlackHole} from "./sprite/obstacle/blackhole";
// sceneries
import {SceneryProp, SceneryType} from "./sprite/scenery/Scenery";
import Star from "./sprite/scenery/star";
import {CollisionCategory} from "./support/Collision";
import ShootingStar from "./sprite/scenery/shootingStar";
import {randBool, randInt} from "./support/Random";
import Meteor from "./sprite/obstacle/meteor";
import {generateRandomObstacle, generateRandomScenery} from "./sprite/generator";
import {SpriteLabel} from "./sprite/SpriteLabel";

type Prop = {};

type ObstacleState = {
  id: number,
  type: ObstacleType,
  prop: ObstacleProp,
};

type SceneryState = {
  id: number,
  type: SceneryType,
  prop: SceneryProp,
}

export type ObstacleSeed = {
  id: number,
  escape: boolean,
  type: ObstacleType,
  prop: ObstacleProp,
  body?: Matter.Body,
  updateBody?: (b: Matter.Body) => void,
};

export type ScenerySeed = {
  id: number,
  type: SceneryType,
  prop: SceneryProp,
  body?: Matter.Body,
  updateBody?: (b: Matter.Body) => void,
};

enum Gravity {
  Newton = 'G_n',
  BlackHole = 'G_b',
}

type State = {
  additionalScore: number,
  rocket: {
    center: Vector,
    angle: number,
  },
  gravity: {
    type: Gravity,
    center: Vector,
  },
  obstacles: ObstacleState[],
  sceneries: SceneryState[],
  waitBoard: {
    show: boolean,
    score?: number,
  }
}

const getGameVisibleStyle = (): ViewStyle => {
  const {gameRect: {size, origin}} = Configuration;
  return Object.assign({
    position: 'absolute',
    left: origin.x,
    top: origin.y,
    width: size.width,
    height: size.height,
  }, Configuration.visibleGameStyle);
};

const getInitialRocket = (oAbsC: oAbsC) => {
  const rect = Configuration.gameRect;
  return {
    center: oAbsC({x: rect.size.width / 2, y: rect.size.height * 2 / 3}),
    angle: -1,
  };
};

const getInitialState = (oAbsC: oAbsC): State => {
  return {
    additionalScore: 0,
    rocket: getInitialRocket(oAbsC),
    gravity: {
      type: Gravity.Newton,
      center: Vector.zero,
    },
    obstacles: [],
    sceneries: [],
    waitBoard: {
      show: false,
    },
  }
};

function contains<T>(target: T, arr: T[]) {
  for (let i = 0; i < arr.length; i++) {
    if (target === arr[i]) return true;
  }
  return false;
}

const checkLabel = (labelA: string, labelB: string, target: string, ...other: string[]) => {
  if (labelA === target) {
    if (contains(labelB, other)) return {isA: true};
    else return;
  }
  if (labelB === target) {
    if (contains(labelA, other)) return {isA: false};
    else return;
  }
};

enum GameEvent {
  Ready = 'Ry',
  Play = 'Py',
  Over = 'Or',
  Result = 'Rt',
}

class GameState {
  private cb: {
    Ry: (() => void)[];
    Py: (() => void)[];
    Or: (() => void)[];
    Rt: (() => void)[];
  };
  private _event: GameEvent;

  constructor() {
    this.cb = {
      Ry: [],
      Py: [],
      Or: [],
      Rt: [],
    }
  }

  on(e: GameEvent, cb: () => void) {
    this.cb[e].push(cb);
  }

  off(e: GameEvent, cb: () => void) {
    this.cb[e] = this.cb[e].filter(c => c !== cb);
  }

  change(e: GameEvent) {
    this._event = e;
    this.cb[e].forEach(cb => cb());
  }

  get event(): GameEvent {
    return this._event;
  }
}

class Loop {
  private id?: number;
  private cbs: ((lastExec?: number) => void)[] = [];
  private lastExec?: number;

  constructor() {
    this.loop = this.loop.bind(this);
  }

  join(cb: (lastExec?: number) => void) {
    this.cbs.push(cb);
  }

  kill(cb: (lastExec?: number) => void) {
    this.cbs = this.cbs.filter(c => c !== cb);
  }

  start() {
    this.loop();
  }

  stop() {
    if (this.id) {
      window.cancelAnimationFrame(this.id);
      this.lastExec = undefined;
      this.id = undefined;
    }
  }

  private loop() {
    // !!Must request immediately!! (in order to cancel)
    this.id = window.requestAnimationFrame(this.loop);
    if (!this.lastExec || Date.now() - this.lastExec <= 1000 / Configuration.minFps) this.cbs.forEach(cb => cb(this.lastExec));
    this.lastExec = Date.now();
  }
}

export default class Game extends Component<Prop, State> {
  private startTm?: number;
  private gameState: GameState;
  private loop: Loop;
  private engine: Matter.Engine;
  private world: Matter.World;
  private rocket: Matter.Body;
  private obstacles: ObstacleSeed[] = [];
  private sceneries: ScenerySeed[] = [];
  private oAbsC: oAbsC;

  // noinspection JSUnusedGlobalSymbols
  static get contextTypes() {
    return {
      scale: PropTypes.number,
    };
  };

  context: {
    scale: number,
  };

  constructor(props: Prop) {
    super(props);
    // field
    this.world = Matter.World.create({
      gravity: {
        scale: 0,
        x: 0,
        y: 0,
      }
    });
    // noinspection JSDeprecatedSymbols
    this.engine = Matter.Engine.create({
      world: this.world,
    });
    this.gameState = new GameState();
    this.loop = new Loop();
    this.oAbsC = getOAbsC(Configuration.gameRect.origin);

    // bind this
    this.runEngine = this.runEngine.bind(this);
    this.handleLoop = this.handleLoop.bind(this);
    this.handleBeforeUpdate = this.handleBeforeUpdate.bind(this);
    this.handleAfterUpdate = this.handleAfterUpdate.bind(this);
    this.handleCollision = this.handleCollision.bind(this);
    this.getScore = this.getScore.bind(this);

    this.state = getInitialState(this.oAbsC);
  }

  componentDidMount(): void {
    this.loop.join(this.runEngine);
    this.loop.join(this.handleLoop);
    Matter.Events.on(this.engine, 'afterUpdate', this.handleAfterUpdate);
    Matter.Events.on(this.engine, 'beforeUpdate', this.handleBeforeUpdate);
    Matter.Events.on(this.engine, 'collisionStart', this.handleCollision);

    // Game Events
    this.gameState.on(GameEvent.Over, () => {
      const {waitBoard} = this.state;
      waitBoard.show = true;
      this.setState({waitBoard});
    });
    this.gameState.on(GameEvent.Ready, () => {
      this.loop.stop();
      // reset score
      this.startTm = Date.now();

      // clean view
      this.obstacles.forEach(obstacle => {
        if (obstacle.body) {
          Matter.World.remove(this.world, obstacle.body);
        }
      });
      this.obstacles = [];
      this.sceneries.forEach(scenery => {
        if (scenery.body) {
          Matter.World.remove(this.world, scenery.body);
        }
      });
      this.sceneries = [];

      // state
      const initialState = getInitialState(this.oAbsC);
      this.setState(initialState);

      // setup rocket
      this.rocket.force = {x: 0, y: 0};
      Matter.Body.setPosition(this.rocket, initialState.rocket.center);
      Matter.Body.setVelocity(this.rocket, {x: 0, y: 0});
      Matter.Body.setAngle(this.rocket, -1);
    });
    this.gameState.on(GameEvent.Play, () => {
      this.loop.start();
    });

    this.gameState.change(GameEvent.Ready);
  }

  componentWillUnmount(): void {
    this.loop.kill(this.runEngine);
    this.loop.kill(this.handleLoop);
    Matter.Events.off(this.engine, 'beforeUpdate', this.handleBeforeUpdate);
    Matter.Events.off(this.engine, 'afterUpdate', this.handleAfterUpdate);
    Matter.Events.off(this.engine, 'collisionStart', this.handleCollision);
  }

  private runEngine(lastExec?: number) {
    const current = Date.now();
    Matter.Engine.update(this.engine, 1000 / Configuration.fps, lastExec ? current / lastExec : 1);
  }

  private lastObstacleSpawn?: number;
  private lastSceneSpawn?: number;
  private lastBlackHoleSpawn?: number;

  private handleLoop() {
    // define current
    const current = Date.now();

    // check and switch gravity <-> black hole
    switch (this.state.gravity.type) {
      case Gravity.Newton:
        if (!this.lastBlackHoleSpawn || current - this.lastBlackHoleSpawn > 10000) {
          if (randInt(10) % 10 === 0) {
            const getCenter = (): Vector => {
              const {height, width} = Configuration.gameRect.size;
              return this.oAbsC({x: randBool() ? 80 : width - 80, y: height - 100});
            };
            this.setState({
              gravity: {
                type: Gravity.BlackHole,
                center: getCenter(),
              },
            });
            this.lastBlackHoleSpawn = current;
          }
        }
        break;
      case Gravity.BlackHole:
        if (this.lastBlackHoleSpawn && current - this.lastBlackHoleSpawn > 5000) {
          this.setState({
            gravity: {
              type: Gravity.Newton,
              center: Vector.zero,
            },
          });
        }
    }

    // check and spawn obstacle
    let shouldSpawnObstacle = true;
    const {length} = this.obstacles;
    const {max} = Configuration.obstacle.spawnControl;
    if (length > max) {
      shouldSpawnObstacle = false;
    }
    else if (0 < length && this.lastObstacleSpawn) {
      if (current - this.lastObstacleSpawn < Configuration.obstacle.spawnControl.minDuration) {
        shouldSpawnObstacle = false;
      }
    }
    if (shouldSpawnObstacle) {
      const obstacle = generateRandomObstacle(
        this.oAbsC,
        Configuration.gameRect,
        (b: Matter.Body) => {
          Matter.World.addBody(this.world, b);
          this.obstacles.forEach(obstacle => {
            if (obstacle.id === b.id) {
              obstacle.body = b;
              return false;
            }
          });
        },
      );
      this.obstacles.push(obstacle);
      this.lastObstacleSpawn = current;
    }

    // check and spawn scenery
    let shouldSpawnScenery = true;
    if (this.sceneries.length > Configuration.scenery.spawnControl.max) {
      shouldSpawnScenery = false;
    }
    else if (this.lastSceneSpawn) {
      if (current - this.lastSceneSpawn < Configuration.scenery.spawnControl.minDuration()) {
        shouldSpawnScenery = false;
      }
    }
    if (shouldSpawnScenery) {
      const scenerySeed = generateRandomScenery(
        this.oAbsC,
        Configuration.gameRect, (b: Matter.Body) => {
          Matter.World.addBody(this.world, b);
          this.sceneries.forEach(scenery => {
            if (scenery.id === b.id) {
              scenery.body = b;
            }
          });
        });
      this.sceneries.push(scenerySeed);
      this.lastSceneSpawn = current;
    }
  }

  private handleBeforeUpdate() {
    // mimic gravity
    const {rocket} = this;
    rocket.force.y += Configuration.rocket.gravity;

    this.obstacles.forEach(obstacle => {
      const {body, updateBody} = obstacle;
      body && updateBody && updateBody(body);
    });

    this.sceneries.forEach(scenery => {
      const {body, updateBody} = scenery;
      body && updateBody && updateBody(body);
    });
  }

  private handleAfterUpdate() {
    let escapeScore = 0;
    const {position, angle} = this.rocket;
    const obstacles: ObstacleState[] = this.obstacles
      .map((obstacle) => {
        // check escape score
        if (!obstacle.escape && obstacle.body && position.y < obstacle.body.position.y && this.gameState.event === GameEvent.Play) {
          escapeScore += 10;
          obstacle.escape = true;
        }
        // map matter -> state
        const {body, prop, type, id} = obstacle;
        if (body) {
          return {
            id: body.id,
            type,
            prop: {
              id: body.id,
              center: body.position,
              angle: body.angle,
              velocity: body.velocity,
              label: prop.label,
            },
          }
        }
        return {id, prop, type};
      });
    const sceneries: SceneryState[] = this.sceneries.map(scenery => {
      const {body, prop, type, id} = scenery;
      if (body) {
        return {
          id: body.id,
          type,
          prop: {
            id: body.id,
            center: body.position,
            angle: body.angle,
            label: prop.label,
          },
        }
      }
      return {id, prop, type};
    });
    this.setState({
      additionalScore: this.state.additionalScore + escapeScore,
      rocket: {
        center: position,
        angle,
      },
      obstacles,
      sceneries,
    });
  }

  private handleCollision(event: Matter.IEventCollision<any>): void {
    const {world} = this;
    const {mode: {collisionReset}} = Configuration;
    event.pairs.forEach((pair: IPair) => {
      const {bodyA, bodyB} = pair;
      // reset game
      const labelA = bodyA.label;
      const labelB = bodyB.label;
      if (collisionReset && (labelA === SpriteLabel.Rocket || labelB === SpriteLabel.Rocket)) {
        const waitBoard = this.state.waitBoard;
        waitBoard.score = this.getScore();
        this.setState({waitBoard});
        this.gameState.change(GameEvent.Over);
      }

      const checkRes = checkLabel(labelA, labelB, SpriteLabel.Obstacle, SpriteLabel.Wall, SpriteLabel.BlackHole);
      // check meteor vs (wall or black hole)
      if (checkRes) {
        const target = checkRes.isA ? bodyA : bodyB;
        Matter.Composite.remove(world, target);
        for (let i = 0; i < this.obstacles.length; i++) {
          const meteor = this.obstacles[i];
          if (target.id === meteor.id) {
            this.obstacles.splice(i, 1);
            break;
          }
        }
      }

      // check scene vs wall
      const checkScene = checkLabel(labelA, labelB, SpriteLabel.Scenery, SpriteLabel.Wall);
      if (checkScene) {
        const target = checkScene.isA ? bodyA : bodyB;
        Matter.Composite.remove(world, target);
        for (let i = 0; i < this.sceneries.length; i++) {
          const scenery = this.sceneries[i];
          if (target.id === scenery.id) {
            this.sceneries.splice(i, 1);
            break;
          }
        }
      }
    });
  }

  private getWallProp(s: Side) {
    const {gameRect: {size}, areaPadding, wall} = Configuration;
    const height = (() => {
      switch (s) {
        case Side.Top:
        case Side.Bottom:
          return wall.thick;
        case Side.Left:
        case Side.Right:
          return size.height + areaPadding * 2;
      }
    })();
    const width = (() => {
      switch (s) {
        case Side.Top:
        case Side.Bottom:
          return size.width + areaPadding * 2;
        case Side.Left:
        case Side.Right:
          return wall.thick;
      }
    })();
    const x = (() => {
      switch (s) {
        case Side.Top:
        case Side.Bottom:
          return size.width / 2;
        case Side.Left:
          return -areaPadding;
        case Side.Right:
          return size.width + areaPadding;
      }
    })();
    const y = (() => {
      switch (s) {
        case Side.Top:
          return -areaPadding;
        case Side.Left:
        case Side.Right:
          return size.height / 2;
        case Side.Bottom:
          return size.height + areaPadding;
      }
    })();

    const center = this.oAbsC({x, y});
    return {
      isStatic: true,
      color: wall.color,
      size: {
        width,
        height,
      },
      center,
      label: SpriteLabel.Wall,
      bodyRef: (b: Matter.Body) => Matter.World.add(this.world, b),
      collisionFilter: {
        group: 0,
        category: CollisionCategory.Game | CollisionCategory.Back,
        mask: CollisionCategory.Game | CollisionCategory.Back,
      },
    };
  }

  private getBlackHoleProp(): BlackHoleProp {
    const {type, center} = this.state.gravity;
    return {
      id: 'bh',
      label: SpriteLabel.BlackHole,
      enable: type === Gravity.BlackHole,
      center,
      bodyRef: (b: Matter.Body) => {
        Matter.World.add(this.world, b);
      },
    };
  }

  private getRocketProp(): RocketProp {
    return Object.assign({
        label: SpriteLabel.Rocket,
        collisionFilter: {
          group: 0,
          category: CollisionCategory.Game,
          mask: CollisionCategory.Game,
        },
        bodyRef: (b: Matter.Body) => {
          this.rocket = b;
          Matter.World.addBody(this.world, b);
        },
      },
      this.state.rocket,
    );
  }

  private getScore() {
    if (this.gameState.event === GameEvent.Over) {
      return this.state.waitBoard.score;
    }
    return this.state.additionalScore
      + (this.startTm
        ? Math.round((Date.now() - this.startTm) / 1000)
        : 0);
  }

  private renderWaitBoard(): ReactNode | undefined {
    if (!this.state.waitBoard.show) return;
    return (<WaitBoard
      onTapResume={() => this.gameState.change(GameEvent.Ready)}
      score={this.state.waitBoard.score}
    />);
  }

  private renderReadyHandler() {
    if (this.gameState.event !== GameEvent.Ready) return;
    const dim = Dimensions.get('window');
    const style = {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: dim.width,
      height: dim.height,
      zIndex: Configuration.layer.noGame.base,
    };
    return (<TouchableWithoutFeedback onPress={(): void => {
      this.gameState.change(GameEvent.Play)
    }}>
      <View style={style}/>
    </TouchableWithoutFeedback>);
  }

  private renderScore(): ReactNode {
    if (this.gameState.event !== GameEvent.Play) return;
    return (<Text style={{
      color: '#fff',
      padding: 40,
      fontSize: 40,
      fontWeight: 'bold',
      backgroundColor: 'transparent'
    }}>
      {this.getScore()}
    </Text>);
  }

  private renderBackground(): ReactNode[] {
    return this.state.sceneries
      .map(scenery => {
        const {type, prop, id} = scenery;
        switch (type) {
          case SceneryType.Star:
            return <Star key={id} {...prop} />;
          case SceneryType.ShootingStar:
            return <ShootingStar key={id} {...prop} />;
        }
      });
  }

  private renderObstacles(): ReactNode[] {
    return this.state.obstacles
      .map(obstacle => {
        const prop = Object.assign(obstacle.prop, {key: obstacle.id});
        switch (obstacle.type) {
          case ObstacleType.Meteor:
            return <Meteor {...prop} />;
          case ObstacleType.Wrench:
            return <Wrench {...prop} />;
          case ObstacleType.Earth:
            return <Earth {...prop} />;
          case ObstacleType.UFO:
          default:
            return <UFO {...prop}/>;
        }
      });
  }

  private renderBoostButtons(): ReactNode[] {
    const {gameRect: {size}, rocket: {boost}} = Configuration;
    const boostBtnRadius = size.width / 2 - 10;
    const leftBoostBtnCenter = this.oAbsC({x: 0, y: size.height});
    const rightBoostBtnCenter = this.oAbsC({x: size.width, y: size.height});
    const absV = aVec(boost.vector);
    const leftBoostV = rVecY(absV);
    const rightBoostV = rVecX(leftBoostV);
    const leftBoostAngular = leftBoostV.y / leftBoostV.x * -Math.abs(boost.angular);
    const rightBoostAngular = rightBoostV.y / rightBoostV.x * -Math.abs(boost.angular);

    const {rocket} = this;

    return [
      <CircleButton
        key={'C_L'}
        center={leftBoostBtnCenter}
        radius={boostBtnRadius}
        onTap={() => {
          Matter.Body.setVelocity(rocket, leftBoostV);
          Matter.Body.setAngularVelocity(rocket, leftBoostAngular);
        }}
      />,
      <CircleButton
        key={'C_R'}
        center={rightBoostBtnCenter}
        radius={boostBtnRadius}
        onTap={() => {
          Matter.Body.setVelocity(rocket, rightBoostV);
          Matter.Body.setAngularVelocity(rocket, rightBoostAngular);
        }}
      />
    ];
  }

  render(): ReactNode {
    return (
      <View>
        {/*Background*/}
        <View style={getGameVisibleStyle()}/>
        {/*Score*/}
        {this.renderScore()}
        {/*Board*/}
        {this.renderWaitBoard()}
        {/*ReadyHandler*/}
        {this.renderReadyHandler()}
        {/*Walls*/}
        <RectangleBody {...this.getWallProp(Side.Top)} />
        <RectangleBody {...this.getWallProp(Side.Right)} />
        <RectangleBody {...this.getWallProp(Side.Left)} />
        <RectangleBody {...this.getWallProp(Side.Bottom)} />
        {/*BlackHole*/}
        <BlackHole {...this.getBlackHoleProp()} />
        {/*Scenery*/}
        {this.renderBackground()}
        {/*Sprites*/}
        {this.renderObstacles()}
        {/*Rocket*/}
        <Rocket {...this.getRocketProp()} />
        {/*UI*/}
        {this.renderBoostButtons()}
      </View>
    );
  }
}
