import { WebGLRenderer } from 'three';

function createRenderer() {
    const instance = new WebGLRenderer();

    return instance;
}

export { createRenderer };