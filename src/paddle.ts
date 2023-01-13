import { Ball } from "./ball"
import { Point } from "./point"

export class Paddle {
  public color = '#fff'
  public speed = 2

  constructor(
    public point: Point,
    public width: number,
    public height: number
  ) { }

  public render(context: CanvasRenderingContext2D): void {
    context.save()
    context.translate(this.point.x, this.point.y)
    context.fillStyle = this.color
    context.fillRect(0, 0, this.width, this.height)
    context.restore()
  }

  public moveToBall(ball: Ball): void {
    this.point.vy = this.point.y < ball.point.y ? this.speed : -this.speed
  }

  public stop(): void {
    this.point.vy = 0
  }
}