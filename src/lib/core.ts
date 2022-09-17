import * as p5 from "p5";
import Settings from "./settings";
import { Time } from "./misc";

// ! Weird project behavior: global scope is shared across all files, unless exports are used
// ! Files with exports implicitly become modules, and are not accessible from other files
// Defaulting to using exports everywhere


// ******** Game Loop ******** //

const Objects: GameObject[] = [];
const Container = document.getElementById("container") || undefined;

// TODO: add fixed update (to make physics independent of framerate)
export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(Settings.WIDTH, Settings.HEIGHT);
  };

  p.draw = () => {
    Time.increment();
    p.background(Settings.BACKGROUND);
    
    for (const object of Objects) {
      object.update();
    }
  };
};

export const p5Instance = new p5(sketch, Container);


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// **************************************************************************************************** //
// ****************************************** Core Elements ******************************************* //

// base class with properties every object should have
export abstract class Base {
  constructor() {}
}

// Vector
export class Vec extends Base {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vec(this.x, this.y);
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }
  
  translate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  add(vec: Vec) {
    this.x += vec.x;
    this.y += vec.y;
  }

  subtract(origin: Vec): Vec {
    let target = this;
    return new Vec(target.x - origin.x, target.y - origin.y);
  }
}

// TODO: abstract getting a component from a ComponentList to its own function
export class ComponentList extends Base {
  // basic components
  physicsBody: PhysicsBody | undefined;
  collider: Collider | undefined;
  renderComponent: RenderComponent | undefined;

  // list of all basic components
  all: Component[] = [];
  // custom components
  custom: CustomComponent[] = [];

  constructor() {
    super();
  }

  add(component: ComponentClass, overwrite = false, args: any[]): boolean {
    if (this.find(component)) {
      if (!overwrite) {
        console.error(
          "Tried to add existing component. ACCESS DENIED! Did you mean to overwrite?"
        );
        return false;
      }
    }
    
    let c = new component(...args);

    // TODO: add more component types here
    if (c instanceof PhysicsBody) {
      this.physicsBody = c;
    } else if (c instanceof Collider) {
      this.collider = c;
    } else if (c instanceof RenderComponent) {
      this.renderComponent = c;
    // TODO: implement on custom component system rework
    } /* else if (c instanceof CustomComponent) {
      // ! WIP
      this.custom.push(c);
    } */ else {
      console.error(
        `Unknown component type: "${component.constructor.name}". If you're trying to add a custom component, use the CustomComponent class.`
      );
      return false;
    }
    this.all.push(c);
    return true;
  }

  remove(component: ComponentClass): boolean {
    if (!this.find(component)) {
      console.error("Tried to remove non-existing component. MISSION FAILED!");
      return false;
    }

    if (component === PhysicsBody) {
      this.physicsBody = undefined;
    } else if (component === Collider) {
      this.collider = undefined;
    } else if (component === RenderComponent) {
      this.renderComponent = undefined;
    } else if (component === CustomComponent) {
      // TODO: subject to change due to remaking the custom component system
      this.custom.filter((c) => c.constructor !== component);
    }
    // TODO: check if this workds
    this.all.filter((c) => c.constructor !== component);
    return true;
  }

  find(component: ComponentClass): boolean {
    // TODO: find out if this works
    return this.all.find((c) => c.constructor === component) !== undefined;
  }

  activate(component: ComponentClass): boolean {
    if (!this.find(component)) {
      console.error(
        "Tried to activate non-existing component. MISSION FAILED!"
      );
      return false;
    }

    // TODO: activation can also fail, if component is already active
    this.all.find((c) => c.constructor === component)?.activate();
    return true;
  }

  deactivate(component: ComponentClass): boolean {
    if (!this.find(component)) {
      console.error(
        "Tried to deactivate non-existing component. MISSION FAILED!"
      );
      return false;
    }

    // TODO: deactivation can also fail, if component is already deactivated
    this.all.find((c) => c.constructor === component)?.deactivate();
    return true;
  }
}

// simple structure, representing all objects in the simulation
// TODO: find a better name for GameObject
export class GameObject extends Base {
  components: ComponentList;
  pos: Vec;

  constructor(pos: Vec, preset?: ComponentList) {
    super();

    this.pos = pos.clone();
    // ! Warning: this is a shallow copy
    this.components = preset ? preset : new ComponentList();
  }

  update() {
    this.components.all.forEach((component) => {
      component.update(this);
    });
  }

  addComponent(component: ComponentClass, overwrite = false, ...args: any[]): boolean {
    return this.components.add(component, overwrite, args);
  }

  hasComponent(component: ComponentClass): boolean {
    return this.components.find(component);
  }

  activateComponent(component: ComponentClass): boolean {
    return this.components.activate(component);
  }
  deactivateComponent(component: ComponentClass): boolean {
    return this.components.deactivate(component);
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// **************************************************************************************************** //
// ******************************************** Components ******************************************** //

// base class for all components
export abstract class Component extends Base {
  active: boolean = true;

  constructor() {
    super();
  }

  abstract update(user: GameObject): void;

  activate(): boolean {
    if (this.active) {
      console.error("Tried to activate already active component.");
      return false;
    } else {
      this.active = true;
      return true;
    }
  };

  deactivate(): boolean {
    if (this.active) {
      this.active = false;
      return true;
    } else {
      console.error("Tried to deactivate already deactivated component.");
      return false;
    }
  }
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

    update(user: GameObject) {
      this.applyGravity();
      this.upateAcceleration();
      this.updateVelocity();
      user.pos.add(this.v);
      this.F.reset();
    }

    upateAcceleration() {
      this.a.x = this.F.x / this.m;
      this.a.y = this.F.y / this.m;
    }

    updateVelocity() {
      this.v.x += this.a.x * Time.deltaTime;
      this.v.y += this.a.y * Time.deltaTime;
    }

    applyGravity() {
      this.F.y += Settings.Physics.GRAVITY * this.m;
    }

    addForce (force: Vec) {
      this.F.add(force);
    }
  }

  export class RigidBody extends PhysicsBody {
    constructor (mass?: number) {
      super(mass);
    }
  }

  export class SoftBody extends PhysicsBody {
    constructor (mass?: number) {
      super(mass);
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

    update(user: GameObject) {
      // TODO: implement
    }
  }
  export class CircleCollider extends Collider {
    radius?: number = undefined;

    constructor(radius?: number) {
      super();
      this.radius = radius;
    }

    update(user: GameObject) {
      // TODO: implement
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

    update(user: GameObject) {
      // TODO: implement
    }
  }
  export class PolygonCollider extends Collider {
    vertices?: Vec[] = [];

    constructor(vertices?: Vec[]) {
      super();
      this.vertices = vertices;
    }

    update(user: GameObject) {
      // TODO: implement
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
    sprite: p5.Image;

    constructor(sprite?: string | p5.Image) {
      super();

      // create the sprite structure
      if (typeof sprite === "string") {
        this.sprite = p5Instance.loadImage(sprite);
      } else if (sprite instanceof p5.Image) {
        this.sprite = sprite;
      } else {
        // TODO: find better solution for this
        throw new Error("SpriteRender: sprite must be passed as string or p5.Image");
      }
      // load the sprite's pixels into the pixels[] array
      this.sprite.loadPixels();
    }

    update(user: GameObject) {
      // TODO: implement
    }
  }
  export class TextRender extends RenderComponent {
    text: string;

    constructor(text?: string) {
      super();
      if (text) {
        this.text = text;
      } else {
        console.warn("TextRender: text not passed, defaulting to empty string");
        this.text = "";
      }
    }

    set(text: string) {
      this.text = text;
    }

    update(user: GameObject) {
      // TODO: implement
    }
  }


  export abstract class ShapeRender extends RenderComponent {
    abstract color: p5.Color;

    constructor() {
      super();
    }
  }

  export class RectRender extends ShapeRender {
    width: number;
    height: number;
    color: p5.Color;

    constructor(width?: number, height?: number, color?: p5.Color) {
      super();
      if (width && height) {
        this.width = width;
        this.height = height;
      } else {
        console.warn("RectRender: width or height not passed, defaulting to 0");
        this.width = 0;
        this.height = 0;
      }

      if (color) {
        this.color = color;
      } else {
        console.warn("RectRender: color not passed, defaulting to white");
        this.color = p5Instance.color(255);
      }
    }

    update(user: GameObject) {
      p5Instance.fill(this.color);
      p5Instance.rect(
        user.pos.x - this.width / 2, // left
        user.pos.y - this.height / 2, // top
        this.width / 2, // right
        this.height / 2 // bottom
      );
    }
  }
  export class CircleRender extends ShapeRender {
    radius: number;
    color: p5.Color;

    constructor(radius?: number, color?: p5.Color) {
      super();
      if (!radius) {
        console.error("CircleRender: radius not passed, defaulting to 0");
        this.radius = 0;
      } else
        this.radius = radius;

    if (color) {
      this.color = color;
    } else {
      console.warn("CircleRender: color not passed, defaulting to white");
      this.color = p5Instance.color(255);
    }
  }

    update(user: GameObject) {
      p5Instance.fill(this.color);
      p5Instance.circle(user.pos.x, user.pos.y, this.radius);
    }
  }
  export class EllipseRender extends ShapeRender {
    width: number;
    height: number;
    color: p5.Color;

    constructor(width?: number, height?: number, color?: p5.Color) {
      super();
      if (width && height) {
        this.width = width;
        this.height = height;
      } else {
        console.warn("EllipseRender: width or height not passed, defaulting to 0");
        this.width = 0;
        this.height = 0;
      }

      if (color) {
        this.color = color;
      } else {
        console.warn("RectRender: color not passed, defaulting to white");
        this.color = p5Instance.color(255);
      }
    }

    update(user: GameObject) {
      p5Instance.fill(this.color);
      p5Instance.ellipse(user.pos.x, user.pos.y, this.width, this.height);
    }
  }

  // TODO: implement Polygons
  export class PolygonRender extends ShapeRender {
    vertices?: Vec[] = [];
    color: p5.Color;

    constructor(vertices?: Vec[], color?: p5.Color) {
      super();
      this.vertices = vertices;

      if (color) {
        this.color = color;
      } else {
        console.warn("RectRender: color not passed, defaulting to white");
        this.color = p5Instance.color(255);
      }
    }

    update(user: GameObject) {
      p5Instance.fill(this.color);
      // TODO: implement
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// **************************************************************************************************** //
// ****************************************** Default Export ****************************************** //

const Interface = {
  Objects,
  p5: p5Instance,
  sketch,
  components : {
    PhysicsBody,
    RigidBody,
    SoftBody,
    Collider,
    RectangleCollider,
    CircleCollider,
    EllipseCollider,
    PolygonCollider,
    RenderComponent,
    SpriteRender,
    TextRender,
    ShapeRender,
    RectRender,
    CircleRender,
    EllipseRender,
    PolygonRender,
    CustomComponent
  }
};

export default Interface;
