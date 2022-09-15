// ! currently v.3.0 is in place, using the 'typeof <class>' syntax

/* Component Type Passing Model (CTPM) */

/* v.1.0 */ {
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
    | "CircleRender"
    | "RectRender"
    | "EllipseRender"
    | "PolygonRender";
}

/* v.2.0 */ {
  interface ComponentID {
    level: number;
    abstract: boolean;
    mother: any;
    class: any;
  }

  const PHYSICSBODY: ComponentID = {
    level: 0,
    abstract: true,
    class: PhysicsBody,
    mother: PhysicsBody
  }
    const RIGIDBODY: ComponentID = {
      level: 1,
      abstract: false,
      class: RigidBody,
      mother: PhysicsBody
    }
    const SOFTBODY: ComponentID = {
      level: 1,
      abstract: false,
      class: SoftBody,
      mother: PhysicsBody
    }
  const COLLIDER: ComponentID = {
    level: 0,
    abstract: true,
    class: Collider,
    mother: Collider
  }
    const RECTANGLECOLLIDER: ComponentID = {
      level: 1,
      abstract: false,
      class: RectangleCollider,
      mother: Collider
    }
    const CIRCLECOLLIDER: ComponentID = {
      level: 1,
      abstract: false,
      class: CircleCollider,
      mother: Collider
    }
    const ELLIPSECOLLIDER: ComponentID = {
      level: 1,
      abstract: false,
      class: EllipseCollider,
      mother: Collider
    }
    const POLYGONCOLLIDER: ComponentID = {
      level: 1,
      abstract: false,
      class: PolygonCollider,
      mother: Collider
    }
  const RENDER: ComponentID = {
    level: 0,
    abstract: true,
    class: RenderComponent,
    mother: RenderComponent
  }
    const SPRITERENDER: ComponentID = {
      level: 1,
      abstract: false,
      class: SpriteRender,
      mother: RenderComponent
    }
    const TEXTRENDER: ComponentID = {
      level: 1,
      abstract: false,
      class: TextRender,
      mother: RenderComponent
    }
    const SHAPERENDER: ComponentID = {
      level: 1,
      abstract: true,
      class: ShapeRender,
      mother: RenderComponent
    }
      const RECTRENDER: ComponentID = {
        level: 2,
        abstract: false,
        class: RectRender,
        mother: RenderComponent
      }
      const CIRCLERENDER: ComponentID = {
        level: 2,
        abstract: false,
        class: CircleRender,
        mother: RenderComponent
      }
      const ELLIPSERENDER: ComponentID = {
        level: 2,
        abstract: false,
        class: EllipseRender,
        mother: RenderComponent
      }
      const POLYGONRENDER: ComponentID = {
        level: 2,
        abstract: false,
        class: PolygonRender,
        mother: RenderComponent
      }
  // TODO: make custom component handling more flexible
  const CUSTOM: ComponentID = {
    level: 0,
    abstract: false,
    class: CustomComponent,
    mother: CustomComponent
  }
}