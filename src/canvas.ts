import { View } from "./view";

export class Canvas {
  private $canvas = document.createElement("canvas");

  constructor(
    public $parent: HTMLElement,
    public dimensions: View
  ) {
    $parent.appendChild(this.$canvas);
    this.setSize(dimensions);
  }

  public get2dContext(): CanvasRenderingContext2D {
    return this.$canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  public setSize({ width, height }: View) {
    this.$canvas.width = width;
    this.$canvas.height = height;
  }
}
