import { WebGLRenderer } from 'three';

function createRenderer() {
    const instance = new WebGLRenderer({antialias: true});

    return instance;
}

export { createRenderer };