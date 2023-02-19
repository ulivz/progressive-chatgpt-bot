export function throttle<T extends(...args: any[]) => unknown>(cb: T, delay: number) {
  let wait = false;
  let storedArgs: null | Parameters<T> = null;

  function checkStoredArgs() {
    if (storedArgs == null) {
      wait = false;
    } else {
      cb(...storedArgs);
      storedArgs = null;
      setTimeout(checkStoredArgs, delay);
    }
  }

  return (...args: Parameters<T>) => {
    if (wait) {
      storedArgs = args;
      return;
    }

    cb(...args);
    wait = true;
    setTimeout(checkStoredArgs, delay);
  };
}
