import * as THREE from "three"
import { ShapeCreator } from "./shape_creator"
import { debug } from "./globals"

const DIMENSIONS = {
    baseSize: 2,
    baseHeight: 2,
    midArmLenght: 6,
    midArmWith: 1,
    midArmDepth: 1,
    upArmLenght: 4,
    upArmWidth: 1,
    upArmLenght: 1,
}

const COLORS = {
    baseColor: 0xebb45b,
}

class Robot {
    constructor() {
        this._mesh = new THREE.Group();
        this._SPEED = 0.01;
        this._baseRotationObjetive = 0;
        this._midArmRotationObjective = 0;

        this._createMesh();
    }

    _createMesh() {
        this._base = ShapeCreator.createCylinder(DIMENSIONS.baseSize, DIMENSIONS.baseSize, DIMENSIONS.baseHeight, { color: COLORS.baseColor, radialSegments: 40 });
        this._base.position.set(0, 0, 0)
        this._midArm = ShapeCreator.createBox(
            0,
            DIMENSIONS.baseHeight / 2 + DIMENSIONS.midArmLenght / 2 + 0.01, // 0.01 just for it to render the bottom line border
            0,
            DIMENSIONS.midArmWith,
            DIMENSIONS.midArmLenght,
            DIMENSIONS.midArmDepth, { color: COLORS.baseColor }
        );
        this._base.add(this._midArm);

        this._addToMesh(this._base);
        this._addToMesh(ShapeCreator.createOriginPoint())

        // Move the mesh on top of the xz plane instead of in the center
        this._mesh.position.set(0, DIMENSIONS.baseHeight / 2, 0)
    }

    _addToMesh(object) {
        this._mesh.add(object)
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
        this._midArmRotationObjective = rotation;
    }
    setBaseRotation(rotation) {
        this._baseRotationObjetive = rotation;
    }

    update() {

        if (this._midArm.rotation.z != this._midArmRotationObjective) {
            this._midArm.rotation.z += 0.01
        }
        if (this._base.rotation.y != this._baseRotationObjetive) {
            this._base.rotation.y += 0.01
        }
    }

}

export { Robot };