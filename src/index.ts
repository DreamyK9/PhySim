import * as p5 from "p5";

const Objects = [];
const Container = document.getElementById("container");

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(220);
    p.ellipse(p.mouseX, p.mouseY, 20, 20);
  };
};

export const myp5 = new p5(sketch);
