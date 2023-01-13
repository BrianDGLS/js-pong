import { Point } from "./point"
import { coinToss } from "./helpers/coin-toss"

export class Ball {
  public speed = 2
  public color = '#fff'

  constructor(public point: Point, public radius: number) { }

  public render(context: CanvasRenderingContext2D): void {
    context.save()
    context.translate(this.point.x, this.point.y)

    context.beginPath()
    context.arc(0, 0, this.radius, 2 * Math.PI, 0)
    context.closePath()

    context.fillStyle = this.color
    context.fill()
    context.restore()
  }

  public keepInVerticalBounds(screenHeight: number): void {
    if (this.point.y + this.radius >= screenHeight) {
      this.point.vy = -this.speed
    }

    if (this.point.y - this.radius <= 0) {
      this.point.vy = this.speed
    }
  }

  public isHit(centerOfScreen: Point, point: Point): void {
    const isOnLeft = point.x < centerOfScreen.x
    this.point.vx = isOnLeft ? this.speed : -this.speed
    this.point.vy = coinToss() ? -this.speed : this.speed
  }

  public isOutToLeft(): boolean {
    return this.point.x + this.radius <= 0
  }

  public isOutToRight(screenWidth: number): boolean {
    return this.point.x - this.radius >= screenWidth
  }
}