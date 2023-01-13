import { Ball } from "../ball"
import { Paddle } from "../paddle"

export function detectCollision(ball: Ball, paddle: Paddle): boolean {
  let testX = ball.point.x
  let testY = ball.point.y

  // which edge is closest?
  if (ball.point.x < paddle.point.x) testX = paddle.point.x      // test left edge
  else if (ball.point.x > paddle.point.x + paddle.width) testX = paddle.point.x + paddle.width   // right edge
  if (ball.point.y < paddle.point.y) testY = paddle.point.y      // top edge
  else if (ball.point.y > paddle.point.y + paddle.height) testY = paddle.point.y + paddle.height   // bottom edge

  // get distance from closest edges
  const distX = ball.point.x - testX
  const distY = ball.point.y - testY
  const distance = Math.sqrt((distX * distX) + (distY * distY))

  // if the distance is less than the radius, collision!
  return distance <= ball.radius
}