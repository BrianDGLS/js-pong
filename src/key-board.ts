export const KEYS = { ArrowUp: false, ArrowDown: false };

function keyHandler(pressed: boolean) {
  return (event: KeyboardEvent): void => {
    KEYS[event.key] = pressed;
  };
}

document.addEventListener("keydown", keyHandler(true), false);
document.addEventListener("keyup", keyHandler(false), false);
