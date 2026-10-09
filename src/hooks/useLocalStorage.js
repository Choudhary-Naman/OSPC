import { useCallback, useState } from 'react';

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** useState that persists to localStorage; survives private mode / blocked storage gracefully. */
export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          if (resolved === undefined) window.localStorage.removeItem(key);
          else window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage unavailable — keep in memory only */
        }
        return resolved;
      });
    },
    [key]
  );
  return [value, set];
}
