import { Clock } from "three";

class Loop {
  constructor(camera, scene, renderer,composer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.composer = composer;
    this.toUpdate = [];
  }
  start() {
    requestAnimationFrame(this.start.bind(this));
    this.tick();

    this.render();
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  render(){
    console.log("render");
    this.composer.render();
    //this.renderer.render(this.scene, this.camera);
  }

  tick(){
    this.toUpdate.forEach(el => el.tick(this.scene));  
  }
}

export { Loop };