export class Lazy<T> {
  private computed: boolean = false;
  private value?: T;

  constructor(private readonly func: () => T){}

  get(): T {
    if (!this.computed) {
      this.value = this.func();
      this.computed = true;
    }
    return this.value!;
  }
}
