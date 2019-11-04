import { useEffect, useState } from 'react';

/**
 * Hooks which triggers an effect after a certain delay.
 *
 * @param effect
 *    The effect which is to be executed.
 * @param delay
 *    How long we should wait before executing the effect.
 * @param deps
 *    Dependencies used in the effect to be passed to `useEffect`.
 *
 * @returns
 *    A function which cancels the current timeout and resets it.
 */
export function useTimeout(effect: () => void, delay: number, deps: any[] = []) {
  const [lastTime, setLastTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    const timeout = setTimeout(effect, delay);
    return () => clearTimeout(timeout);
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
    effect,
    delay,
    lastTime,
  ]);

  return () => setLastTime(Date.now);
}
