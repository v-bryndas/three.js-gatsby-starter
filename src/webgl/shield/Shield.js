import * as THREE from 'three';

import ParticleFrag from 'shaders/particle/particle.frag'
import ParticleVert from 'shaders/particle/particle.vert'
import ShieldFrag from 'shaders/shield/shield.frag'
import ShieldVert from 'shaders/shield/shield.vert'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import ResourceTracker from '../ResourceTracker';
import { easeOutQuad } from '../../utils/easing.utils';

const glslify = require('glslify');

class Shield {
    constructor(webgl) {
        this.webgl = webgl;
        this.container = new THREE.Object3D();

        this.animationState = false;
        // Animation State Timer
        this.a_time = 0.0;

        this.init();
    }

    init() {
        const objLoader = new GLTFLoader();

        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'decoder/draco/' );
        objLoader.setDRACOLoader( dracoLoader );

        objLoader.load('gltf-models/shield_2D_4x_o.gltf', gltf => {
            const shieldModel = gltf.scene.children[0];
            const shieldObjGeometry = shieldModel.geometry;

            const meshScale = 1.3;

            const verticiesCount = shieldObjGeometry.attributes.position.count;
            const indices = new Uint16Array(verticiesCount);

            for (let i = 0; i < indices.length; i++) {
                indices[i] = i;
            }

            shieldObjGeometry.setAttribute('pindex', new THREE.BufferAttribute(indices, 1, false));

            // particles shield
            const particleUniforms = {
                u_time: { value: 0 },
                u_depth: { value: 7.0 },
                u_zPositionAdd: { value: 1.0 },
                u_mouse: { value: new THREE.Vector2()}
            };

            const particleMaterial = new THREE.RawShaderMaterial({
                uniforms: particleUniforms,
                vertexShader: glslify(ParticleVert),
                fragmentShader: glslify(ParticleFrag),
                transparent: true
            });
        
            this.shieldPoints = new THREE.Points(shieldObjGeometry, particleMaterial);

            // mesh shield
            const shieldUniforms = {
                u_alpha: { value: 0.0 },
                u_time: { value: 0.0 },
                u_delta: { value: 0.0 },
                u_scale: { value: 2.0 }
            };

            const shieldMeshMaterial = new THREE.RawShaderMaterial({
                uniforms: shieldUniforms,
                vertexShader: glslify(ShieldVert),
                fragmentShader: glslify(ShieldFrag),
                transparent: true,
                side: THREE.DoubleSide,
            });

            this.shieldMesh = new THREE.Mesh(shieldObjGeometry, shieldMeshMaterial);

            this.container.scale.set(meshScale, meshScale, 1.0);
            
            this.container.add(this.shieldMesh);
            
            // fix antialias postprocessing bug need to add custom MSAA
            this.container.position.set(0,-0.001,0)

            // resource tracker for dispose objects - https://threejsfundamentals.org/threejs/lessons/threejs-cleanup.html
            this.resMgr = new ResourceTracker();
            const track = this.resMgr.track.bind(this.resMgr);
            const root = track(this.shieldPoints)
            this.container.add(root);


            setTimeout(() => {
                this.animationState = true;
            }, 4500);
        });
    }

    update = (delta) => {
        if(!this.shieldPoints) return;
        
        if(this.animationState) {
            const u_zPositionAdd = this.shieldPoints.material.uniforms.u_zPositionAdd.value;
            const { glitchEffect } = this.webgl;

            if(u_zPositionAdd > 0.0) {
                let step = 0.05;
                this.a_time += step;

                this.shieldPoints.material.uniforms.u_time.value -= delta;
                this.shieldPoints.material.uniforms.u_zPositionAdd.value -= easeOutQuad(this.a_time, 0.0, step, 4.0);

                glitchEffect.mode = 2;
            } else {
                glitchEffect.mode = 3;

                // Remove Particles Shield after animation state finish
                // And show shield with colors section 
                // Init BMFont
                this.animationState = false;

                setTimeout(() => {
                    glitchEffect.mode = 0;
                    this.shieldMesh.material.uniforms.u_alpha.value = 1.0;

                    this.webgl.initText()
                    
                    this.resMgr.dispose();
                    this.shieldPoints = null;
                }, 500);
            }
        } else {
            this.shieldPoints.material.uniforms.u_time.value += delta;
        }
    }
}

export default Shield;