
class ModelLoader {
  constructor(brain) {
    this.brain = brain;
  }

  Load(model=null) {
    if (model) {
      this.LoadFromPersistence(model);
    }
    else {
      this.LoadTest();
    }
  }

  LoadFromPersistence(model) {
    // TODO
  }

  LoadTest()
  {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        for (let k = 0; k < 10; k++) {
          this.brain.addNeuron(i*100 + j*10 + k, i, j, k);
        }
      }
    }

    for (let fromIndex = 0; fromIndex < 1000; fromIndex++) {
      const toCount = Math.floor(Math.random() * 26);
      for (let to = 0; to < toCount; to++) {
        const toIndex = Math.floor(Math.random() * 1000);
        this.brain.addConnectionTo(fromIndex, toIndex);
      }
    }
  }
}

export { ModelLoader };