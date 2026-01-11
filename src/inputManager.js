// Keeps the state of keys/buttons
//
// You can check
//
//   inputManager.keys.ArrowLeft.down
//
// to see if the left key is currently held down
// and you can check
//
//   inputManager.keys.ArrowLeft.justPressed
//
// To see if the ArrowLeft key was pressed this frame
class InputManager {
  constructor() {
    this.keys = {};
   
    const addKey = (keyName) => {
      this.keys[keyName] = { down: false, justPressed: false };
    };
    
    addKey('ArrowLeft');
    addKey('ArrowRight');
    addKey('ArrowUp');
    addKey('ArrowDown');
    addKey('KeyA');
    addKey('KeyB');
    
    const setKey = (keyName, pressed) => {
      const keyState = this.keys[keyName];
      if (!keyState) return;

      keyState.justPressed = pressed && !keyState.down;
      keyState.down = pressed;
    };
   
    window.addEventListener('keydown', (e) => {
      setKey(e.code, true);
    });
    window.addEventListener('keyup', (e) => {
      setKey(e.code, false);
    });
  }

  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false;
      }
    }
  }
}

export { InputManager };