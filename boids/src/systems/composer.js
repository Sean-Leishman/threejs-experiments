import * as THREE from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


function createComposer(renderer, scene, camera){
    let composer = new EffectComposer( renderer );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.15;
    bloomPass.strength = 0.5;
    bloomPass.radius = 0.3;

    const outputPass = new OutputPass( THREE.ReinhardToneMapping );

    const passes = {
        'render': new RenderPass( scene, camera ),
        'afterImage': new AfterimagePass(),
        'shader': new ShaderPass(GammaCorrectionShader),
        'bloom': bloomPass,
        'output': outputPass,
    }

    composer.addPass( passes['render'] );
    composer.addPass( passes['bloom'] );
    composer.addPass( passes['output'] );
    
    //composer.addPass( passes['render'])
    //composer.addPass( passes['afterImage'] );
    //composer.addPass( passes['shader'] );

    return {'composer': composer, 'passes': passes};
}

export { createComposer };