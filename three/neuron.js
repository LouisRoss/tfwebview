import * as THREE from './node_modules/three/src/Three.js';

const objects = [];
const spread = 15;

class Neuron {
  constructor() {
    this.radius = 7;
    this.index = 0;
    this.bodyMaterialColor = 0x4070E0;
    this.dendriteMaterialColor = 0xC0B0C0;
    this.spikingMaterialColor = 0xffffff;
    this.toIndexes = [];
    this.connectionResources = new Set();
  }

  createMaterial(color) {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.FrontSide,
    });

    const hue = 1;
    const saturation = .5;
    const luminance = 1;
    material.color.setHSL(hue, saturation, luminance);
    material.color.set(color);

    return material;
  }

  reRender(neuron, spiking) {
    for (const child of neuron.children) {
      if (spiking) {
        child.material.color.set(this.spikingMaterialColor);
      }
      else {
        if (child.geometry instanceof THREE.TetrahedronGeometry) {
          child.material.color.set(this.bodyMaterialColor);
        }
        else {
          child.material.color.set(this.dendriteMaterialColor);
        }
      }
    }
  }

  render(index) {
    const neuron = new THREE.Object3D();
    neuron.index = index;
    neuron.toIndexes = [];
    neuron.connectionResources = new Set();

    return this.renderChildren(neuron);
  }
  
  renderChildren(neuron) {
    const mesh1 = new THREE.Mesh(new THREE.TetrahedronGeometry(this.radius), this.createMaterial(this.bodyMaterialColor));
    mesh1.rotation.y = 2 * Math.PI / 8;
    mesh1.rotation.x = Math.atan(1 / Math.sqrt(2));
    neuron.add(mesh1);
    const mesh2 = new THREE.Mesh(new THREE.TetrahedronGeometry(this.radius), this.createMaterial(this.bodyMaterialColor));
    mesh2.rotation.y = -2 * Math.PI / 8;
    mesh2.rotation.x = -1 * Math.atan(1 / Math.sqrt(2));
    neuron.add(mesh2);
    const mesh3 = new THREE.Mesh(new THREE.CircleGeometry(this.radius/2, 12), this.createMaterial(this.dendriteMaterialColor));
    mesh3.position.z = 2.5;
    neuron.add(mesh3);
    
    /*
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2;  // after the grid
    axes.visible = true;
    mesh3.add(axes);
    */
    return neuron;
  }
}

export { Neuron };