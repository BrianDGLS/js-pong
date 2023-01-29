import { View } from "./view";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { Vector2d } from "./vector";

export class Game {
  public inProgress: boolean;

  public playerScore: number;
  public opponentScore: number;

  public playerServe: boolean;
  public opponentServe: boolean;

  public sidePadding = 40;

  constructor(public view: View) {
    this.reset();
  }

  public reset() {
    this.inProgress = true;

    this.playerScore = 0;
    this.opponentScore = 0;

    this.playerServe = false;
    this.opponentServe = true;
  }

  public setServe(ball: Ball) {
    this.playerServe = !this.playerServe;
    this.opponentServe = !this.opponentServe;

    ball.velocity.x = this.playerServe ? ball.speed : -ball.speed;
  }

  public hasWinner(winningScore: number): boolean {
    const { playerScore, opponentScore: computerScore } = this;
    return playerScore === winningScore || computerScore === winningScore;
  }

  public setBallStartPosition(ball: Ball) {
    ball.reset(
      new Vector2d(
        this.view.width / 2,
        Math.min(Math.random() * this.view.height)
      )
    );
  }

  public setPlayerStartPosition(player: Paddle) {
    player.reset(
      new Vector2d(
        this.view.width - this.sidePadding,
        this.view.height / 2 - player.height / 2
      )
    );
  }

  public setOpponentStartPosition(opponent: Paddle) {
    opponent.reset(
      new Vector2d(this.sidePadding, this.view.height / 2 - opponent.height / 2)
    );
  }
}
