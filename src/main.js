import { World } from "./world";
import { ShapeCreator } from "./shape_creator";
import { Robot } from "./robot";

const world = new World({ update: animate })
world.createOriginPoint();
const robot = new Robot();
world.add(robot.mesh)



window.addEventListener("click", (ev) => {
    ev.preventDefault();
    //robot.setBaseRotation(Math.PI / 2)
})


function animate() {
    robot.update();
}