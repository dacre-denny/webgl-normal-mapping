
let clockLast = Date.now();

export function update() {
  const clockNow = Date.now()

  const dt = (clockNow - clockLast) / 1000.0
  clockLast = clockNow;

  return dt
}