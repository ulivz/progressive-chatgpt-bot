export class Logger {
  private enableDebug: boolean;

  constructor(enableDebug: boolean) {
    this.enableDebug = enableDebug;
  }

  log(...args: unknown[]) {
    console.log(...args);
  }

  debug(...args: unknown[]) {
    if (this.enableDebug) {
      console.log(...args);
    }
  }
}
