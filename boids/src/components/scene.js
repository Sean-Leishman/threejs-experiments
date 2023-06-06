import { Color, Scene } from 'three';
import { Boids } from './boids/Boids';

function createScene() {
    const scene = new Scene();

    scene.background = new Color( 0x000000  );

    return scene;
}

export { createScene };