import * as THREE from 'three';

import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer';

let camera, scene, renderer;

class World{
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();

        console.log(scene);
        scene.background = new THREE.Color('skyblue');
        container.append(renderer.domElement);

        const cube = createCube();

        scene.add(cube);

        const resizer = new Resizer(container, camera, renderer);
    }

    render() {
        renderer.render(scene, camera);
    }
}

export { World }