import { Ball } from "./ball";
import { View } from "./view";
import { Game } from "./game";
import { Paddle } from "./paddle";
import { Canvas } from "./canvas";
import { Vector2d } from "./vector";
import { coinToss, detectCollision } from "./helpers";

const VIEW = new View(innerWidth * 0.6, innerHeight * 0.7);
const CANVAS = new Canvas(document.body, VIEW);
const CONTEXT = CANVAS.get2dContext();

const BALL = new Ball();
const PLAYER = new Paddle();
const OPPONENT = new Paddle();

const GAME = new Game(VIEW);

GAME.setBallStartPosition(BALL);
GAME.setPlayerStartPosition(PLAYER);
GAME.setOpponentStartPosition(OPPONENT);

function drawBackground() {
  CONTEXT.save();
  CONTEXT.fillStyle = "black";
  CONTEXT.strokeStyle = "white";
  CONTEXT.fillRect(0, 0, VIEW.width, VIEW.height);
  CONTEXT.beginPath();
  CONTEXT.moveTo(VIEW.width / 2, 0);
  CONTEXT.lineTo(VIEW.width / 2, VIEW.height);
  CONTEXT.setLineDash([5, 15]);
  CONTEXT.stroke();
  CONTEXT.restore();
}

window.onload = function main() {
  requestAnimationFrame(main);

  drawBackground();

  PLAYER.update();
  PLAYER.render(CONTEXT);

  OPPONENT.update();
  OPPONENT.render(CONTEXT);

  BALL.update();
  BALL.render(CONTEXT);

  const ballOutToLeft = BALL.outToLeft(0);
  const ballOutToRight = BALL.outToRight(VIEW.width);
  if (ballOutToLeft || ballOutToRight) {
    GAME.setBallStartPosition(BALL);
    GAME.setPlayerStartPosition(PLAYER);
    GAME.setOpponentStartPosition(OPPONENT);
    GAME.setServe(BALL);
  }

  if (ballOutToLeft) {
    GAME.playerScore += 1;
  }

  if (ballOutToRight) {
    GAME.opponentScore += 1;
  }

  if (BALL.hasHitLowerLimits(0)) {
    BALL.velocity.y = BALL.speed;
  }

  if (BALL.hasHitUpperLimits(VIEW.height)) {
    BALL.velocity.y = -BALL.speed;
  }

  if (detectCollision(BALL, PLAYER)) {
    BALL.velocity.x = -BALL.speed;
    BALL.velocity.y = Math.random() * (coinToss() ? BALL.speed : -BALL.speed);
  }

  if (detectCollision(BALL, OPPONENT)) {
    BALL.velocity.x = BALL.speed;
    BALL.velocity.y = Math.random() * (coinToss() ? BALL.speed : -BALL.speed);
  }

  if (BALL.velocity.x > 0) {
    PLAYER.velocity.y =
      BALL.position.y > PLAYER.position.y ? PLAYER.speed : -PLAYER.speed;
  } else {
    PLAYER.velocity.y = 0;
  }

  if (BALL.velocity.x < 0) {
    OPPONENT.velocity.y =
      BALL.position.y > OPPONENT.position.y ? OPPONENT.speed : -OPPONENT.speed;
  } else {
    OPPONENT.velocity.y = 0;
  }
};
