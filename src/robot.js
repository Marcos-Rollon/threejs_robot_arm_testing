import * as THREE from "three"
import { ShapeCreator } from "./shape_creator"
import { debug } from "./globals"

const DIMENSIONS = {
    baseSize: 2,
    baseHeight: 2,
    midArmLenght: 6,
    midArmWidth: 1,
    midArmDepth: 1,
    upArmLenght: 6,
    upArmWidth: 1,
    upArmDepth: 1,
    gripperBaseRadius: .5,
    gripperBaseDepth: .2,
    gripperRadius: .2,
    gripperLenght: 1.1,
}
const SPEED = {
    baseSpeed : 0.03,
    midArmSpeed : 0.01,
    upArmSpeed: 0.01,
    gripperSpeed: 0.03,
}

const COLORS = {
    baseColor: 0xebb45b,
    upArmColor: 0x57ad00,
}

class Robot {
    constructor({x = 0, y = 0, z = 0} ={}) {
        this._mesh = new THREE.Group();
        this._initialPosition = {x, y, z};
        this._EQUALITY_THRESHOLD = .01;
        this._baseRotationObjetive = 0;
        this._midArmRotationObjective = 0;
        this._upArmRotationObjetive = 0;
        this._gripperRotationObjetive = 0;

        this._createMesh();
    }

    _createMesh() {
        this._base = ShapeCreator.createCylinder(DIMENSIONS.baseSize, DIMENSIONS.baseSize, DIMENSIONS.baseHeight, { color: COLORS.baseColor, radialSegments: 40});
        this._base.position.set(0, 0, 0)
        this._createMidArm();
        this._base.add(this._midArm);
        this._createUpArm();
        this._midArmAxis.add(this._upArm);
        this._createGripper();
        this._upArmAxis.add(this._gripperBase);

        this._mesh.add(this._base);

        // Move the mesh on top of the xz plane instead of in the center
        this._mesh.position.set(this._initialPosition.x, this._initialPosition.y + DIMENSIONS.baseHeight / 2, this._initialPosition.z + 0);
    }

    _createMidArm(){
        // _midArm is the container
        this._midArm = new THREE.Group();
        // % of extra height that the axis of rotation will have in regars of the height of the mid Arm
        const axisExtraHeight = DIMENSIONS.midArmLenght * 0.05; // 5% of arm height
        // Line to visualize the axis
        const origin = new THREE.Vector3(0, 0, -DIMENSIONS.midArmWidth * 1.3);
        const destination = new THREE.Vector3(0, 0, DIMENSIONS.midArmWidth * 1.3);
        this._midArmAxis = ShapeCreator.createStraightLine(
            {x:origin.x, y:origin.y, z:origin.z},
            {x:destination.x, y:destination.y, z: destination.z},
        );
        this._midArmAxis.position.y += axisExtraHeight;
        // The arm itself
        const arm = ShapeCreator.createBox(
            0,
            DIMENSIONS.midArmLenght / 2 - axisExtraHeight,
            0,
            DIMENSIONS.midArmWidth,
            DIMENSIONS.midArmLenght,
            DIMENSIONS.midArmDepth, 
            { color: COLORS.baseColor }
        );
        // Add the axis to the container
        this._midArm.add(this._midArmAxis);
        // Add the arm to the axis
        this._midArmAxis.add(arm);
        //this._midArm.add(ShapeCreator.createOriginPoint())
        // Move the container up to be on top of the base
        this._midArm.position.set(0, DIMENSIONS.baseHeight/2, 0);
    }
    
    _createUpArm(){
        this._upArm = new THREE.Group();
        const axisDeviation = 0.1 * DIMENSIONS.upArmLenght;
        const overlapingFactor = 0.2; //% of the height that overlaps with the mid arm
        const origin = new THREE.Vector3(0, 0, -DIMENSIONS.upArmWidth * 1.3);
        const destination = new THREE.Vector3(0, 0, DIMENSIONS.upArmWidth * 1.3);
        this._upArmAxis = ShapeCreator.createStraightLine(
            {x:origin.x, y:origin.y, z:origin.z},
            {x:destination.x, y:destination.y, z: destination.z},
            );
            
        // The arm itself
        const arm = ShapeCreator.createBox(
            0,
            DIMENSIONS.upArmLenght / 2,
            0,
            DIMENSIONS.upArmWidth,
            DIMENSIONS.upArmLenght,
            DIMENSIONS.upArmDepth, 
            { color: COLORS.upArmColor }
        );
        // Add the axis to the container
        this._upArm.add(this._upArmAxis);
        // Add the arm to the axis
        this._upArmAxis.add(arm);
        arm.position.y += -DIMENSIONS.upArmLenght * overlapingFactor + axisDeviation;
        
        // Move the container up to be on top of the mid Arm
        this._upArm.position.set(
            0, 
            DIMENSIONS.midArmLenght - axisDeviation,
            -DIMENSIONS.midArmWidth
        );
    }

    _createGripper(){
        this._gripperBase = ShapeCreator.createCylinder(DIMENSIONS.gripperBaseRadius, DIMENSIONS.gripperBaseRadius, DIMENSIONS.gripperBaseDepth);
        this._gripper = ShapeCreator.createCylinder(DIMENSIONS.gripperRadius, DIMENSIONS.gripperRadius, DIMENSIONS.gripperLenght);
        this._gripperBase.add(this._gripper);
        // put gripper on top of base
        this._gripper.position.y += DIMENSIONS.gripperBaseDepth + DIMENSIONS.gripperLenght/2;
        // Put gripper base on top of upArm (add the lenght and the axis deviation)
        this._gripperBase.position.y += DIMENSIONS.upArmLenght - 0.1* DIMENSIONS.upArmLenght;
    }

    /**
     * Wrapper to make debug a bit more beautiful and useful
     * @param {...any} args
     */
    _debug(...args) {
        const betterArgs = args.map(e => "[Robot] " + e);
        debug(...betterArgs);
    }

    // PUBLIC API

    get mesh() { return this._mesh };

    setMidArmRotation(rotation) {
        if(rotation > 1.223 || rotation < -1.223) return; // 70 degs as maximum 
        this._midArmRotationObjective = rotation;
    }
    setBaseRotation(rotation) {
        this._baseRotationObjetive = rotation;
    }
    setUpArmRotation(rotation){
        this._upArmRotationObjetive = rotation;
    }
    setGripperRotation(rotation){
        this._gripperRotationObjetive = rotation;
    }

    resetPosition(){
        this._baseRotationObjetive = 0;
        this._midArmRotationObjective = 0;
        this._upArmRotationObjetive = 0;
        this._gripperRotationObjetive = 0;
    }

    update() {
        //this._upArmAxis.rotation.z += SPEED.upArmSpeed;

        if (Math.abs(this._midArmAxis.rotation.z - this._midArmRotationObjective) > this._EQUALITY_THRESHOLD) {
            if(this._midArmAxis.rotation.z > this._midArmRotationObjective){
                this._midArmAxis.rotation.z -= SPEED.midArmSpeed;
            }else{
                this._midArmAxis.rotation.z += SPEED.midArmSpeed;
            }
        }
        if (Math.abs(this._base.rotation.y - this._baseRotationObjetive) > this._EQUALITY_THRESHOLD) {
            if(this._base.rotation.y > this._baseRotationObjetive){
                this._base.rotation.y -= SPEED.baseSpeed;
            }else{
                this._base.rotation.y += SPEED.baseSpeed;
            }
        }
        if (Math.abs(this._upArmAxis.rotation.z - this._upArmRotationObjetive) > this._EQUALITY_THRESHOLD) {
            if(this._upArmAxis.rotation.z > this._upArmRotationObjetive){
                this._upArmAxis.rotation.z -= SPEED.upArmSpeed;
            }else{
                this._upArmAxis.rotation.z += SPEED.upArmSpeed;
            }
        }
        // const gripperDif = this._gripperBase.rotation.y - this._gripperRotationObjetive;
        // console.log(gripperDif)
        // if(Math.abs(gripperDif) > this._EQUALITY_THRESHOLD){
        //     this._gripperBase.rotation.y += (gripperDif > 0) ? SPEED.gripperSpeed : -SPEED.gripperSpeed;
        // }

    }

}

export { Robot };