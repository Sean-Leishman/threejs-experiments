import { Vector2 } from "three";

class MouseHandler{
    constructor(){
        this.mouse = new Vector2(0,0);
        this.clicked = false;

        document.addEventListener('mousemove', (e) => {
            e.preventDefault();
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1; 
        }, false);
    }

    getPosition(){
        return this.mouse;
    }


}

export { MouseHandler };