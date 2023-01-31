import kaboom, { DrawTextOpt, Vec2 } from "kaboom";

const $canvas = document.querySelector("#pong");

kaboom({
  width: 640,
  height: 480,
  font: "sinko",
  background: [0, 0, 0],
  canvas: $canvas as HTMLCanvasElement,
});

loadSound("hit", "./hit.wav");

scene("main", () => {
  let playerServe = true;

  add([pos(width() / 2 - 4, 0), rect(2, height()), outline(1)]);

  add(["top", area(), rect(width(), 0), color(0, 0, 0), pos(0, 0)]);
  add(["bottom", area(), rect(width(), 0), color(0, 0, 0), pos(0, height())]);
  add(["right", area(), rect(0, height()), color(0, 0, 0), pos(width(), 0)]);
  add(["left", area(), rect(0, height()), color(0, 0, 0), pos(0, 0)]);

  const player = add([
    "player",
    "paddle",
    area(),
    rect(6, 60),
    color(255, 255, 255),
    pos(width() - 40, height() / 2),
    {
      speed: 160,
    },
  ]);

  const opponent = add([
    "opponent",
    "paddle",
    area(),
    rect(6, 60),
    color(255, 255, 255),
    pos(40, height() / 2),
    {
      speed: 160,
      moveToBall(ball) {
        if (ball.velocity.x < 0) {
          opponent.moveTo(
            opponent.pos.x,
            ball.pos.y - ball.radius,
            opponent.speed
          );
        } else {
          opponent.moveTo(
            opponent.pos.x,
            height() / 2 - opponent.height / 2,
            opponent.speed
          );
        }
      },
    },
  ]);

  const score = add([
    text("0   0", {
      size: 48,
    }),
    (origin as any)("center"),
    color(150, 150, 150),
    pos(width() / 2, 80),
    {
      player: 0,
      opponent: 0,
      winningScore: 3,
      getText() {
        return `${this.opponent}   ${this.player}`;
      },
    },
  ]);

  const ball = add([
    "ball",
    circle(6),
    area({ width: 12, height: 12, offset: vec2(-6) }),
    color(255, 255, 255),
    pos(width() / 2, height() / 2),
    {
      speed: 200,
      velocity: vec2(0, 0),
      serve() {
        ball.velocity.x = playerServe ? -ball.speed : ball.speed;
        ball.velocity.y = rand() * (chance(0.5) ? ball.speed : -ball.speed);
        playerServe = playerServe;
      },
      reset() {
        this.pos.x = width() / 2;
        this.pos.y = height() / 2;
        this.speed = 200;
      },
    },
  ]);

  onKeyDown("up", () => {
    player.move(0, -player.speed);
  });

  onKeyDown("down", () => {
    player.move(0, player.speed);
  });

  onLoad(() => {
    ball.serve();
  });

  onUpdate(() => {
    opponent.moveToBall(ball);
    ball.move(ball.velocity);

    if (
      score.player >= score.winningScore ||
      score.opponent >= score.winningScore
    ) {
      go("game-over", score.player, score.opponent);
    }
  });

  let soundPlayed = false;
  onCollide("ball", "*", () => {
    if (!soundPlayed) {
      play("hit");
      soundPlayed = true;
      setTimeout(() => {
        soundPlayed = false;
      }, 50);
    }
  });

  onCollide("ball", "player", () => {
    ball.velocity.x = -ball.speed;
    ball.velocity.y = rand() * (chance(0.5) ? ball.speed : -ball.speed);
  });

  onCollide("ball", "paddle", () => {
    ball.speed += 20;
  });

  onCollide("ball", "opponent", () => {
    ball.velocity.x = ball.speed;
    ball.velocity.y = rand() * (chance(0.5) ? ball.speed : -ball.speed);
  });

  onCollide("ball", "bottom", () => {
    ball.velocity.y = rand() * -ball.speed;
  });

  onCollide("ball", "top", () => {
    ball.velocity.y = rand() * ball.speed;
  });

  onCollide("ball", "left", () => {
    score.player += 1;
    score.text = score.getText();

    ball.reset();
    ball.serve();
  });

  onCollide("ball", "right", () => {
    score.opponent += 1;
    score.text = score.getText();

    ball.reset();
    ball.serve();
  });

  onCollide("paddle", "bottom", (paddle) => {
    paddle.pos.y = height() - paddle.height;
  });

  onCollide("paddle", "top", (paddle) => {
    paddle.pos.y = 0;
  });
});

scene("menu", () => {
  const btn = add([
    text("Play", { size: 48 }),
    pos(width() / 2, height() / 2),
    area({ cursor: "pointer" }),
    scale(1),
    (origin as any)("center"),
  ]);

  btn.onClick(() => {
    go("main");
  });
});

scene("game-over", (playerScore: number, opponentScore: number) => {
  add([
    text(`${opponentScore} : ${playerScore}`, {
      size: 24,
    }),
    (origin as any)("center"),
    color(150, 150, 150),
    pos(width() / 2, 80),
  ]);

  add([
    text(playerScore > opponentScore ? "You Won!" : "You Lost!", {
      size: 24,
    }),
    (origin as any)("center"),
    color(150, 150, 150),
    pos(width() / 2, 120),
  ]);

  const btn = add([
    text("Play Again", { size: 48 }),
    pos(width() / 2, height() / 2),
    area({ cursor: "pointer" }),
    (origin as any)("center"),
  ]);

  btn.onClick(() => {
    go("main");
  });
});

go("menu");
