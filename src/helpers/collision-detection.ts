import { Ball } from "../ball"
import { Paddle } from "../paddle"

export function detectCollision(ball: Ball, paddle: Paddle): boolean {
  let testX = ball.x
  let testY = ball.y

  // which edge is closest?
  if (ball.x < paddle.x) testX = paddle.x      // test left edge
  else if (ball.x > paddle.x + paddle.width) testX = paddle.x + paddle.width   // right edge
  if (ball.y < paddle.y) testY = paddle.y      // top edge
  else if (ball.y > paddle.y + paddle.height) testY = paddle.y + paddle.height   // bottom edge

  // get distance from closest edges
  const distX = ball.x - testX
  const distY = ball.y - testY
  const distance = Math.sqrt((distX * distX) + (distY * distY))

  // if the distance is less than the radius, collision!
  return distance <= ball.radius
}
