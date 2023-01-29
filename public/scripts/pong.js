(() => {
  // src/game-object.ts
  var GameObject = class {
  };

  // src/vector.ts
  var Vector2d = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  };

  // src/ball.ts
  var Ball = class extends GameObject {
    constructor() {
      super(...arguments);
      this.speed = 4;
      this.radius = 6;
      this.color = "white";
    }
    reset(position) {
      this.position = position;
      const yVelocity = Math.random() > 0.5 ? -this.speed : this.speed;
      this.velocity = new Vector2d(-this.speed, yVelocity);
    }
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
    render(context) {
      context.save();
      context.translate(this.position.x, this.position.y);
      context.beginPath();
      context.arc(0, 0, this.radius, 0, 2 * Math.PI);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
      context.restore();
    }
    outToLeft(left) {
      return this.position.x + this.radius < left;
    }
    outToRight(right) {
      return this.position.x - this.radius > right;
    }
    hasHitUpperLimits(upperLimit) {
      return this.position.y + this.radius > upperLimit;
    }
    hasHitLowerLimits(lowerLimit) {
      return this.position.y - this.radius < lowerLimit;
    }
  };

  // src/view.ts
  var View = class {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
  };

  // src/game.ts
  var Game = class {
    constructor(view) {
      this.view = view;
      this.sidePadding = 40;
      this.reset();
    }
    reset() {
      this.inProgress = true;
      this.playerScore = 0;
      this.opponentScore = 0;
      this.playerServe = false;
      this.opponentServe = true;
    }
    setServe(ball) {
      this.playerServe = !this.playerServe;
      this.opponentServe = !this.opponentServe;
      ball.velocity.x = this.playerServe ? ball.speed : -ball.speed;
    }
    hasWinner(winningScore) {
      const { playerScore, opponentScore: computerScore } = this;
      return playerScore === winningScore || computerScore === winningScore;
    }
    setBallStartPosition(ball) {
      ball.reset(
        new Vector2d(
          this.view.width / 2,
          Math.min(Math.random() * this.view.height)
        )
      );
    }
    setPlayerStartPosition(player) {
      player.reset(
        new Vector2d(
          this.view.width - this.sidePadding,
          this.view.height / 2 - player.height / 2
        )
      );
    }
    setOpponentStartPosition(opponent) {
      opponent.reset(
        new Vector2d(this.sidePadding, this.view.height / 2 - opponent.height / 2)
      );
    }
  };

  // src/helpers.ts
  var coinToss = () => Math.random() > 0.5;
  var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  function detectCollision(ball, paddle) {
    let testX = ball.position.x;
    let testY = ball.position.y;
    if (ball.position.x < paddle.position.x)
      testX = paddle.position.x;
    else if (ball.position.x > paddle.position.x + paddle.width)
      testX = paddle.position.x + paddle.width;
    if (ball.position.y < paddle.position.y)
      testY = paddle.position.y;
    else if (ball.position.y > paddle.position.y + paddle.height)
      testY = paddle.position.y + paddle.height;
    const distX = ball.position.x - testX;
    const distY = ball.position.y - testY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    return distance <= ball.radius;
  }

  // src/paddle.ts
  var Paddle = class extends GameObject {
    constructor() {
      super(...arguments);
      this.width = 6;
      this.height = 50;
      this.speed = 4;
      this.color = "white";
      this.friction = 0;
      this.velocity = new Vector2d(0, 0);
    }
    update() {
      const { velocity, friction, speed } = this;
      this.position.y += this.velocity.y;
      if (velocity.y) {
        this.velocity.y = clamp(velocity.y - friction, 0, speed);
      }
    }
    reset(position) {
      this.position = position;
      this.velocity = new Vector2d(0, 0);
    }
    render(context) {
      context.save();
      context.fillStyle = this.color;
      context.translate(this.position.x, this.position.y);
      context.fillRect(0, 0, this.width, this.height);
      context.restore();
    }
  };

  // src/canvas.ts
  var Canvas = class {
    constructor($parent, dimensions) {
      this.$parent = $parent;
      this.dimensions = dimensions;
      this.$canvas = document.createElement("canvas");
      $parent.appendChild(this.$canvas);
      this.setSize(dimensions);
    }
    get2dContext() {
      return this.$canvas.getContext("2d");
    }
    setSize({ width, height }) {
      this.$canvas.width = width;
      this.$canvas.height = height;
    }
  };

  // src/pong.ts
  var VIEW = new View(innerWidth * 0.6, innerHeight * 0.7);
  var CANVAS = new Canvas(document.body, VIEW);
  var CONTEXT = CANVAS.get2dContext();
  var BALL = new Ball();
  var PLAYER = new Paddle();
  var OPPONENT = new Paddle();
  var GAME = new Game(VIEW);
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
      PLAYER.velocity.y = BALL.position.y > PLAYER.position.y ? PLAYER.speed : -PLAYER.speed;
    } else {
      PLAYER.velocity.y = 0;
    }
    if (BALL.velocity.x < 0) {
      OPPONENT.velocity.y = BALL.position.y > OPPONENT.position.y ? OPPONENT.speed : -OPPONENT.speed;
    } else {
      OPPONENT.velocity.y = 0;
    }
  };
})();
