export interface AppConfig {
  /** Chrome placed at  */
  chromePath: string;
  /** puppeteer target to */
  targetUrl: string;
  /** screenshots saved on */
  screenshotDirectory: string;
  /**Application is located at */
  appDir: string;
  /** Puppeteer will run in Headless Mode */
  headlessMode: boolean;
}
