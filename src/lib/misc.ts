import Settings from "./settings";

/*/ Utility Functions /*/

export function classOf(o: Object) {
  return o.constructor;
}

export function classOfStr(o: Object) {
  return o.constructor.name;
}

export class Time {
  static time: number = Date.now();
  static deltaTime: number = 0;
  static frame: number = 0;

  static increment() {
    if (Time.frame === Settings.FPS) {
      Time.frame = 0;
    }

    Time.deltaTime = Date.now() - Time.time;
    Time.time = Date.now();
    Time.frame++;
  }
}
