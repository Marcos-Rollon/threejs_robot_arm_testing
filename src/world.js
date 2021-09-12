import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { debug } from "./globals"
import { ShapeCreator } from "./shape_creator"

class World {

    /**
     * 
     * @param {Function} [params.update] Function that runs to update the world.
     * @param {boolean} [params.withOrbitControls = true] Create an orbit camera.
     * @param {boolean} [params.createWorldAxis = false] Add a world axis on creation.
     * @param {boolean} [params.createGridFloor = true] Add a grid floor on creation
     */
    constructor({ update = null, withOrbitControls = true, createWolrdAxis = false, createGridFloor = true } = {}) {
        this._debug("Init")
        this._scene = new THREE.Scene();
        this._initLights();
        this._setupCamera();
        this._setupRenderer();
        if (withOrbitControls) this._control = new OrbitControls(this._camera, this._renderer.domElement);
        createGridFloor && this.createGridFloor();
        createWolrdAxis && this.createWolrdAxis();
        this._onUpdate = update;
        this._startAnimationLoop();
        this._debug("Setup done!");
    }
    /**
     * Starts the lighting in the world. Maybe add params
     */
    _initLights() {
        this._ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this._directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        this._directionalLight.position.set(10, 20, 10);
        this.add3DObjects(this._ambientLight, this._directionalLight);

        this._debug("Lights setup done!")
    }

    _setupCamera() {
        const aspectRatio = window.innerHeight / window.innerWidth;
        this._camera = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 1000);
        this._camera.position.set(10, 10, 10);
        this._camera.lookAt(0, 0, 0);

        this._debug("Camera setup done!")
    }

    _setupRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias: true })
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);
        this._debug("Renderer setup done!")
    }

    _startAnimationLoop() {
        this._renderer.setAnimationLoop(() => this._animate())
    }

    _animate() {
        if (this._onUpdate != null && this._onUpdate != undefined && this._onUpdate instanceof Function) this._onUpdate();
        this._control.update();
        this._renderer.render(this._scene, this._camera);
    }

    /**
     * Wrapper to make debug a bit more beautiful and useful
     * @param {...any} args
     */
    _debug(...args) {
        const betterArgs = args.map(e => "[World] " + e);
        debug(...betterArgs);
    }

    // ############## PUBLIC API ##############

    /**
     * Adds multiple `Object3D` objects
     * @param  {...THREE.Object3D} objets 
     */
    add3DObjects(...objets) {
        objets.forEach(object => this.add(object))
    }

    add(object) {
        this._scene.add(object);
    }

    forceRender() {
        this._renderer.render(this._scene, this._camera);
    }
    /**
     * Generates a RGB -> XYZ world grid center on the origin.
     * @param {Object} [params] - Optional configuration params.
     * @param {boolean} [params.withArrows = false] - Shows arrows on the axis.
     * @param {boolean} [params.showNegativeLines = true] - Shows the negative part of the axis.
     * @param {number} [params.axisSize = 100] - Size to extend the grid to
     */
    createWolrdAxis({ withArrows = false, showNegativeLines = true, axisSize = 50 } = {}) {
        const axisMesh = new THREE.Group();
        const origin = { x: 0, y: 0, z: 0 }
        if (withArrows) axisMesh.add(this.createOriginPoint());
        axisMesh.add(ShapeCreator.createStraightLine(origin, { x: axisSize, y: 0, z: 0 }, { color: 0xff0000 }));
        axisMesh.add(ShapeCreator.createStraightLine(origin, { x: 0, y: axisSize, z: 0 }, { color: 0x00ff00 }));
        axisMesh.add(ShapeCreator.createStraightLine(origin, { x: 0, y: 0, z: axisSize }, { color: 0x0000ff }));
        if (showNegativeLines) {
            axisMesh.add(ShapeCreator.createStraightLine(origin, { x: -axisSize, y: 0, z: 0 }, { color: 0xff0000, dashed: true }));
            axisMesh.add(ShapeCreator.createStraightLine(origin, { x: 0, y: -axisSize, z: 0 }, { color: 0x00ff00, dashed: true }));
            axisMesh.add(ShapeCreator.createStraightLine(origin, { x: 0, y: 0, z: -axisSize }, { color: 0x0000ff, dashed: true }));
        }
        this.add(axisMesh)

    }

    createOriginPoint() {
        const axisMesh = new THREE.Group();
        axisMesh.add(ShapeCreator.createArrow(new THREE.Vector3(0, 1, 0), { color: 0x00ff00 }));
        axisMesh.add(ShapeCreator.createArrow(new THREE.Vector3(0, 0, 1), { color: 0x0000ff }));
        axisMesh.add(ShapeCreator.createArrow(new THREE.Vector3(1, 0, 0), { color: 0xff0000 }));
        axisMesh.add(ShapeCreator.createSphere(.05, { withBorders: false }))
        this.add(axisMesh);
    }

    createGridFloor({ size = 100, divisions = 100 } = {}) {
        const gridHelper = new THREE.GridHelper(size, divisions);
        this.add(gridHelper);
    }
}

export { World };