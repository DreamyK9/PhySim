import { Base, Vec } from "./core.js";

// base class for all components
export abstract class Component extends Base {
  constructor() {
    super();
  }

  update() {}
  activate() {}
  deactivate() {}
}

/*
 * PhysicsBody
 * * RigidBody
 * * SoftBody
 * Render
 * * SpriteRender
 * * TextRender
 * * ShapeRender
 * * * RectRender
 * * * CircleRender
 * * * EllipseRender
 * * * PolygonRender
 * Collider
 * * Ellipse Collider
 * * Circle Collider
 * * Rect Collider
 * * Polygon Collider
 */

/*/ Physical Components /*/

// component for physical interaction
export abstract class PhysicsBody extends Component {
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
  m: number;

  constructor(mass: number) {
    super();

    this.v = new Vec(0, 0);
    this.a = new Vec(0, 0);
    this.F = new Vec(0, 0);
    this.m = mass;
  }

  update() {
    this.upateAcceleration();
    this.updateVelocity();
  }

  upateAcceleration() {
    this.a.x = this.F.x / this.m;
    this.a.y = this.F.y / this.m;
  }

  // dt: Delta Time
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


export abstract class Collider extends Component {
  constructor() {
    super();
  }
}


/*/ Graphical Components /*/

export abstract class RenderComponent extends Component {
  constructor() {
    super();
  }
}


/*/ Input Components /*/


/* Custom Components */

export abstract class CustomComponent extends Component {
  constructor() {
    super();
  }
}
