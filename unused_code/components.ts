// ! Merged into core.ts to avoid circular dependencies

import { Base, Vec, myp5 } from "./core";
import { Time } from "./misc";

// base class for all components
export abstract class Component extends Base {
  constructor() {
    super();
  }

  /* abstract */ update(pos?: Vec): void {};
  /* abstract */ activate(): void {};
  /* abstract */  deactivate(): void {};
}

/*
 * PhysicsBody
 * * RigidBody
 * * SoftBody
 * Collider
 * * Ellipse Collider
 * * Circle Collider
 * * Rect Collider
 * * Polygon Collider
 * RenderComponent
 * * SpriteRender
 * * TextRender
 * * ShapeRender
 * * * RectRender
 * * * CircleRender
 * * * EllipseRender
 * * * PolygonRender
 * CustomComponent
 */

// hirarchy for component types
export type ComponentClass = PhysicsBodyClass | ColliderClass | RenderClass /* | CustomComponentClass*/;
export type PhysicsBodyClass = typeof RigidBody | typeof SoftBody;
export type ColliderClass = typeof CircleCollider | typeof RectangleCollider | typeof PolygonCollider | typeof EllipseCollider;
export type RenderClass = typeof SpriteRender | typeof TextRender | ShapeRenderClass;
export type ShapeRenderClass = typeof CircleRender | typeof RectRender | typeof EllipseRender | typeof PolygonRender;
// type CustomComponentClass = typeof CustomComponent;


// TODO: add more components

/*/ Physical Components /*/

// component for physical interaction
export abstract class PhysicsBody extends Component {
  static mother = this;

  constructor() {
    super();
  }
}

export class RigidBody extends PhysicsBody {
  // v: Velocity
  v: Vec;
  // a: Acceleration
  a: Vec;
  // F: Force
  F: Vec;
  // m: Mass
  m: number = 1;

  constructor(mass?: number) {
    super();

    this.v = new Vec(0, 0);
    this.a = new Vec(0, 0);
    this.F = new Vec(0, 0);
    this.m = mass? mass : 1;
  }

  update() {
    this.upateAcceleration();
    this.updateVelocity();
  }

  upateAcceleration() {
    this.a.x = this.F.x / this.m;
    this.a.y = this.F.y / this.m;
  }

  updateVelocity() {
    this.v.x += this.a.x * Time.deltaTime;
    this.v.y += this.a.y * Time.deltaTime;
  }
}

export class SoftBody extends PhysicsBody {
  constructor() {
    super();
  }
}

// collision checking
export abstract class Collider extends Component {
  static mother = this;

  constructor() {
    super();
  }
}

export class RectangleCollider extends Collider {
  width?: number = undefined;
  height?: number = undefined;

  constructor(width?: number, height?: number) {
    super();
    this.width = width;
    this.height = height;
  }
}
export class CircleCollider extends Collider {
  radius?: number = undefined;

  constructor(radius?: number) {
    super();
    this.radius = radius;
  }
}
export class EllipseCollider extends Collider {
  width?: number = undefined;
  height?: number = undefined;

  constructor(width?: number, height?: number) {
    super();
    this.width = width;
    this.height = height;
  }
}
export class PolygonCollider extends Collider {
  vertices?: Vec[] = [];

  constructor(vertices?: Vec[]) {
    super();
    this.vertices = vertices;
  }
}

/*/ Graphical Components /*/

export abstract class RenderComponent extends Component {
  static mother = this;

  constructor() {
    super();
  }
}

export class SpriteRender extends RenderComponent {
  sprite?: undefined = undefined;

  constructor(sprite?: undefined) {
    super();
    this.sprite = sprite;
  }
}
export class TextRender extends RenderComponent {
  text?: string = undefined;

  constructor(text?: string) {
    super();
    this.text = text;
  }
}


export abstract class ShapeRender extends RenderComponent {
  constructor() {
    super();
  }
}

export class RectRender extends ShapeRender {
  width?: number = undefined;
  height?: number = undefined;

  constructor(width?: number, height?: number) {
    super();
    this.width = width;
    this.height = height;
  }

  init(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  update(pos: Vec) {
    myp5.rect(pos.x, pos.y, this.width? this.width : 0, this.height? this.height : 0);
  }
}
export class CircleRender extends ShapeRender {
  radius?: number = undefined;

  constructor(radius?: number) {
    super();
    this.radius = radius;
  }
}
export class EllipseRender extends ShapeRender {
  width?: number = undefined;
  height?: number = undefined;

  constructor(width?: number, height?: number) {
    super();
    this.width = width;
    this.height = height;
  }
}
export class PolygonRender extends ShapeRender {
  vertices?: Vec[] = [];

  constructor(vertices?: Vec[]) {
    super();
    this.vertices = vertices;
  }
}

/*/ Input Components /*/

// TODO: add input components

/* Custom Components */

export abstract class CustomComponent extends Component {
  static mother = this;
  constructor() {
    super();
  }
}
