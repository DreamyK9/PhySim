import Interface from "./lib/core";
import { Vec, GameObject } from "./lib/core";


for (let i = 1; i < 10; i++) {
  let myObject = new GameObject(new Vec(80*i, 100));
  myObject.addComponent(Interface.components.RigidBody, false, 100*i);
  myObject.addComponent(Interface.components.CircleRender, false, 50);
  myObject.components.physicsBody?.addForce(new Vec((-1)**i, 1));

  Interface.Objects.push(myObject);
}


console.log(Interface.Objects);
