
class ConnectionTest {
    constructor(brain) {
        this.brain = brain;

        this.frameCount = 0;
        this.showingConnections = false;
        this.showingConnectionsIndexes = [];

        this.initializeTest();
    }

    initializeTest() {
    }

    doTest() {
      this.frameCount--;
      if (this.frameCount <= 0) {
        if (this.showingConnections) {
          for (const indexToShow of this.showingConnectionsIndexes) {
            this.brain.hideAllConnections(indexToShow);
          }
          this.showingConnectionsIndexes = [];
          this.showingConnections = false;
          this.frameCount = 2;
        }
        else {
          for (var i = 0; i < 5; i++) {
            const indexToShow = this.getUniqueRandomIndex(1000);
            this.showingConnectionsIndexes.push(indexToShow);
            this.brain.showAllConnections(indexToShow);
          }
          this.showingConnections = true;
          this.frameCount = 5;
        }

      }
    }

    getUniqueRandomIndex(maxIndex) {
      do {
        const indexToShow = Math.floor(Math.random() * maxIndex);
        if (!this.showingConnectionsIndexes.includes(indexToShow)) {
          return indexToShow;
        }
      } while(true);
    }
}

export { ConnectionTest };