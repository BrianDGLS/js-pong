import { Ball } from "./ball";
import { GameObject } from "./game-object";
import { clamp } from "./helpers/clamp";

export class Paddle extends GameObject {
  public speed = 2;
  public width = 6;
  public height = 40;
  public color = "#fff";
  public friction = 0.05;

  constructor(public x: number, public y: number) {
    super(x, y);
    this.y = this.y - this.height / 2;
  }

  public render(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
  }

  public moveToBall(ball: Ball): void {
    this.vy = this.y < ball.y ? this.speed : -this.speed;
  }

  public stop(): void {
    this.vy = 0;
  }

  public up(pressed: boolean): void {
    if (pressed) {
      this.vy = -this.speed;
    }
  }

  public down(pressed: boolean): void {
    if (pressed) {
      this.vy = this.speed;
    }
  }

  public update(): void {
    super.update();

    if (this.vy > 0) {
      this.vy -= this.friction;
    }

    if (this.vy < 0) {
      this.vy += this.friction;
    }
  }
}
