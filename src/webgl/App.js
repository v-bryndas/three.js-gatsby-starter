import WebGLView from './WebGLView';

export default class App {
    constructor() {
        this.initWebGL();
    }

    init() {
        this.initEffect();
        this.addListeners();
        this.animate();
    }

    initWebGL() {
        this.webgl = new WebGLView(this);
    }

    addListeners() {
        this.handlerAnimate = this.animate.bind(this);
        
        window.onresize = this.resize.bind(this);

        const threeCanvas = this.webgl.renderer.domElement;

        threeCanvas.onclick = this.click.bind(this);
    }

    animate() {
        const delta = this.webgl.clock.getDelta();
        
        this.update(delta);
        this.draw(delta);

        this.raf = requestAnimationFrame(this.handlerAnimate);
    }

    update(delta) {
        if(this.webgl) this.webgl.update(delta);
    }

    draw(delta) {
        if(this.webgl) this.webgl.draw(delta);
    }

    resize() {
        if(this.webgl) this.webgl.resize();
    }

    initEffect() {
        if(this.webgl) this.webgl.initEffect();
    }

    click() {
        console.log('clicked on three canvas');
    }
}