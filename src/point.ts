export class Point {
  public vx = 0
  public vy = 0

  public initialX: number
  public initialY: number

  constructor(public x: number, public y: number) {
    this.initialX = x
    this.initialY = y
  }

  public update(): void {
    this.y += this.vy
    this.x += this.vx
  }

  public reset(): void {
    this.x = this.initialX
    this.y = this.initialY
  }
}