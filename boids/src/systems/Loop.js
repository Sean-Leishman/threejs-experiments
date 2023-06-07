import { Clock } from "three";
import { MouseCollider } from "../components/MouseCollider";

class Loop {
  constructor(camera, scene, renderer,composer,stats,mouseHandler) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.composer = composer;
    this.stats = stats;
    this.mouseHandler = mouseHandler;
    this.toUpdate = [];

    this.tickArgs = {
      'mousePosition': this.mouseHandler.getPosition(),
      'boxMesh': null,
    }
  }

  start() {
    requestAnimationFrame(this.start.bind(this));
    this.tick();

    this.render();
    this.stats.update();
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  render(){
    this.composer.render();
    //this.renderer.render(this.scene, this.camera);
  }

  updateToUpdate(item){
    this.toUpdate.push(item);
    if (item instanceof MouseCollider){
      this.tickArgs.boxMesh = item.getBoxMesh();
    }
  }

  tick(){
    this.tickArgs.mousePosition = this.mouseHandler.getPosition();
    this.toUpdate.forEach(el => el.tick(this.tickArgs));  
  }


}

export { Loop };