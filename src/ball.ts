import { GameObject } from "./game-object";
import { Vector2d } from "./vector";

export class Ball extends GameObject {
  public speed = 4;
  public radius = 6;
  public color = "white";

  public reset(position: Vector2d) {
    this.position = position;

    const yVelocity = Math.random() > 0.5 ? -this.speed : this.speed;
    this.velocity = new Vector2d(-this.speed, yVelocity);
  }

  public update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  public render(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  public outToLeft(left: number): boolean {
    return this.position.x + this.radius < left;
  }

  public outToRight(right: number): boolean {
    return this.position.x - this.radius > right;
  }

  public hasHitUpperLimits(upperLimit: number): boolean {
    return this.position.y + this.radius > upperLimit;
  }

  public hasHitLowerLimits(lowerLimit: number): boolean {
    return this.position.y - this.radius < lowerLimit;
  }
}
