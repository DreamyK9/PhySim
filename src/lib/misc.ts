/*/ String Representations... /*/

// of components

// TODO: add more component types
type ComponentString =
  | PhysicsBodyString
  | ColliderString
  | RenderString
  | "CustomComponent";
  type PhysicsBodyString =
    | "RigidBody"
    | "SoftBody";
  type ColliderString =
    | "CircleCollider"
    | "RectangleCollider"
    | "PolygonCollider"
    | "EllipseCollider";
  type RenderString = 
    | "SpriteRender"
    | "TextRender"
    | ShapeRenderString;
    type ShapeRenderString =
      | "RectRender"
      | "CircleRender"
      | "EllipseRender"
      | "PolygonRender";

/*/ Utility Functions /*/

function classOf(o: Object) {
  return o.constructor;
}

function classOfStr(o: Object) {
  return o.constructor.name;
}

// TODO: finish time class
class Time {
  static time: number = 0;
  static deltaTime: number = 0;
  static frame: number = 0;

  start() {
    Time.time = Date.now();
  }
  increment() {
    if (Time.frame === FPS) {
      // TODO: implement
    }
    Time.deltaTime = Date.now() - Time.time;
    Time.time += Time.deltaTime;
    Time.frame++;
  }
}

function isComponentString(s: string) {
  return (s as ComponentString) !== undefined;
}
