import { Ball } from "./ball";
import { Paddle } from "./paddle";

export const coinToss = (): boolean => Math.random() > 0.5;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export function detectCollision(ball: Ball, paddle: Paddle): boolean {
  let testX = ball.position.x;
  let testY = ball.position.y;

  // which edge is closest?
  if (ball.position.x < paddle.position.x)
    testX = paddle.position.x; // test left edge
  else if (ball.position.x > paddle.position.x + paddle.width)
    testX = paddle.position.x + paddle.width; // right edge
  if (ball.position.y < paddle.position.y)
    testY = paddle.position.y; // top edge
  else if (ball.position.y > paddle.position.y + paddle.height)
    testY = paddle.position.y + paddle.height; // bottom edge

  // get distance from closest edges
  const distX = ball.position.x - testX;
  const distY = ball.position.y - testY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  // if the distance is less than the radius, collision!
  return distance <= ball.radius;
}
