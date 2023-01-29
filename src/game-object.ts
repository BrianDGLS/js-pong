import { Vector2d } from "./vector";

export abstract class GameObject {
  public color: string;
  public speed: number;

  public velocity: Vector2d;
  public position: Vector2d;

  public abstract update();
  public abstract reset(position: Vector2d);
  public abstract render(context: CanvasRenderingContext2D);
}
