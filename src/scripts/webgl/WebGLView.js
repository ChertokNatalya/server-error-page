import 'three';
import { TweenLite } from 'gsap/TweenMax';

import InteractiveControls from './controls/InteractiveControls';
import Particles from './particles/Particles';

const glslify = require('glslify');

export default class WebGLView {

	constructor(app) {
		this.app = app;

		this.samples = [
			'images/logo.png',
		];

		this.initThree();
		this.initParticles();
		this.initControls();

		const rnd = ~~(Math.random() * this.samples.length);
		this.goto(rnd);
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		// renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        // clock
		this.clock = new THREE.Clock(true);
	}

	initControls() {
		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
	}

	initParticles() {
		this.particles = new Particles(this);
		this.scene.add(this.particles.container);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		const delta = this.clock.getDelta();

		if (this.particles) this.particles.update(delta);
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}


	goto(index) {
		// init next
		if (this.currSample == null) this.particles.init(this.samples[index]);
		// hide curr then init next
		else {
			this.particles.hide(true).then(() => {
				this.particles.init(this.samples[index]);
			});
		}

		this.currSample = index;
	}

	next() {
		if (this.currSample < this.samples.length - 1) this.goto(this.currSample + 1);
		else this.goto(0);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;
        if (window.innerWidth<=1920&&window.innerWidth>1610) {this.camera.aspect = 550 / 250;}
		else if (window.innerWidth<=1610&&window.innerWidth>1450){this.camera.aspect = 450 / 250;}
        else if (window.innerWidth<=1450&&window.innerWidth>1090){this.camera.aspect = 400 / 250;}
        else if (window.innerWidth<=1090&&window.innerWidth>970){this.camera.aspect = 300 / 250;}
        else if (window.innerWidth<=970&&window.innerWidth>730){this.camera.aspect = 270 / 250;}
        else if (window.innerWidth<=730&&window.innerWidth>645){this.camera.aspect = 260 / 250;}
        else if (window.innerWidth<=645&&window.innerWidth>635){this.camera.aspect = 270 / 250;}
        else if (window.innerWidth<=635&&window.innerWidth>300){this.camera.aspect = 270 / 250;}
		this.camera.updateProjectionMatrix();

		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;


        if(window.innerWidth>=1920){this.renderer.setSize(1920, window.innerHeight);}
        else if (window.innerWidth<=1919&&window.innerWidth>1599){this.renderer.setSize(1600,window.innerHeight );}
        else if (window.innerWidth<=1599&&window.innerWidth>1439){this.renderer.setSize(1440,window.innerHeight );}
        else if (window.innerWidth<=1439&&window.innerWidth>1365){this.renderer.setSize(1366,window.innerHeight );}
        else if (window.innerWidth<=1365&&window.innerWidth>1279){this.renderer.setSize(1280,window.innerHeight );}
        else if (window.innerWidth<=1279&&window.innerWidth>1079){this.renderer.setSize(1080,window.innerHeight );}
        else if (window.innerWidth<=1079&&window.innerWidth>1023){this.renderer.setSize(1024,window.innerHeight );}
        else if (window.innerWidth<=1023&&window.innerWidth>959){this.renderer.setSize(960,window.innerHeight );}
        else if (window.innerWidth<=959&&window.innerWidth>719){this.renderer.setSize(720, 650);}
	    else if (window.innerWidth<=719&&window.innerWidth>539){this.renderer.setSize(540, 450);}
		else if (window.innerWidth<=539&&window.innerWidth>479) {this.renderer.setSize(480, 370);}
        else if (window.innerWidth<=479&&window.innerWidth>0) {this.renderer.setSize(320, 250);}
        else {this.renderer.setSize(window.innerWidth, window.innerHeight)};
		if (this.interactive) this.interactive.resize();
		if (this.particles) this.particles.resize();
	}
}
