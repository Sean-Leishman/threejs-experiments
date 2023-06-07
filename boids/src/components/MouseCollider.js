import { BoxGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, Raycaster, Vector3 } from "three";

class MouseCollider{
    constructor(camera){
        this.boxMesh = this.defineCollisionBox();
        this.planeMesh = this.definePlane();
        this.raycaster = this.defineRaycaster();

        this.offset = new Vector3(0, 0, 100);

        this.camera = camera;
    }

    defineRaycaster(){
        const raycaster = new Raycaster();
        return raycaster;
    }

    defineCollisionBox(){
        const geometry = new BoxGeometry( 50, 50, 500 )
        const material = new MeshBasicMaterial( {color: 0x00ff00, opacity:0, transparent:true} );
        const mesh = new Mesh( geometry, material );

        mesh.name = "MouseColliderBox"
        mesh.position.set(0,0, 0);
        return mesh
    }

    definePlane(){
        let z = -500;
        // 70 = fov
        let vfov = 70 * Math.PI / 180;
        let width = 2 * Math.tan( vfov / 2) * 450;
        let aspect = window.innerWidth / window.innerHeight;
        let height = width * aspect;

        const geometry = new PlaneGeometry( height, width )
        const material = new MeshBasicMaterial( {color: 0xff0000, opacity:0, transparent: true} );
        const mesh = new Mesh( geometry, material );

        mesh.position.set(0,0,0);

        mesh.name = "MouseColliderPlane"
        return mesh
    }
    
    getBoxMesh(){
        return this.boxMesh;
    }

    getPlaneMesh(){
        return this.planeMesh;
    }

    tick(args){
        //console.log(mousePosition);
        const mousePosition = args.mousePosition;
        this.raycaster.setFromCamera( mousePosition, this.camera );
        const intersects = this.raycaster.intersectObject( this.planeMesh );

        if (intersects.length > 0){
            const intersect = intersects[0];
            const newPos = intersect.point.add(this.offset)
            this.boxMesh.position.set(newPos.x, newPos.y, newPos.z);
            //this.boxMesh.lookAt(0,0,250);
        }
    }
}

export { MouseCollider };