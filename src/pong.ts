import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { Vector2D } from "./vector-2d";
import { coinToss } from "./helpers/coin-toss";
import { getCanvasElement } from "./helpers/get-canvas-element";
import { detectCollision } from "./helpers/collision-detection";
import { KEYS } from "./key-board";

const AUTO_PLAY = false;

const $canvas = getCanvasElement(420, 420);
const context = $canvas.getContext("2d") as CanvasRenderingContext2D;

const score = { player: 0, opponent: 0 };

const centerOfScreen = new Vector2D($canvas.width / 2, $canvas.height / 2);
const playerStartPosition = new Vector2D($canvas.width - 40, centerOfScreen.y);
const opponentStartPosition = new Vector2D(40, centerOfScreen.y);

const ball = new Ball(centerOfScreen.x, centerOfScreen.y);
const player = new Paddle(playerStartPosition.x, playerStartPosition.y);
const opponent = new Paddle(opponentStartPosition.x, opponentStartPosition.y);

function drawScore(context: CanvasRenderingContext2D, text: string) {
  context.save();
  context.fillStyle = "#fff";
  context.font = "48px monospace";
  context.textBaseline = "bottom";
  context.textAlign = "center";
  context.fillText(text, centerOfScreen.x, 50);
  context.restore();
}

function renderBackground(context: CanvasRenderingContext2D): void {
  context.fillRect(0, 0, $canvas.width, $canvas.height);
}

function setToInitialState(): void {
  ball.reset();
  player.reset();
  opponent.reset();

  ball.vx = -ball.speed;
  ball.vy = coinToss() ? -ball.speed : ball.speed;
}

setToInitialState();

window.onload = function gameLoop(): void {
  requestAnimationFrame(gameLoop);

  renderBackground(context);

  if (detectCollision(ball, player)) {
    ball.isHit(centerOfScreen);
  }

  if (detectCollision(ball, opponent)) {
    ball.isHit(centerOfScreen);
  }

  if (ball.isOutToLeft()) {
    score.player += 1;
    setToInitialState();
  }

  if (ball.isOutToRight($canvas.width)) {
    score.opponent += 1;
    setToInitialState();
  }

  if (ball.vx < 0) {
    opponent.moveToBall(ball);
    player.stop();
  } else if (AUTO_PLAY) {
    player.moveToBall(ball);
    opponent.stop();
  }

  if(!AUTO_PLAY) {
      player.up(KEYS.ArrowUp)
      player.down(KEYS.ArrowDown)
  }

  ball.update();
  player.update();
  opponent.update();

  ball.keepInVerticalBounds($canvas.height);

  drawScore(context, `${score.opponent} : ${score.player}`);

  ball.render(context);
  player.render(context);
  opponent.render(context);
};
