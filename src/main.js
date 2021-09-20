import { World } from "./world";
import { Robot } from "./robot";
import Main from "./ui/Main.svelte";

const world = new World({ update: animate })
const robot = new Robot();
world.add(robot.mesh);


// UI CONFIG

const ui = new Main({target: document.body, props: {
    onChanged: uiChanges
}});

function uiChanges(baseObjetive, midObjetive, upObjetive){
    robot.setBaseRotation(degToRad(baseObjetive));
    robot.setMidArmRotation(degToRad(midObjetive));
    robot.setUpArmRotation(degToRad(upObjetive));
}

function animate() {
    robot.update();
}

function degToRad(deg){
    return deg * (Math.PI / 180.0);
}