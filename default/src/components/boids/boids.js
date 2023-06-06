import * as THREE from 'three';
import boids_update_helper from './functions';

class Boids{
    constructor(num){
        this.num = num;
        this.group = new THREE.Group();
        this.geometry = new THREE.SphereGeometry(1, 32, 16);
        this.colors = this.generateBallColors(num);

        this.group.add(this.generateContainment());
        
        for (let i = 0; i < num; i++){
            const boid = this.generateBoid(this.colors[i % this.colors.length]);
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

    generateBoid(color){
        console.log(color);
        const material = new THREE.MeshBasicMaterial({color: color});
        const mesh = new THREE.Mesh(this.geometry, material);

        mesh.position.set(Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150);
        mesh.velocity = new THREE.Vector3(2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5));
        mesh.name = "boid";

        return mesh;
    }

    tick(scene){
        boids_update_helper(this.group, this.group.children.filter((child) => {
            return child.name == "boid" && child.visible;
          }));
        this.group.children.forEach((child) => {
            if (child.name === "boid"){
                child.position.x = child.position.x + child.velocity.x;
                child.position.y = child.position.y + child.velocity.y;
                child.position.z = child.position.z + child.velocity.z;
            }
        })
        
    }
}

export { Boids };