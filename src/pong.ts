import kaboom from "kaboom";

kaboom({
  width: 640,
  height: 480,
  font: "sinko",
  background: [0, 0, 0],
});

loadSound("hit", "hit.wav");

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

scene("game-over", (playerScore: number, opponentScore: number) => {
  add([
    text(`${playerScore} ${opponentScore}`, { size: 48 }),
    pos(width() / 2, 40),
    (origin as any)("center"),
  ]);

  const gameOverText = playerScore > opponentScore ? "You win!" : "You lose!";
  add([
    text(gameOverText, { size: 32 }),
    pos(width() / 2, 80),
    (origin as any)("center"),
  ]);

  const btn = add([
    text("Click to play again", { size: 32 }),
    pos(width() / 2, height() / 2),
    area({ cursor: "pointer" }),
    (origin as any)("center"),
  ]);

  btn.onClick(() => {
    go("game");
  });
});

scene("menu", () => {
  add([
    text(`Pong`, { size: 64 }),
    pos(width() / 2, 60),
    (origin as any)("center"),
  ]);

  const btn = add([
    text("Click to play", { size: 32 }),
    pos(width() / 2, height() / 2),
    area({ cursor: "pointer" }),
    (origin as any)("center"),
  ]);

  btn.onClick(() => {
    go("game");
  });
});

scene("game", () => {
  /**
   * Score
   */
  const score = add([
    text("0 0", { size: 48 }),
    pos(width() / 2, 40),
    (origin as any)("center"),
    {
      playerScore: 0,
      opponentScore: 0,
      winningScore: 3,
      playerWins(): boolean {
        return this.playerScore >= this.winningScore;
      },
      opponentWins(): boolean {
        return this.opponentScore >= this.winningScore;
      },
    },
  ]);

  score.onUpdate(() => {
    score.text = `${score.playerScore} ${score.opponentScore}`;

    if (score.playerWins() || score.opponentWins()) {
      go("game-over", score.playerScore, score.opponentScore);
    }
  });

  /**
   * Ball
   */
  const ball = add([
    "ball",
    circle(6),
    area({ width: 12, height: 12, offset: vec2(-6) }),
    pos(width() / 2, height() / 2),
    color(255, 255, 255),
    {
      speed: 200,
      serveLeft: true,
      initialSpeed: 200,
      speedIncrement: 15,
      velocity: vec2(),
      serve(xVelocity: number) {
        this.velocity.x = xVelocity;
        this.setYVelocity(chance(0.5));
        this.serveLeft = !this.serveLeft;
      },
      setYVelocity(up: boolean) {
        const yVelocity = rand(this.speed / 4, this.speed);
        this.velocity.y = up ? -yVelocity : yVelocity;
      },
      reset() {
        this.moveTo(width() / 2, height() / 2);

        this.velocity.x = 0;
        this.velocity.y = 0;

        this.speed = this.initialSpeed;

        this.serve(this.serveLeft ? -this.speed : this.speed);
      },
      outToLeft(): boolean {
        return this.pos.x + this.radius < 0;
      },
      outToRight(): boolean {
        return this.pos.x - this.radius > width();
      },
      hasHitRoof(): boolean {
        return this.pos.y - this.radius <= 0;
      },
      hasHitFloor(): boolean {
        return this.pos.y + this.radius >= height();
      },
    },
  ]);

  ball.onCollide("paddle", () => {
    if (ball.velocity.x > 0) {
      ball.velocity.x = -ball.speed;
    } else {
      ball.velocity.x = ball.speed;
    }

    ball.speed += ball.speedIncrement;
  });

  ball.onCollide("*", () => {
    play("hit");
  });

  ball.onUpdate(() => {
    ball.move(ball.velocity.x, ball.velocity.y);

    const outToLeft = ball.outToLeft();
    const outToRight = ball.outToRight();

    if (outToLeft) {
      score.playerScore += 1;
    }

    if (outToRight) {
      score.opponentScore += 1;
    }

    if (outToLeft || outToRight) {
      ball.reset();
    }

    if (ball.hasHitFloor()) {
      ball.setYVelocity(true);
      play("hit");
    }

    if (ball.hasHitRoof()) {
      ball.setYVelocity(false);
      play("hit");
    }
  });

  /**
   * Paddle
   */
  const paddle = [
    "paddle",
    rect(12, 80),
    area(),
    (origin as any)("center"),
    {
      speed: 200,
      update() {
        const halfHeight = this.height / 2;
        this.pos.y = clamp(this.pos.y, halfHeight, height() - halfHeight);
      },
    },
  ];

  /**
   * Player
   */
  const player = add(["player", ...paddle, pos(width() - 40, height() / 2)]);

  /**
   * Opponent
   */
  const opponent = add(["opponent", ...paddle, pos(40, height() / 2)]);

  opponent.onUpdate(() => {
    if (ball.velocity.x > 0) {
      opponent.moveTo(opponent.pos.x, height() / 2, opponent.speed);
    } else {
      opponent.moveTo(opponent.pos.x, ball.pos.y, opponent.speed);
    }
  });

  /**
   * Global
   */
  onLoad(() => {
    ball.serve(-ball.speed);
  });

  onKeyDown("up", () => {
    player.move(0, -player.speed);
  });

  onKeyDown("down", () => {
    player.move(0, player.speed);
  });
});

go("menu");
