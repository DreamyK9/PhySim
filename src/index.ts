import Interface from "./lib/core";
import { Vec, GameObject } from "./lib/core";
import Settings from "./lib/settings";


// 9 times
for (let i = 1; i < 10; i++) {
  // create new object
  let myObject = new GameObject(new Vec((Settings.WIDTH/10)*i, 100));
  
  // set objects render component
  if (i % 3 === 0) {
    // as a rectangle
    myObject.addComponent(Interface.components.RectRender, false, 50, 100, [20, 200, 99]);
  } else if (i % 2 === 0) {
    // as an ellipse
    myObject.addComponent(Interface.components.EllipseRender, false, 50, 100, [90, 23, 200])
  } else {
    // as a circle
    myObject.addComponent(Interface.components.CircleRender, false, 100, [240, 10, 99]);
  }

  // adding physics body to the object
  myObject.addComponent(Interface.components.RigidBody, false, 100*i);
  // push object to the side
  myObject.components.physicsBody?.addForce(new Vec((-1)**i, 1));

  // add object to the Simulation
  Interface.Objects.push(myObject);
}

console.log(Interface.Objects);
