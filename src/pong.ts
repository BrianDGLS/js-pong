import { Ball } from "./ball"
import { Point } from "./point"
import { Paddle } from "./paddle"
import { getCanvasElement } from "./canvas"
import { detectCollision } from "./helpers/collision-detection"
import { coinToss } from "./helpers/coin-toss"

const $canvas = getCanvasElement(420, 420)
const context = $canvas.getContext('2d') as CanvasRenderingContext2D

function renderBackground(context: CanvasRenderingContext2D): void {
  context.fillRect(0, 0, $canvas.width, $canvas.height)
}

const ballRadius = 6
const paddleWidth = 6
const paddleHeight = 60
const score = { player: 0, opponent: 0 }

const centerOfScreen = new Point($canvas.width / 2, $canvas.height / 2)
const playerStartPosition = new Point($canvas.width - 40, centerOfScreen.y - paddleHeight / 2)
const opponentStartPosition = new Point(40, centerOfScreen.y - paddleHeight / 2)

const ball = new Ball(new Point(centerOfScreen.x, centerOfScreen.y), ballRadius)
const player = new Paddle(new Point(playerStartPosition.x, playerStartPosition.y), paddleWidth, paddleHeight)
const opponent = new Paddle(new Point(opponentStartPosition.x, opponentStartPosition.y), paddleWidth, paddleHeight)

function drawScore(context: CanvasRenderingContext2D, text: string) {
  context.save()
  context.fillStyle = '#fff'
  context.font = "48px monospace"
  context.textBaseline = "bottom"
  context.textAlign = 'center'
  context.fillText(text, centerOfScreen.x, 50)
  context.restore()
}


function setToInitialState(): void {
  ball.point.reset()
  player.point.reset()
  opponent.point.reset()

  ball.point.vx = coinToss() ? -ball.speed : ball.speed
  ball.point.vy = coinToss() ? -ball.speed : ball.speed
}

setToInitialState()

window.onload = function gameLoop(): void {
  requestAnimationFrame(gameLoop)

  renderBackground(context)

  if (detectCollision(ball, player)) {
    ball.isHit(centerOfScreen, player.point)
  }

  if (detectCollision(ball, opponent)) {
    ball.isHit(centerOfScreen, opponent.point)
  }

  if (ball.isOutToLeft()) {
    score.player += 1
    setToInitialState()
  }

  if (ball.isOutToRight($canvas.width)) {
    score.opponent += 1
    setToInitialState()
  }

  if (ball.point.vx > 0) {
    player.moveToBall(ball)
    opponent.stop()
  } else {
    opponent.moveToBall(ball)
    player.stop()
  }

  ball.point.update()
  player.point.update()
  opponent.point.update()

  ball.keepInVerticalBounds($canvas.height)

  drawScore(context, `${score.opponent} : ${score.player}`)

  ball.render(context)
  player.render(context)
  opponent.render(context)
}
