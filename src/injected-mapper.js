/*
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {

  alert('Now mapping Joy-Con to this tab! 🎮');

  if ('GamepadEvent' in window) {
    window.addEventListener("gamepadconnected", e => { addGamepad(e.gamepad); });
    window.addEventListener("gamepaddisconnected", e => { removeGamepad(e.gamepad); });
  } else {
    console.log('Setting interval');
    setInterval(scanGamepads, 500);
  }

  const activeGamepads = {};
  const heldButtons = {};

  function addGamepad(gamepad) {
    activeGamepads[gamepad.index] = gamepad;
    heldButtons[gamepad.index] = {};
    window.requestAnimationFrame(updateStatus);
  }

  function removegamepad(gamepad) {
    delete activeGamepads[gamepad.index];
    delete heldButtons[gamepad.index];
  }

  function updateStatus() {
    scanGamepads();
    let seenGamepad = false;

    for (let gIdx in activeGamepads) {
      var curGamepad = activeGamepads[gIdx];
      seenGamepad = true;
      
      for (let bIdx = 0; bIdx < curGamepad.buttons.length; bIdx++) {
        const button = curGamepad.buttons[bIdx];

        if (typeof(button) == "object") {
          if (button.pressed) {
            if (!heldButtons[gIdx][bIdx]) {
              heldButtons[gIdx][bIdx] = true;
              triggerMappedKey(bIdx);
            }
          } else if(heldButtons[gIdx][bIdx]) {
            heldButtons[gIdx][bIdx] = false;
          }
        }
      }
    }

    if (seenGamepad) {
      window.requestAnimationFrame(updateStatus);
    }
  }

  function triggerMappedKey(buttonId) {
    const arrowRight = {
      'code': 'ArrowRight',
      'key': 'ArrowRight',
      'keyCode': 39,
      'which': 39,
      'bubbles': true,
      'cancelable': true,
      'composed': true,
    };
    
    const arrowLeft = {
      'code': 'ArrowLeft',
      'key': 'ArrowLeft',
      'keyCode': 37,
      'which': 37,
      'bubbles': true,
      'cancelable': true,
      'composed': true,
    };
    
    const keyEvent = new KeyboardEvent('keydown', (buttonId == 3 ? arrowRight : arrowLeft));
    let target = document.activeElement;
    
    while (target.contentDocument) {
      target = target.contentDocument.activeElement;
    }
    
    target.dispatchEvent(keyEvent);
  }
  
  function scanGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    for (let gIdx = 0; gIdx < gamepads.length; gIdx++) {
      if (gamepads[gIdx]) {
        if (!(gamepads[gIdx].index in activeGamepads)) {
          addGamepad(gamepads[gIdx]);
        } else {
          activeGamepads[gamepads[gIdx].index] = gamepads[gIdx];
        }
      }
    }
  }

})();