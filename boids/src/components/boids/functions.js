import * as THREE from 'three';
import { Box3, Vector3 } from 'three';

let boids;
const visualRange = 40;
let width = window.innerWidth;
let height = window.innerHeight;
let containment_box;
let avoidance_box;

//let dir = new THREE.Vector3();
let ray = new THREE.Raycaster();

function distance(boid1, boid2) {
    return Math.sqrt(
      (boid1.position.x - boid2.position.x) * (boid1.position.x - boid2.position.x) +
        (boid1.position.y - boid2.position.y) * (boid1.position.y - boid2.position.y) + 
        (boid1.position.z - boid2.position.z) * (boid1.position.z - boid2.position.z),
    );
  }

function direction(boid, box){
  ray.set(boid.position,boid.velocity.normalize());
  return ray.intersectObject(box);
}

// TODO: This is naive and inefficient.
function nClosestBoids(boid, n) {
    // Make a copy
    const sorted = boids.slice();
    // Sort the copy by distance from `boid`
    sorted.sort((a, b) => distance(boid, a) - distance(boid, b));
    // Return the `n` closest
    return sorted.slice(1, n + 1);
  }

// Constrain a boid to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
function keepWithinBounds(boid) {
    const margin = 8;
    const turnFactor = 0.21;
    
    let x_edge = containment_box.geometry.parameters.width/2;
    let y_edge = containment_box.geometry.parameters.height/2;
    let z_edge = containment_box.geometry.parameters.depth/2;
    if (boid.position.x < containment_box.position.x-x_edge-margin) {
      boid.velocity.x += turnFactor;
    }
    if (boid.position.x > containment_box.position.x+x_edge+margin) {
      boid.velocity.x -= turnFactor
    }
    if (boid.position.y < containment_box.position.y-y_edge-margin) {
        boid.velocity.y += turnFactor;
    }
    if (boid.position.y > containment_box.position.y+y_edge+margin) {
        boid.velocity.y -= turnFactor;
    }
    if (boid.position.z < containment_box.position.z-z_edge-margin) {
        boid.velocity.z += turnFactor;
    }
    if (boid.position.z > containment_box.position.z+z_edge+margin) {
        boid.velocity.z -= turnFactor;
    }
  }

function avoidObstacles(boid){
  const turnFactor = 0.21;

  let x_edge = avoidance_box.geometry.parameters.width/2;
  let y_edge = avoidance_box.geometry.parameters.height/2;
  let z_edge = avoidance_box.geometry.parameters.depth/2;
  if (direction(boid, avoidance_box).length > 0){
    if (boid.position.x < containment_box.position.x) {
      boid.velocity.x -= turnFactor;
    }
    if (boid.position.x > containment_box.position.x) {
      boid.velocity.x += turnFactor
    }
    if (boid.position.y < containment_box.position.y) {
        boid.velocity.y -= turnFactor;
    }
    if (boid.position.y > containment_box.position.y) {
        boid.velocity.y += turnFactor;
    }
    if (boid.position.z < containment_box.position.z) {
        boid.velocity.z -= turnFactor;
    }
    if (boid.position.z > containment_box.position.z) {
        boid.velocity.z += turnFactor;
    }
  }
}
  // Find the center of mass of the other boids and adjust velocity slightly to
// point towards the center of mass.
function flyTowardsCenter(boid, otherBoids) {
    const centeringFactor = 0.001; // adjust velocity by this %
  
    let centerX = 0;
    let centerY = 0;
    let centerZ = 0;
    let numNeighbors = 0;

    let interprolateColor = null;
    let originalColor = boid.material.color;
  
    for (let otherBoid of otherBoids) {
        centerX += otherBoid.position.x;
        centerY += otherBoid.position.y;
        centerZ += otherBoid.position.z;
        numNeighbors += 1;

        if (interprolateColor == null){
          interprolateColor = otherBoid.material.color.clone()
        }
        else{
          interprolateColor.lerp(otherBoid.material.color, .5);
        }
    }
  
    if (numNeighbors) {
      centerX = centerX / numNeighbors;
      centerY = centerY / numNeighbors;
      centerZ = centerZ / numNeighbors;

      boid.velocity.x += (centerX - boid.position.x) * centeringFactor;
      boid.velocity.y += (centerY - boid.position.y) * centeringFactor;
      boid.velocity.z += (centerZ - boid.position.z) * centeringFactor;
    }

    boid.material.color.lerp(interprolateColor, .01);
  }

// Move away from other boids that are too close to avoid colliding
function avoidOthers(boid, otherBoids) {
    const minDistance = 10; // The distance to stay away from other boids
    const avoidFactor = 0.07; // Adjust velocity by this %
    let moveX = 0;
    let moveY = 0;
    let moveZ = 0;
    for (let otherBoid of otherBoids) {
      if (otherBoid !== boid) {
        if (distance(boid, otherBoid) < minDistance) {
          moveX += boid.position.x - otherBoid.position.x;
          moveY += boid.position.y - otherBoid.position.y;
          moveZ += boid.position.z - otherBoid.position.z;
        }
      }
    }
  
    boid.velocity.x += moveX * avoidFactor;
    boid.velocity.y += moveY * avoidFactor;
    boid.velocity.z += moveZ * avoidFactor;
  }

// Find the average velocity (speed and direction) of the other boids and
// adjust velocity slightly to match.
function matchVelocity(boid, otherBoids) {
    const matchingFactor = 0.06; // Adjust by this % of average velocity
  
    let avgDX = 0;
    let avgDY = 0;
    let avgDZ = 0;
    let numNeighbors = 0;
  
    for (let otherBoid of otherBoids) {
        avgDX += otherBoid.velocity.x;
        avgDY += otherBoid.velocity.y;
        avgDZ += otherBoid.velocity.z;
        numNeighbors += 1;
    }
  
    if (numNeighbors) {
      avgDX = avgDX / numNeighbors;
      avgDY = avgDY / numNeighbors;
      avgDZ = avgDZ / numNeighbors;
  
      boid.velocity.x += (avgDX - boid.velocity.x) * matchingFactor;
      boid.velocity.y += (avgDY - boid.velocity.y) * matchingFactor;
      boid.velocity.z += (avgDZ - boid.velocity.z) * matchingFactor;
    }
  }

// Speed will naturally vary in flocking behavior, but real animals can't go
// arbitrarily fast.
function limitSpeed(boid) {
    const maxSpeed = 6;
    const minSpeed = 3;
    const speed = Math.sqrt(boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y
        + boid.velocity.z * boid.velocity.z);
    if (speed > maxSpeed) {
      boid.velocity.x = (boid.velocity.x / speed) * maxSpeed;
      boid.velocity.y = (boid.velocity.y / speed) * maxSpeed;
      boid.velocity.z = (boid.velocity.z / speed) * maxSpeed;
    }
    if (speed < minSpeed) {
        boid.velocity.x = (boid.velocity.x / speed) * minSpeed;
        boid.velocity.y = (boid.velocity.y / speed) * minSpeed;
        boid.velocity.z = (boid.velocity.z / speed) * minSpeed;
      }
  }

function avoidMouse(boid, boxMesh){
  const vel_norm = boid.velocity.clone().normalize();
  ray.set(boid.position, vel_norm,0,100);

  const intersections = ray.intersectObject(boxMesh, false);
  if (intersections.length > 0){
    const firstIntersection = intersections[0];
    let avoid_force = vel_norm.add(boid.position).multiplyScalar(50);
    avoid_force.sub(boxMesh.position);
    avoid_force.normalize().multiplyScalar(10);

    boid.velocity.x += avoid_force.x
    boid.velocity.y += avoid_force.y
    boid.velocity.z += avoid_force.z
  }


}

function update_boids(scene,boids, boxMesh){
    if (containment_box == null){
      containment_box = scene.children.filter(child => {return child.name == 'Containment Box'})[0];
      avoidance_box = scene.children.filter(child => {return child.name == 'Avoidance Box'})[0];
    }

    for (let boid of boids) {
      if (Math.random() < 0.5) {
        // Update the velocities according to each rule
        let otherBoids = boids.filter(otherboid => distance(otherboid, boid) < visualRange)

        flyTowardsCenter(boid, otherBoids);
        avoidOthers(boid, otherBoids);
        matchVelocity(boid, otherBoids);
        limitSpeed(boid);
        keepWithinBounds(boid);

        if (boxMesh !== null){
          avoidMouse(boid, boxMesh);
        }
      }
        boid.position.x = boid.position.x + boid.velocity.x;
        boid.position.y = boid.position.y + boid.velocity.y;
        boid.position.z = boid.position.z + boid.velocity.z;

        boid.material.color.setHex(boid.material.color.getHex() + boid.colorUpdate)
        
        //avoidObstacles(boid);
    }
    //console.log(boids[0].position.x,boids[0].velocity.x)
    //console.log(boids[0].position.y,boids[0].velocity.y)
    //console.log(boids[0].position.z,boids[0].velocity.z)
}

export default update_boids;