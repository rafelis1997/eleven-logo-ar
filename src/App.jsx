import React, { useEffect, useRef } from 'react';
import 'mind-ar/dist/mindar-image.prod.js';
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import 'aframe-extras'

import logoSvg from './assets/logo.svg';
import deathHuntCover from './assets/deathHuntCover.png';
import './App.css';

function App() {
  const sceneRef = useRef(null);
  const scanUi = useRef(null);

  useEffect(() => {
    const sceneEl = sceneRef.current;
    const arSystem = sceneEl.systems["mindar-image-system"];

    const scanEl = scanUi.current;


    async function startAR() {
      await arSystem.start();
    }

    function hideScan() {  
      scanEl.classList.add("hidden");
    }

    function showScan() {  
      console.log("targetLost");
      scanEl.classList.remove("hidden");
    }

    sceneEl.addEventListener('renderstart', startAR);
    sceneEl.addEventListener('targetFound', hideScan);
    sceneEl.addEventListener('targetLost', showScan);

    return async () => {
      await arSystem.stop();
      sceneEl.removeEventListener('renderstart', startAR);
      sceneEl.removeEventListener('targetFound', hideScan);
      sceneEl.removeEventListener('targetLost', showScan);
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="splashContainer">
          <img src={logoSvg} alt="logo" />
        </div>

        <div id="scanUi" ref={scanUi}>
          <div className='scanning'>
            <div className='scanInner'>
              <img src={deathHuntCover} alt="" />
              <div className='scanLine'></div>
            </div>
          </div>
        </div>

        <a-scene
          ref={sceneRef}
          mindar-image={`uiScanning: #scanUi;imageTargetSrc: targets.mind;filterMinCF:0.0001; filterBeta: 0.0001`} 
          color-space="sRGB" 
          renderer="logarithmicDepthBuffer: true;colorManagement: true, physicallyCorrectLights" 
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
          embedded
        >
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0">
            <a-gltf-model animation-mixer="clip: dragonAnim" src="dragon.glb" rotation="0 0 0" position="0 -1.5 0.2" scale="0.5 0.5 0.5" animation="property: rotation; to: 0 360 0; dur: 25000; easing: easeInOutQuad; loop: true; dir: alternate"></a-gltf-model>
          </a-entity>
        </a-scene>
      </div>
    </div>
  )
}

export default App
