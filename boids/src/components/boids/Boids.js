import * as THREE from 'three';
import { Sphere, Vector3 } from 'three';
import boids_update_helper from './functions';

let baseCircleRadius = 70;
let origin = new Vector3(0,0,0);

class Boids{
    constructor(num){
        this.num = Math.floor(num / 25);
        this.group = new THREE.Group();
        this.geometries = this.generateGeometries(this.num)
        this.colors = this.generateBallColors(this.num * 10);

        this.group.add(this.generateContainment());

        this.segmentLength = Math.PI * 2 / num;
        
        for (let i = 0; i < num; i++){
            const boid = this.generateBoid(i, this.geometries[i % this.geometries.length], this.colors[i % this.colors.length]);
            this.group.add(boid);
        }

        this.group.name = "boids";
    }

    getGroup(){
        return this.group;
    }

    generateBallColors(num_of_materials){
        return Array.from({length: num_of_materials}, _ => Math.random() * 0xffffff );
    }

    generateGeometries(num){
        return Array.from({length: num}, _ => new THREE.SphereGeometry(2 + Math.random() * 3, 4, 7) );
    }

    generateContainment(){
         // Sphere to contain boids
        const contain_geometry = new THREE.BoxGeometry(500, 200, 200);
        const object = new THREE.Mesh(
            contain_geometry,
            new THREE.MeshBasicMaterial()
        );
        object.visible = false;
        object.position.z = 50;
        object.name = "Containment Box";
        return object;
    }

    generateBoid(idx, geometry, color){
        const material = new THREE.MeshBasicMaterial({color: color});
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150);
        mesh.velocity = new THREE.Vector3(2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5));
        mesh.name = "boid";

        mesh.colorUpdate = 1;

        let i = Math.floor( idx / 2 );

        mesh.circleAngle = idx * this.segmentLength;
        mesh.radius = baseCircleRadius;
        mesh.iterations = 0;

        mesh.circlePosition = new THREE.Vector3(baseCircleRadius * Math.cos(mesh.circleAngle),
                                                baseCircleRadius * Math.sin(mesh.circleAngle),
                                                0);
        

        return mesh;
    }

    tick(args){
        const boxMesh = args.boxMesh;
        const mode = args.mode;
        const newMode = boids_update_helper(this.group, this.group.children.filter((child) => {
            return child.name == "boid" && child.visible;
          }), boxMesh, mode);
        if (newMode !== mode && newMode !== null){
            args.updateMode(newMode);
        }
    }
}

export { Boids };