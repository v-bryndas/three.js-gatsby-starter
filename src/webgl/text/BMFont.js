import * as THREE from 'three';

import rtVertexShader from 'shaders/text-rendertarget/text-rendertarget.vert';
import rtFragmentShader from 'shaders/text-rendertarget/text-rendertarget.frag';

const loadFont = require('load-bmfont');
const createGeometry = require('three-bmfont-text');
const MSDFShader = require('three-bmfont-text/shaders/msdf');

class BMFont {
    constructor(webgl) {
        this.webgl = webgl;
        this.gui = webgl.gui;
        this.container = new THREE.Object3D();

        this.rotateZ = 0.1;
        this.rotateX = -0.1;
        this.positionZ = 0.0;
        this.positionX = 0.0;
        this.positionY = -0.6;
        this.coneSegments = 50;
        this.radius = 1.5;

        this.gui.add(this, 'rotateZ', -Math.PI, Math.PI * 2.0).step(0.1);
        this.gui.add(this, 'rotateX', -Math.PI, Math.PI * 2.0).step(0.1);
        this.gui.add(this, 'positionZ', -20, 20).step(0.1);
        this.gui.add(this, 'positionX', -20, 20).step(0.1);
        this.gui.add(this, 'positionY', -20, 20).step(0.1);
        this.gui.add(this, 'coneSegments', 3, 50).onChange(this.updateGeometry.bind(this));
        this.gui.add(this, 'radius', 0, 50).step(0.1).onChange(this.updateGeometry.bind(this));

        loadFont('fonts/Pragmatica-msdf/Pragmatica.fnt', (err, font) => {
            const geometry = createGeometry({
                font,
                text: '*AR.MOUR',
                letterSpacing: -0.5
            });

            const loader = new THREE.TextureLoader();

            loader.load('fonts/Pragmatica-msdf/atlas.png', texture => {
                const scaleFloat = 0.0078;
                
                geometry.computeBoundingBox();

                let uniforms = {
                    u_time: { value: 0.0 },
                    u_scale: { value: scaleFloat }
                };

                this.textMesh = this.createTextMesh(geometry, texture, uniforms);

                let parent = new THREE.Object3D();

                // center position of a object relativly to world
                geometry.boundingBox.getCenter(this.textMesh.position).multiplyScalar(-1 * scaleFloat);

                this.textMesh.rotation.set(Math.PI, 0, 0);
                this.textMesh.scale.set(scaleFloat, scaleFloat, 1.0);

                parent.add(this.textMesh);

                this.createRenderTarget(this.textMesh);
                this.createRenderTargetMesh();
            })
        })
    }

    createRenderTargetMesh() {
        const radius = this.radius;

        const height = 6.75;
        const heightSegm = 50;

        const radialSegments = this.coneSegments;

        this.geometry = new THREE.CylinderBufferGeometry(
            radius, radius, height, radialSegments, heightSegm, true);

        this.material = new THREE.ShaderMaterial({
            vertexShader: rtVertexShader,
            fragmentShader: rtFragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            uniforms: {
                u_time: { value: 0 },
                u_texture: { value: this.rt.texture },
                u_uvClip: { value: 0.5 }
            }
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        this.mesh.rotation.y = 0.7;

        this.container.add(this.mesh);
    }

    createTextMesh(geometry, texture, uniforms) {
        const material = new THREE.RawShaderMaterial(MSDFShader({
            map: texture,
            color: 0xffffff,
            side: THREE.FrontSide,
            transparent: true,
            negate: false
        }));

        for (let uniform in uniforms) {
            material.uniforms[uniform] = uniforms[uniform];
        }

        const mesh = new THREE.Mesh(geometry, material);
        
        return mesh;
    }

    updateGeometry() {
        const radius = this.radius;

        const height = 6.75;
        const heightSegm = 50;

        const radialSegments = this.coneSegments;

        this.geometry = new THREE.CylinderBufferGeometry(
            radius, radius, height, radialSegments, heightSegm, true);

        this.mesh.geometry.dispose();

        this.mesh.geometry = this.geometry;
    }

    createRenderTarget(textMesh) {
        this.rt = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

        this.rtCamera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
        this.rtCamera.position.z = 4;

        this.rtScene = new THREE.Scene();
        this.rtScene.background = new THREE.Color(0x000000);

        this.rtScene.add(textMesh);
    }

    update(delta, elapsedTime) {
        if(!this.textMesh) return;

        this.textMesh.material.uniforms.u_time.value = elapsedTime;
        this.textMesh.material.uniformsNeedUpdate = true;

        if(this.mesh.material.uniforms.u_uvClip.value < 1) {
            this.mesh.material.uniforms.u_uvClip.value += delta * 0.1;
        }
        
        this.mesh.rotation.y -= delta;

        this.mesh.rotation.x = this.rotateX;
        this.mesh.rotation.z = this.rotateZ;

        this.mesh.position.x = this.positionX;
        this.mesh.position.z = this.positionZ;
        this.mesh.position.y = this.positionY;

        this.webgl.renderer.setRenderTarget(this.rt);
        this.webgl.renderer.render(this.rtScene, this.rtCamera);
        this.webgl.renderer.setRenderTarget(null);
    }
}

export default BMFont;