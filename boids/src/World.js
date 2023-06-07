import * as THREE from 'three';

import { createCamera } from './components/camera.js';
import { MouseCollider } from './components/MouseCollider';
import { createScene } from './components/scene.js';
import { Boids } from './components/boids/Boids';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { createComposer } from './systems/composer.js';
import { createStats } from './systems/stats.js';
import { Vector2 } from 'three';
import { MouseHandler } from './systems/MouseHandler.js';

let camera, scene, renderer, loop, composerObj, stats, mouse;

class World{
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        stats = createStats();
        mouse = new Vector2(0, 0);

        const resizer = new Resizer(container, camera, renderer);
        const mouseHandler = new MouseHandler();

        container.append(renderer.domElement);
        document.body.appendChild( stats.domElement );

        composerObj = createComposer(renderer, scene, camera);
        loop = new Loop(camera, scene, renderer, composerObj['composer'], stats, mouseHandler);

        composerObj.passes.afterImage.uniforms.damp.value = 0.6

        const boids = new Boids(250);
        scene.add(boids.getGroup());
        loop.updateToUpdate(boids);

        const mouseCollider = new MouseCollider(camera);
        scene.add(mouseCollider.getBoxMesh());
        loop.updateToUpdate(mouseCollider);

        scene.add(mouseCollider.getPlaneMesh());
    }

    render() {
        //composer.render();
        renderer.render(scene, camera);
    }

    start(){
        loop.start();
    }

    stop(){
        loop.stop();
    }
}

export { World }