export class Servo {
  static ofId(id: number) {
    return new Servo(id);
  }

  private constructor(
    readonly id: number
  ) { }
}
