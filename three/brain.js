import * as THREE from 'three';
import {InputManager} from './src/inputManager.js';
import {Neuron} from './neuron.js';
import {ConnectionTest} from './tests/connectionTest.js';

//import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

class Brain {
  constructor() {
    this.baseNeuron = new Neuron();
    this.neurons = new Map();
    this.spread = 15;

    this.canvas = document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.physicallyCorrectLights = true;

    this.fov = 40;
    this.aspect = 2;   // the canvas default
    this.near = 0.1;
    this.far = 1000;
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    this.camera.position.z = this.spread * 10 + 25;
    //this.camera.position.set(0, 10, 20);
    
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0, this.spread, 0);
    this.controls.update();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xAAAAAA);

    this.inputManager = new InputManager();
    this.connectionTest = new ConnectionTest(this);

    this.initializeVisualization();
  }

  addNeuron(index, x, y, z) {
    const neuron = this.baseNeuron.render(index);
    neuron.position.x = x * this.spread;
    neuron.position.y = y * this.spread;
    neuron.position.z = z * this.spread;

    this.scene.add(neuron);
    this.neurons.set(index, neuron);
  }

  addConnectionTo(indexFrom, indexTo) {
    const neuronFrom = this.neurons.get(indexFrom);
    if (neuronFrom) {
      neuronFrom.toIndexes.push(indexTo);
    }
  }

  showAllConnections(indexFrom) {
    const neuronFrom = this.neurons.get(indexFrom);
    if (neuronFrom) {
      for (const indexTo of neuronFrom.toIndexes) {
        this.addConnection(indexFrom, indexTo);
      }

      this.baseNeuron.reRender(neuronFrom, true);
    }
  }

  hideAllConnections(indexFrom) {
    const neuronFrom = this.neurons.get(indexFrom);
    if (neuronFrom) {
      for (const lineTo of neuronFrom.connectionResources) {
        this.scene.remove(lineTo);
        lineTo.geometry.dispose();
        lineTo.material.dispose();
        if (lineTo.dispose) {
          lineTo.dispose();
        }
      }

      neuronFrom.connectionResources.clear();

      this.baseNeuron.reRender(neuronFrom, false);
    }
  }

  addConnection(indexFrom, indexTo) {
    const neuronFrom = this.neurons.get(indexFrom);
    const neuronTo = this.neurons.get(indexTo);

    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(neuronFrom.position.x, neuronFrom.position.y, neuronFrom.position.z - 7),
      new THREE.Vector3(neuronFrom.position.x - .1 * (neuronFrom.position.x - neuronTo.position.x), neuronFrom.position.y - .1 * (neuronFrom.position.y - neuronTo.position.y), neuronFrom.position.z - 8),
      new THREE.Vector3(neuronTo.position.x - .1 * (neuronTo.position.x - neuronFrom.position.x), neuronTo.position.y - .1 * (neuronTo.position.y - neuronFrom.position.y), neuronTo.position.z + 8),
      new THREE.Vector3(neuronTo.position.x, neuronTo.position.y, neuronTo.position.z)
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    this.scene.add(line);
    neuronFrom.connectionResources.add(line);
  }

  initializeVisualization() {
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      this.scene.add(light);
    }
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(1, -2, -4);
      this.scene.add(light);
    }
  }

  startRendering() {
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
      
    var boundRender = (function render(time) {
      time *= 0.001;
  
      if (resizeRendererToDisplaySize(this.renderer)) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }

      const rotatingNeuron = this.neurons.get(9);
      const rot = time * .5;
      rotatingNeuron.rotation.z = rot;
      /*
      this.neurons.forEach((obj, ndx) => {
        if (ndx == 9) {
          const speed = .1 + ndx * .05;
          const rot = time * speed;
          //obj.rotation.x = rot;
          obj.rotation.z = rot;
        }
      });
      */

      if (this.inputManager.keys.ArrowUp.down) {
        this.camera.position.z -= 1;
      }
  
      if (this.inputManager.keys.ArrowDown.down) {
        this.camera.position.z += 1;
      }

//      if (this.inputManager.keys.KeyA.down) {
        this.connectionTest.doTest();
//      }

  
      this.renderer.render(this.scene, this.camera);
      this.inputManager.update();
      this.controls.update();
  
      requestAnimationFrame(boundRender);
    }).bind(this);
    
    requestAnimationFrame(boundRender);
  }
}

export { Brain };