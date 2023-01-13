import { Vector2D } from "./vector-2d";

export class GameObject extends Vector2D {
  public initialX: number;
  public initialY: number;

  constructor(public x: number, public y: number) {
    super(x, y);
    this.initialX = x;
    this.initialY = y;
  }

  public update(): void {
    this.y += this.vy;
    this.x += this.vx;
  }

  public reset(): void {
    this.x = this.initialX;
    this.y = this.initialY;
  }
}
