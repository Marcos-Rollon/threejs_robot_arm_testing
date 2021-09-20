import * as THREE from "three"
class ShapeCreator {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} depth 
     * @param {{color : number, withBorders: boolean, borderColor: number, wireframe : boolean}} options 
     * @returns {THREE.Mesh}
     */
    static createBox(x, y, z, width, height, depth, { color = 0xcacaca, withBorders = true, borderColor = 0x000000 , wireframe = false} = {}) {
        const mesh = new THREE.Group();
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshLambertMaterial({ color, wireframe });
        const cube = new THREE.Mesh(geometry, material);
        mesh.add(cube);
        if (withBorders) {
            const edges = new THREE.EdgesGeometry(geometry)
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: borderColor }))
            mesh.add(line);
        }
        mesh.position.set(x, y, z);
        return mesh
    }

    /**
     * Creates an arrow mesh
     * @param {THREE.Vector3} origin 
     * @param {{origin : THREE.Vector3, lenght: number, color: number}} options 
     */
    static createArrow(direction, { color = 0xffffff, lenght = 1, origin = new THREE.Vector3(0, 0, 0) } = {}) {
        const arrow = new THREE.ArrowHelper(direction, origin, lenght, color);
        return arrow;
    }

    /**
     * Creates a straight line. 
     * @param {{x: number, y: number, z: number}} from 
     * @param {{x: number, y: number, z: number}} to 
     * @param {{color: number, dashed: boolean}} [options] 
     * @returns 
     */
    static createStraightLine(from, to, { color = 0xffffff, dashed = false } = {}) {
        const material = dashed ?
            new THREE.LineDashedMaterial({
                color, linewidth: 1,
                scale: 1,
                dashSize: 1,
                gapSize: 1,
            }) :
            new THREE.LineBasicMaterial({ color });
        const points = [new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(to.x, to.y, to.z)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material)
        line.computeLineDistances();
        return line;
    }

    /**
     * Creates a shpere mesh.
     * @param {number} radius 
     * @param {Object} options
     * @param {number} options.widthSegments
     * @param {number} options.heightSegments
     * @param {number} options.color
     * @param {boolean} options.withBorders
     * @param {number} options.borderColor
     * @returns {THREE.Mesh}
     */
    static createSphere(radius, { widthSegments = 16, heightSegments = 32, color = 0xffffff, withBorders = true, borderColor = 0x000000 } = {}) {
        const mesh = new THREE.Group();
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshLambertMaterial({ color });
        const sphere = new THREE.Mesh(geometry, material);
        mesh.add(sphere)
        if (withBorders) {
            const edges = new THREE.EdgesGeometry(geometry)
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: borderColor }))
            mesh.add(line);
        }
        return mesh;
    }

    static createCylinder(radiusTop, radiusBottom, height, { color = 0xffffff, radialSegments = 8, heightSegments = 1, withBorders = true, borderColor = 0x000000, wireframe = false } = {}) {
        const mesh = new THREE.Group();
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);
        const material = new THREE.MeshBasicMaterial({ color, wireframe });
        const cylinder = new THREE.Mesh(geometry, material);
        mesh.add(cylinder)
        if (withBorders) {
            const edges = new THREE.EdgesGeometry(geometry)
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: borderColor }))
            mesh.add(line);
        }
        return mesh;
    }

    static createOriginPoint() {
        const axisMesh = new THREE.Group();
        axisMesh.add(ShapeCreator.createArrow(new THREE.Vector3(0, 1, 0), { color: 0x00ff00 }));
        axisMesh.add(ShapeCreator.createArrow(new THREE.Vector3(0, 0, 1), { color: 0x0000ff }));
        axisMesh.add(ShapeCreator.createArrow(new THREE.Vector3(1, 0, 0), { color: 0xff0000 }));
        axisMesh.add(ShapeCreator.createSphere(.05, { withBorders: false }))
        return axisMesh;
    }
}

export { ShapeCreator };