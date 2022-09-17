import Interface from "./lib/core";
import { Vec, GameObject } from "./lib/core";
import Settings from "./lib/settings";


for (let i = 1; i < 10; i++) {
  let myObject = new GameObject(new Vec((Settings.WIDTH/10)*i, 100));
  if (i % 2 === 0) {
    myObject.addComponent(Interface.components.RectRender, false, 50, 100, [20, 200, 99]);
  } else if (i % 3) {
    myObject.addComponent(Interface.components.EllipseRender, false, 50, 100, [90, 23, 200])
  } else {
    myObject.addComponent(Interface.components.CircleRender, false, 100, [240, 10, 99]);
  }
  myObject.addComponent(Interface.components.RigidBody, false, 100*i);
  myObject.components.physicsBody?.addForce(new Vec((-1)**i, 1));

  Interface.Objects.push(myObject);
}

console.log(Interface.Objects);
