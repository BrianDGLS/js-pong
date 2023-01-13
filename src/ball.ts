import { GameObject } from "./game-object";
import { coinToss } from "./helpers/coin-toss";
import { Vector2D } from "./vector-2d";

export class Ball extends GameObject {
  public speed = 2;
  public color = "#fff";
  public radius = 6;

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  public render(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.x, this.y);

    context.beginPath();
    context.arc(0, 0, this.radius, 2 * Math.PI, 0);
    context.closePath();

    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  public keepInVerticalBounds(screenHeight: number): void {
    if (this.y + this.radius >= screenHeight) {
      this.vy = -this.speed;
    }

    if (this.y - this.radius <= 0) {
      this.vy = this.speed;
    }
  }

  public isHit(centerOfScreen: Vector2D): void {
    const isOnLeft = this.x < centerOfScreen.x;
    this.vx = isOnLeft ? this.speed : -this.speed;
    this.vy = coinToss() ? -this.speed : this.speed;
  }

  public isOutToLeft(): boolean {
    return this.x + this.radius <= 0;
  }

  public isOutToRight(screenWidth: number): boolean {
    return this.x - this.radius >= screenWidth;
  }
}
