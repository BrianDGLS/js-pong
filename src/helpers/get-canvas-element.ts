export function getCanvasElement(width: number, height: number): HTMLCanvasElement {
  const $canvas = document.createElement('canvas')
  $canvas.height = height
  $canvas.width = width
  document.body.appendChild($canvas)
  return $canvas
}
