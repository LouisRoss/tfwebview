import * as THREE from 'three';

//import { cube } from './cube.js';
//import { primitives } from './primitives.js';
//import { solarSystem } from './solarsystem.js';
//import { lights } from './lights.js';
//import { Neuron } from './neuron.js';
import { Brain } from './brain.js';
import { ModelLoader } from './src/modelLoader.js'

function main() {
  //cube();
  //primitives();
  //solarSystem();
  //lights();
  
  const brain = new Brain();
  const modelLoader = new ModelLoader(brain);
  modelLoader.Load();


  brain.startRendering();
}

main();
