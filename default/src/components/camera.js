import { PerspectiveCamera } from 'three';

function createCamera() {
    const camera = new PerspectiveCamera(
        70, // fov = Field Of View
        window.innerWidth / window.innerHeight, // aspect ratio (dummy value)
        1, // near clipping plane
        10000, // far clipping plane
      );
    
      // move the camera back so we can view the scene
      camera.position.set(0, 0, 250);
    
      return camera;
}

export { createCamera };