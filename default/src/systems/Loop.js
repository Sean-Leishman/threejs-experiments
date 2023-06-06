import { Clock } from "three";

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.toUpdate = [];
  }

  start() {
    requestAnimationFrame(this.start.bind(this));
    this.tick();

    // render a frame
    this.renderer.render(this.scene, this.camera);
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick(){
    this.toUpdate.forEach(el => el.tick(this.scene));  
  }
}

export { Loop };