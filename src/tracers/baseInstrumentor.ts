import { Hook, OnRequireFn } from "require-in-the-middle";
/**
 * Base class to instrument a module
 *
 */
export class BaseInstrumentor {
  // TODO: This only works for Commonjs modules. For ESM modules, we need to use the import-in-the-middle package
  private _hook: Hook;
  moduleName: string;
  onRequireFn: OnRequireFn;
  /**
   *
   * @param moduleName name of the module to instrument
   * @param onRequireFn what to do when the module is required
   */
  constructor(moduleName: string, onRequireFn: OnRequireFn) {
    this.moduleName = moduleName;
    this.onRequireFn = onRequireFn;
  }
  /**
   * It will apply the changes mmentioned in onRequireFn to the module mentioned in moduleName
   */
  instrument(): void {
    console.log(`Instrumenting ${this.moduleName}`);
    this._hook = new Hook(
      [this.moduleName],
      { internals: true },
      this.onRequireFn
    );
  }
}
