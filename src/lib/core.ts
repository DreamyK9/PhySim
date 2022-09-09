import { Component, CustomComponent } from "./components.js";
import { PhysicsBody, Collider, RenderComponent } from "./components.js";
import { RigidBody, SoftBody } from "./components.js";

// TODO: figure out, why and how importing isn't necessary

// base class with properties every object should have
export abstract class Base {
  constructor() {}

  copy() {
    return Object.assign({}, this);
  }
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

  translate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }
}

// TODO: abstract getting a component from a ComponentList to its own function
class ComponentList extends Base {
  // basic components
  physicsBody: PhysicsBody | undefined;
  collider: Collider | undefined;
  renderComponent: RenderComponent | undefined;

  // list of all basic components
  all: Component[] = [];
  // custom components
  custom: CustomComponent[] = [];

  constructor(components?: Component[]) {
    super();

    if (components) {
      for (let component of components) {
        this.add(component);
      }
    }
  }

  add(component: Component, overwrite = false): boolean {
    if (this.contains(component)) {
      if (overwrite) {
        this.remove(component);
      } else {
        console.error(
          "Tried to add existing component. ACCESS DENIED! Did you mean to overwrite?"
        );
        return false;
      }
    }

    // TODO: add more component types here
    if (component instanceof PhysicsBody) {
      this.physicsBody = component;
    } else if (component instanceof Collider) {
      this.collider = component;
    } else if (component instanceof RenderComponent) {
      this.renderComponent = component;
    } else if (component instanceof CustomComponent) {
      this.custom.push(component);
    } else {
      console.error(
        `Unknown component type: "${component.constructor.name}". If you're trying to add a custom component, use the CustomComponent class.`
        );
      return false;
    }
    return true;
  }

  remove(component: Component | ComponentString): boolean {
    // TODO: check against top component classes instead of every single one
    // ! This is a temporary solution | Error coverage below 100%
    if (!this.contains(component)) {
      console.error("Tried to remove non-existing component. MISSION FAILED!");
      return false;
    }
    
    // convert to string, if necessary, for easier comparison
    let comp =
      typeof component === "string" ? component : classOfStr(component);

    // TODO: add more component types
    // Option 1: Is bascic component
    if (comp === "PhysicsBody") {
      this.physicsBody = undefined;
    } else if (comp === "Collider") {
      this.collider = undefined;
    } else if (comp === "RenderComponent") {
      this.renderComponent = undefined;
    } else if (comp === "CustomComponent") {
      // Option 2: Is custom component
      this.custom = this.custom.filter((c) => c.constructor.name !== component);
    }

    this.all = this.all.filter((c) => c.constructor.name !== comp);
    return true;
  }
 
  contains(component: Component | ComponentString): boolean {
    if (typeof component === "string") {
      return (
        this.all.find((c) => c.constructor.name === component) !== undefined
      );
    } else {
      return (
        this.all.find((c) => c instanceof classOf(component)) !== undefined
      );
    }
  }

  activate(component: Component | ComponentString): boolean {
    if (!this.contains(component)) {
      console.error("Tried to activate non-existing component. MISSION FAILED!");
      return false;
    }

    // convert to string, if necessary, for easier comparison
    let comp =
      typeof component === "string" ? component : classOfStr(component);
    // TODO: activation can also fail, if component is already active
    this.all.find((c) => c.constructor.name === comp)?.activate();
    return true;
  }

  deactivate(component: Component | ComponentString): boolean {
    if (!this.contains(component)) {
      console.error("Tried to deactivate non-existing component. MISSION FAILED!");
      return false;
    }

    // convert to string, if necessary, for easier comparison
    let comp =
      typeof component === "string" ? component : classOfStr(component);
    
    // TODO: deactivation cal also fail, if component is already deactivated
    this.all.find((c) => c.constructor.name === comp)?.deactivate();
    return true;
  }
}

// simple structure, representing all objects in the simulation
// TODO: find a better name for GameObject
export class GameObject extends Base {
  components: ComponentList;
  pos: Vec;

  constructor(pos?: Vec, components?: ComponentList) {
    super();

    this.pos = pos || new Vec(0, 0);
    this.components = components?.copy() || new ComponentList();
  }

  update() {
    this.components.custom.forEach((component) => {
      component.update();
    });
  }

  addComponent(component: Component | ComponentString, overwrite = false) {
    if (typeof component === "string") {
      // TODO: add more component types
      switch (component) {
        case "RigidBody":
          component = new RigidBody(1);
          break;
        case "SoftBody":
          component = new SoftBody();
      }
    }

    // TODO: replace with handling for all component types
    if (typeof component === "object")
      this.components.add(component, overwrite);
  }

  hasComponent(component: Component | ComponentString) {
    return this.components.contains(component);
  }

  activateComponent(component: Component | ComponentString): boolean {
    return this.components.activate(component);
  }
  deactivateComponent(component: Component | ComponentString): boolean {
    return this.components.deactivate(component);
  }
}
