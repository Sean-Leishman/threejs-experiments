import { Color, Scene } from 'three';

function createScene() {
    const scene = new Scene();

    scene.background = new Color( 0x000000  );
    console.log(scene);

    return scene;
}

export { createScene };