import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { EffectComposer, EffectPass, RenderPass, GlitchEffect, ChromaticAberrationEffect, BlendFunction, NoiseEffect } from 'postprocessing';

import BMFont from './text/BMFont';
import Shield from './shield/Shield';

export default class WebGLView {
    constructor(app) {
        this.app = app;

        // default
        this.initThree();
        this.resize();

        // custom
        this.initShield()
        this.initControls();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    initThree() {
        // scene
        this.scene = new THREE.Scene();

        const fov = 45; // camera angle in degreees
        const aspect = this.width / this.height; // default canvas aspect ration 300 / 150
        const near = 1; // minimal value for frustrum start
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.z = 7;

        // renderer 
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, 
            alpha: true,
            canvas: document.querySelector('canvas')
        });

        // clock - object for keeping track of time
        this.clock = new THREE.Clock();

        this.scene.background = new THREE.Color(0x101010);

        this.gui = new dat.GUI();
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    initShield() {
        this.shield = new Shield(this);
        this.scene.add(this.shield.container);
    }

    initText() {
        this.bmFont = new BMFont(this);

        this.scene.add(this.bmFont.container);
    }

    initEffect() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        const chromaticAberrationEffect = new ChromaticAberrationEffect();

        const glitchEffect = new GlitchEffect({
            chromaticAberrationOffset: chromaticAberrationEffect.offset
        });

        // mode 0 - disabled
        // mode 1 - from time to time
        // mode 2 - constant mild
        // mode 3 - constant wild
        glitchEffect.mode = 0;

        this.glitchEffect = glitchEffect;

        const noiseEffect = new NoiseEffect({
            blendFunction: BlendFunction.COLOR_DODGE,
        });

        noiseEffect.blendMode.opacity.value = 0.1;

        const glitchPass = new EffectPass(this.camera, glitchEffect, noiseEffect);
        const chromaticAberrationPass = new EffectPass(this.camera, chromaticAberrationEffect);

        this.composer.addPass(glitchPass);
        this.composer.addPass(chromaticAberrationPass);
    }

    update(delta) {
        // get seconds passed since the clock started and sets oldTime to current time
        const elapsedTime = this.clock.getElapsedTime();
        
        if(this.shield) this.shield.update(delta);
        if(this.bmFont) this.bmFont.update(delta, elapsedTime);

        if(this.controls) this.controls.update();
    }
    
    draw(delta) {
        if(this.composer) {
            this.composer.render(delta);
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

		if (!this.renderer) return;
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.width, this.height);
	}
}