'use client';

import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import type { RaceObstacle } from './data';
import styles from './KnowledgeRaceGame.module.css';

export type PhaserRaceStatus = 'intro' | 'playing' | 'paused' | 'finished';
export type PhaserRaceFeedback = 'correct' | 'wrong' | null;

export type PhaserRaceCanvasProps = {
  status: PhaserRaceStatus;
  feedback: PhaserRaceFeedback;
  answerEventId: number;
  questionIndex: number;
  boostActive: boolean;
  progressPercent: number;
  obstacle: RaceObstacle;
  lane: number;
  carId: 'red' | 'blue' | 'green' | 'orange';
};

type RaceState = PhaserRaceCanvasProps;

type RoadMark = {
  object: Phaser.GameObjects.Rectangle;
  progress: number;
  laneOffset: -1 | 1;
};

type SideStripe = {
  object: Phaser.GameObjects.Rectangle;
  progress: number;
  side: -1 | 1;
};

type TreeItem = {
  object: Phaser.GameObjects.Container;
  progress: number;
  side: -1 | 1;
  offset: number;
};

type SpeedLine = {
  object: Phaser.GameObjects.Rectangle;
  progress: number;
  xFactor: number;
};

const WIDTH = 960;
const HEIGHT = 600;
const HORIZON_Y = 170;
const ROAD_BOTTOM_Y = 625;
const ROAD_TOP_HALF = 88;
const ROAD_BOTTOM_HALF = 438;
const LANE_X = [366, 480, 594];
const ASSET_ROOT = '/games/knowledge-race/assets';

function roadHalfWidthAtY(y: number) {
  const amount = Phaser.Math.Clamp((y - HORIZON_Y) / (ROAD_BOTTOM_Y - HORIZON_Y), 0, 1);
  return Phaser.Math.Linear(ROAD_TOP_HALF, ROAD_BOTTOM_HALF, amount);
}

class KnowledgeRaceScene extends Phaser.Scene {
  private raceState: RaceState;
  private roadMarks: RoadMark[] = [];
  private sideStripes: SideStripe[] = [];
  private trees: TreeItem[] = [];
  private speedLines: SpeedLine[] = [];
  private clouds: Phaser.GameObjects.Container[] = [];
  private car!: Phaser.GameObjects.Container;
  private carSprite!: Phaser.GameObjects.Image;
  private flameLeft!: Phaser.GameObjects.Graphics;
  private flameRight!: Phaser.GameObjects.Graphics;
  private carShadow!: Phaser.GameObjects.Ellipse;
  private obstacleSprite: Phaser.GameObjects.Image | null = null;
  private obstacleProgress = 0.12;
  private obstacleOffset = 0;
  private finishContainer!: Phaser.GameObjects.Container;
  private lastAnswerEventId = 0;
  private lastQuestionIndex = -1;
  private lastStatus: PhaserRaceStatus = 'intro';
  private ready = false;

  constructor(initialState: RaceState) {
    super('KnowledgeRaceScene');
    this.raceState = initialState;
  }

  preload() {
    (['red', 'blue', 'green', 'orange'] as const).forEach((carId) => {
      this.load.svg(`car-${carId}`, `${ASSET_ROOT}/car-${carId}.svg`, { width: 420, height: 340 });
    });

    (['rock', 'cones', 'oil', 'crate'] as RaceObstacle[]).forEach((obstacle) => {
      this.load.svg(`obstacle-${obstacle}`, `${ASSET_ROOT}/${obstacle}.svg`);
    });

    this.load.svg('race-coin', `${ASSET_ROOT}/coin.svg`, { width: 96, height: 96 });
  }

  create() {
    this.ready = true;
    this.cameras.main.setBackgroundColor('#72d4ff');
    this.drawSky();
    this.drawMountains();
    this.drawLandscape();
    this.drawRoad();
    this.createRoadMarks();
    this.createTrees();
    this.createClouds();
    this.createSpeedLines();
    this.createFinishLine();
    this.createCar();
    this.spawnObstacle(this.raceState.obstacle);
    this.applyRaceState(this.raceState, true);
  }

  update(_time: number, delta: number) {
    if (!this.ready || this.raceState.status === 'paused') return;

    const speed = this.getWorldSpeed();
    const deltaProgress = delta * speed * 0.0002;

    this.updateRoadMarks(deltaProgress);
    this.updateSideStripes(deltaProgress);
    this.updateTrees(deltaProgress);
    this.updateClouds(delta);
    this.updateSpeedLines(deltaProgress);
    this.updateObstacle(deltaProgress);
    this.updateFinishLine(deltaProgress);

    if (this.car) {
      const bounce = Math.sin(this.time.now * 0.013) * (this.raceState.boostActive ? 3.2 : 1.5);
      this.car.y = 490 + bounce;
      this.carShadow.y = 566 + bounce * 0.15;
    }
  }

  applyRaceState(nextState: RaceState, firstApply = false) {
    const previous = this.raceState;
    this.raceState = nextState;
    if (!this.ready) return;

    if (nextState.status === 'paused') this.tweens.pauseAll();
    if (previous.status === 'paused' && nextState.status !== 'paused') this.tweens.resumeAll();

    if (firstApply || nextState.carId !== previous.carId) {
      this.carSprite?.setTexture(`car-${nextState.carId}`);
    }

    if (firstApply || nextState.lane !== previous.lane) this.moveCarToLane(nextState.lane);
    if (firstApply || nextState.boostActive !== previous.boostActive) this.setTurbo(nextState.boostActive);

    if (firstApply || nextState.questionIndex !== this.lastQuestionIndex) {
      this.lastQuestionIndex = nextState.questionIndex;
      this.spawnObstacle(nextState.obstacle);
      this.spawnCoinTrail();
    }

    if (nextState.answerEventId !== this.lastAnswerEventId && nextState.feedback) {
      this.lastAnswerEventId = nextState.answerEventId;
      if (nextState.feedback === 'correct') this.playCorrectEffect();
      else this.playWrongEffect();
    }

    if (nextState.status !== this.lastStatus) {
      this.handleStatusChange(nextState.status);
      this.lastStatus = nextState.status;
    }
  }

  private getWorldSpeed() {
    if (this.raceState.status === 'intro') return 0.45;
    if (this.raceState.status === 'finished') return 2.2;
    if (this.raceState.feedback === 'wrong') return 0.42;
    if (this.raceState.boostActive) return 1.9;
    return 0.96;
  }

  private drawSky() {
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x28aef8, 0x28aef8, 0xc7f1ff, 0xc7f1ff, 1);
    sky.fillRect(0, 0, WIDTH, 272);
    sky.fillStyle(0xffef76, 1);
    sky.fillCircle(805, 72, 42);
    sky.fillStyle(0xffef76, 0.16);
    sky.fillCircle(805, 72, 62);
  }

  private drawMountains() {
    const g = this.add.graphics();
    g.fillStyle(0x6ab2c8, 1);
    g.fillTriangle(-40, 248, 150, 92, 340, 248);
    g.fillTriangle(210, 248, 448, 72, 670, 248);
    g.fillTriangle(520, 248, 760, 104, 1030, 248);
    g.fillStyle(0x438da8, 0.82);
    g.fillTriangle(75, 248, 295, 126, 470, 248);
    g.fillTriangle(390, 248, 610, 104, 820, 248);
    g.fillStyle(0xf4fcff, 0.78);
    g.fillTriangle(118, 116, 150, 92, 183, 117);
    g.fillTriangle(405, 100, 448, 72, 490, 102);
    g.fillTriangle(720, 125, 760, 104, 800, 126);
  }

  private drawLandscape() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x74cf52, 0x74cf52, 0x2b9137, 0x2b9137, 1);
    g.fillRect(0, 235, WIDTH, HEIGHT - 235);

    g.fillStyle(0x1f7f31, 1);
    for (let x = 0; x < WIDTH; x += 44) {
      g.fillCircle(x, 235 + (x % 3) * 5, 28);
      g.fillCircle(x + 22, 244, 24);
    }
  }

  private drawRoad() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(WIDTH / 2 - ROAD_TOP_HALF - 15, HORIZON_Y, WIDTH / 2 - ROAD_BOTTOM_HALF - 34, ROAD_BOTTOM_Y, WIDTH / 2 - ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);
    g.fillTriangle(WIDTH / 2 + ROAD_TOP_HALF + 15, HORIZON_Y, WIDTH / 2 + ROAD_BOTTOM_HALF + 34, ROAD_BOTTOM_Y, WIDTH / 2 + ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);

    g.fillGradientStyle(0x59636c, 0x59636c, 0x242c33, 0x242c33, 1);
    g.fillTriangle(WIDTH / 2 - ROAD_TOP_HALF, HORIZON_Y, WIDTH / 2 - ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y, WIDTH / 2 + ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y);
    g.fillTriangle(WIDTH / 2 - ROAD_TOP_HALF, HORIZON_Y, WIDTH / 2 + ROAD_BOTTOM_HALF, ROAD_BOTTOM_Y, WIDTH / 2 + ROAD_TOP_HALF, HORIZON_Y);
  }

  private createRoadMarks() {
    [-1, 1].forEach((laneOffset) => {
      for (let index = 0; index < 14; index += 1) {
        this.roadMarks.push({
          object: this.add.rectangle(0, 0, 8, 34, 0xffdb4d).setDepth(2),
          progress: index / 14,
          laneOffset: laneOffset as -1 | 1,
        });
      }
    });

    [-1, 1].forEach((side) => {
      for (let index = 0; index < 22; index += 1) {
        this.sideStripes.push({
          object: this.add.rectangle(0, 0, 34, 18, index % 2 === 0 ? 0xffffff : 0xef4444).setDepth(2),
          progress: index / 22,
          side: side as -1 | 1,
        });
      }
    });
  }

  private createTrees() {
    [-1, 1].forEach((side) => {
      for (let index = 0; index < 12; index += 1) {
        const tree = this.add.container(0, 0).setDepth(1);
        const trunk = this.add.rectangle(0, 22, 10, 38, 0x82451f);
        const crown = this.add.graphics();
        crown.fillStyle(index % 2 ? 0x25933b : 0x37a94b, 1);
        crown.fillCircle(0, -5, 28);
        crown.fillCircle(-18, 7, 20);
        crown.fillCircle(18, 7, 20);
        crown.fillStyle(0x78cf58, 0.5);
        crown.fillCircle(-8, -15, 12);
        tree.add([trunk, crown]);
        this.trees.push({
          object: tree,
          progress: (index / 12 + (side === 1 ? 0.04 : 0)) % 1,
          side: side as -1 | 1,
          offset: 30 + (index % 3) * 18,
        });
      }
    });
  }

  private createClouds() {
    for (let index = 0; index < 4; index += 1) {
      const cloud = this.add.container(80 + index * 255, 54 + (index % 2) * 42).setDepth(0);
      const color = 0xffffff;
      cloud.add([
        this.add.circle(0, 8, 22, color, 0.86),
        this.add.circle(28, -4, 30, color, 0.92),
        this.add.circle(60, 8, 22, color, 0.86),
        this.add.rectangle(30, 14, 80, 28, color, 0.9),
      ]);
      cloud.setScale(0.78 + (index % 2) * 0.12);
      this.clouds.push(cloud);
    }
  }

  private createSpeedLines() {
    for (let index = 0; index < 28; index += 1) {
      this.speedLines.push({
        object: this.add.rectangle(0, 0, 3, 44, 0xd9f8ff, 0).setDepth(8),
        progress: index / 28,
        xFactor: Phaser.Math.FloatBetween(-0.95, 0.95),
      });
    }
  }

  private createFinishLine() {
    this.finishContainer = this.add.container(0, 0).setDepth(3).setVisible(false);
    const cell = 18;
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 24; column += 1) {
        const color = (row + column) % 2 === 0 ? 0xffffff : 0x101820;
        this.finishContainer.add(this.add.rectangle(column * cell, row * cell, cell, cell, color).setOrigin(0));
      }
    }
  }

  private createCar() {
    this.carShadow = this.add.ellipse(LANE_X[this.raceState.lane] ?? LANE_X[1], 566, 224, 42, 0x08121c, 0.38).setDepth(8);
    this.car = this.add.container(LANE_X[this.raceState.lane] ?? LANE_X[1], 490).setDepth(10);
    this.flameLeft = this.add.graphics();
    this.flameRight = this.add.graphics();
    this.carSprite = this.add.image(0, 0, `car-${this.raceState.carId}`).setDisplaySize(250, 205);
    this.car.add([this.flameLeft, this.flameRight, this.carSprite]);
    this.drawFlames(false);
  }

  private drawFlames(boosted: boolean) {
    const height = boosted ? 78 : 44;
    const alpha = boosted ? 1 : 0.76;
    [this.flameLeft, this.flameRight].forEach((flame, index) => {
      flame.clear();
      flame.fillStyle(0xff4b14, alpha);
      flame.fillTriangle(-13, 42, 13, 42, 0, 42 + height);
      flame.fillStyle(0xffd447, alpha);
      flame.fillTriangle(-7, 42, 7, 42, 0, 42 + height * 0.72);
      flame.x = index === 0 ? -32 : 32;
      flame.y = 34;
    });
  }

  private moveCarToLane(lane: number) {
    if (!this.car) return;
    const targetX = LANE_X[Phaser.Math.Clamp(lane, 0, 2)] ?? LANE_X[1];
    this.tweens.killTweensOf(this.car);
    this.tweens.killTweensOf(this.carShadow);

    const tilt = targetX < this.car.x ? -5 : targetX > this.car.x ? 5 : 0;
    this.tweens.add({
      targets: this.car,
      x: targetX,
      angle: tilt,
      duration: 360,
      ease: 'Cubic.Out',
      onComplete: () => this.tweens.add({ targets: this.car, angle: 0, duration: 130, ease: 'Sine.Out' }),
    });
    this.tweens.add({ targets: this.carShadow, x: targetX, duration: 360, ease: 'Cubic.Out' });
  }

  private setTurbo(active: boolean) {
    if (!this.car) return;
    this.drawFlames(active);
    this.speedLines.forEach((line) => line.object.setAlpha(active ? 0.68 : 0));

    if (active) {
      this.cameras.main.flash(120, 165, 230, 255, false);
      this.tweens.add({ targets: this.car, scale: 1.08, duration: 140, yoyo: true, ease: 'Back.Out' });
    }
  }

  private spawnObstacle(type: RaceObstacle) {
    this.obstacleSprite?.destroy();
    this.obstacleProgress = 0.12;
    this.obstacleOffset = Phaser.Math.Between(-1, 1) * 0.34;
    this.obstacleSprite = this.add.image(0, 0, `obstacle-${type}`).setDepth(7);
    this.positionPerspectiveObject(this.obstacleSprite, this.obstacleProgress, this.obstacleOffset);
  }

  private spawnCoinTrail() {
    for (let index = 0; index < 5; index += 1) {
      const progress = 0.18 + index * 0.09;
      const xFactor = -0.34 + index * 0.13;
      const position = this.perspectivePosition(progress, xFactor);
      const coin = this.add.image(position.x, position.y, 'race-coin')
        .setScale(position.scale * 0.34)
        .setDepth(6)
        .setAlpha(0.96);
      this.tweens.add({
        targets: coin,
        y: position.y - 9,
        angle: 180,
        duration: 520,
        delay: index * 70,
        yoyo: true,
        repeat: 1,
        ease: 'Sine.InOut',
        onComplete: () => coin.destroy(),
      });
    }
  }

  private playCorrectEffect() {
    this.cameras.main.flash(90, 105, 255, 150, false);
    this.emitCoinBurst();

    if (this.obstacleSprite) {
      this.tweens.add({
        targets: this,
        obstacleProgress: 1.16,
        obstacleOffset: this.obstacleOffset * 2.2,
        duration: 520,
        ease: 'Cubic.In',
        onComplete: () => this.obstacleSprite?.setAlpha(0),
      });
    }
  }

  private playWrongEffect() {
    this.cameras.main.shake(260, 0.012);
    this.tweens.add({ targets: this.car, x: this.car.x - 10, angle: -4, duration: 70, yoyo: true, repeat: 2, ease: 'Sine.InOut' });

    if (this.obstacleSprite) {
      const escapeSide = this.car.x < WIDTH / 2 ? 0.85 : -0.85;
      this.tweens.add({
        targets: this,
        obstacleProgress: 1.05,
        obstacleOffset: escapeSide,
        duration: 620,
        ease: 'Cubic.In',
        onComplete: () => this.obstacleSprite?.setAlpha(0),
      });
    }
  }

  private emitCoinBurst() {
    for (let index = 0; index < 11; index += 1) {
      const coin = this.add.image(this.car.x, this.car.y - 20, 'race-coin').setScale(0.22).setDepth(12);
      const angle = Phaser.Math.DegToRad(Phaser.Math.Between(205, 335));
      const distance = Phaser.Math.Between(70, 150);
      this.tweens.add({
        targets: coin,
        x: this.car.x + Math.cos(angle) * distance,
        y: this.car.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.08,
        angle: 220,
        duration: Phaser.Math.Between(500, 760),
        ease: 'Cubic.Out',
        onComplete: () => coin.destroy(),
      });
    }
  }

  private handleStatusChange(status: PhaserRaceStatus) {
    if (status === 'intro') {
      this.car.setAlpha(0.95);
      this.finishContainer.setVisible(false);
    } else if (status === 'playing') {
      this.car.setAlpha(1);
    } else if (status === 'finished') {
      this.finishContainer.setVisible(true);
      this.obstacleSprite?.setVisible(false);
      this.setTurbo(true);
      this.tweens.add({ targets: this.car, y: 445, scale: 1.12, duration: 600, ease: 'Cubic.Out' });
    }
  }

  private updateRoadMarks(deltaProgress: number) {
    this.roadMarks.forEach((mark) => {
      mark.progress = (mark.progress + deltaProgress) % 1;
      const p = this.perspectivePosition(mark.progress, mark.laneOffset * 0.33);
      mark.object.setPosition(p.x, p.y).setScale(p.scale * 0.36, p.scale * 0.72).setAlpha(0.25 + mark.progress * 0.75);
    });
  }

  private updateSideStripes(deltaProgress: number) {
    this.sideStripes.forEach((stripe) => {
      stripe.progress = (stripe.progress + deltaProgress * 1.03) % 1;
      const p = this.perspectivePosition(stripe.progress, stripe.side * 1.02);
      stripe.object.setPosition(p.x, p.y).setScale(p.scale * 0.52, p.scale * 0.5).setRotation(stripe.side * 0.08).setAlpha(0.25 + stripe.progress * 0.75);
    });
  }

  private updateTrees(deltaProgress: number) {
    this.trees.forEach((tree) => {
      tree.progress = (tree.progress + deltaProgress * 0.72) % 1;
      const p = this.perspectivePosition(tree.progress, tree.side * 1.18);
      tree.object.setPosition(p.x + tree.side * tree.offset * p.scale, p.y - 14 * p.scale).setScale(p.scale * 0.74).setAlpha(0.24 + tree.progress * 0.76);
    });
  }

  private updateClouds(delta: number) {
    this.clouds.forEach((cloud, index) => {
      cloud.x += delta * (0.008 + index * 0.002);
      if (cloud.x > WIDTH + 120) cloud.x = -140;
    });
  }

  private updateSpeedLines(deltaProgress: number) {
    this.speedLines.forEach((line) => {
      line.progress = (line.progress + deltaProgress * 2.6) % 1;
      const p = this.perspectivePosition(line.progress, line.xFactor);
      line.object.setPosition(p.x, p.y).setScale(1, p.scale * 1.2).setAlpha(this.raceState.boostActive ? 0.18 + line.progress * 0.72 : 0);
    });
  }

  private updateObstacle(deltaProgress: number) {
    if (!this.obstacleSprite || !this.obstacleSprite.visible) return;
    if (!this.tweens.isTweening(this)) this.obstacleProgress += deltaProgress * 0.86;
    if (this.obstacleProgress > 1.12) this.obstacleProgress = 0.12;
    this.positionPerspectiveObject(this.obstacleSprite, this.obstacleProgress, this.obstacleOffset);
  }

  private updateFinishLine(deltaProgress: number) {
    if (!this.finishContainer.visible) return;
    const progress = Phaser.Math.Clamp(0.2 + this.raceState.progressPercent / 118 + deltaProgress * 0.2, 0.18, 0.94);
    const p = this.perspectivePosition(progress, 0);
    const width = roadHalfWidthAtY(p.y) * 1.72;
    this.finishContainer.setPosition(WIDTH / 2 - 216, p.y).setScale(width / 432, Math.max(0.16, width / 920));
  }

  private perspectivePosition(progress: number, xFactor: number) {
    const clamped = Phaser.Math.Clamp(progress, 0, 1.2);
    const y = HORIZON_Y + Math.pow(clamped, 1.67) * (ROAD_BOTTOM_Y - HORIZON_Y);
    const halfWidth = roadHalfWidthAtY(Math.min(y, ROAD_BOTTOM_Y));
    return { x: WIDTH / 2 + xFactor * halfWidth, y, scale: 0.16 + clamped * 1.16 };
  }

  private positionPerspectiveObject(object: Phaser.GameObjects.Image, progress: number, xFactor: number) {
    const p = this.perspectivePosition(progress, xFactor);
    const baseScale = this.raceState.obstacle === 'oil' ? 0.62 : 0.52;
    object.setPosition(p.x, p.y).setScale(p.scale * baseScale).setAlpha(Phaser.Math.Clamp(0.18 + progress, 0, 1));
  }
}

export default function PhaserRaceCanvas(props: PhaserRaceCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<KnowledgeRaceScene | null>(null);
  const latestPropsRef = useRef(props);
  latestPropsRef.current = props;

  useEffect(() => {
    if (!hostRef.current || gameRef.current) return;

    const scene = new KnowledgeRaceScene(latestPropsRef.current);
    sceneRef.current = scene;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: '#72d4ff',
      antialias: true,
      roundPixels: false,
      render: { antialias: true, pixelArt: false },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WIDTH,
        height: HEIGHT,
      },
      scene: [scene],
    });

    return () => {
      sceneRef.current = null;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.applyRaceState(props);
  }, [props]);

  return <div className={styles.phaserCanvasWrap} ref={hostRef} aria-label="Đường đua hoạt hình Phaser" />;
}
