import { clamp } from "./helpers";
import { Vector2d } from "./vector";
import { GameObject } from "./game-object";

export class Paddle extends GameObject {
  public width = 6;
  public height = 50;

  public speed = 4;
  public color = "white";

  public friction = 0;

  public velocity = new Vector2d(0, 0);

  public update() {
    const { velocity, friction, speed } = this;
    this.position.y += this.velocity.y;

    if (velocity.y) {
      this.velocity.y = clamp(velocity.y - friction, 0, speed);
    }
  }

  public reset(position: Vector2d) {
    this.position = position;
    this.velocity = new Vector2d(0, 0);
  }

  public render(context: CanvasRenderingContext2D) {
    context.save();
    context.fillStyle = this.color;
    context.translate(this.position.x, this.position.y);
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
  }
}
