//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene <-- FOLLOWING THIS TO MAKE A CUBE

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';

const blueSkyMap = [
    "https://i.imgur.com/EtTl39n.png","https://i.imgur.com/FysCyCf.png", //px + nx
    "https://i.imgur.com/1UtcqoG.png","https://i.imgur.com/P9zTn8E.png",
    "https://i.imgur.com/DIbW2UM.png","https://i.imgur.com/70JqLfP.png"
];

const redSkyMap = [
    "https://i.imgur.com/y1m0QXk.png","https://i.imgur.com/ccZsv2N.png",
    "https://i.imgur.com/5QcQItB.png","https://i.imgur.com/udNgq1F.png",
    "https://i.imgur.com/wIYG1fZ.png","https://i.imgur.com/E9389EW.png"
]

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const bgTexture = new THREE.CubeTextureLoader().load(blueSkyMap);
const redSkyTexture = new THREE.CubeTextureLoader().load(redSkyMap);
const netherrackTexture = new THREE.TextureLoader().load('https://i.imgur.com/51TgTZG.png');
const obsidianTexture = new THREE.TextureLoader().load('https://i.imgur.com/1vZ9DK7.png');
const netherLight = new THREE.AmbientLight( 0xFFFFFF ); // white light
const normalLight = new THREE.AmbientLight(0x040404); // softer white light
scene.add( netherLight );


const targetWidth = 2
const targetHeight = 3

const renderTarget = new THREE.WebGLRenderTarget();
renderTarget.setSize(targetWidth*1024,targetHeight*1024);

const secondaryCamera = new THREE.PerspectiveCamera(75, (targetWidth*1024)/(targetHeight*1024),0.1,1000);
secondaryCamera.position.y = -28.4;
secondaryCamera.position.x = 5.5;
secondaryCamera.position.z = 9;

secondaryCamera.lookAt(new THREE.Vector3(10, 5, -10));

const secScene = new THREE.Scene();
secScene.add(normalLight);
secScene.background = bgTexture;


const targetMaterial = new THREE.MeshPhongMaterial({map:renderTarget.texture});
targetMaterial.side = THREE.DoubleSide;

const targetPlane = new THREE.Mesh(new THREE.PlaneGeometry(targetWidth,targetHeight,32),targetMaterial);


targetPlane.rotation.y = 0;
targetPlane.position.x = 5.5;
targetPlane.position.y = 3;
targetPlane.position.z = 5;

scene.add(targetPlane);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera,renderer.domElement);
controls.mouseButtons = {
    RIGHT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.PAN
}
controls.enableDamping = true;
controls.minDistance = 1;
controls.maxDistance = 100;
controls.enablePan = true;
controls.cursor = new THREE.Vector3(5.5,1.6,9);
controls.target = new THREE.Vector3(5.5,1.6,9);


controls.update();

//scene.background = new THREE.Color(0xa8def0);
scene.background = redSkyTexture;

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({map:netherrackTexture});
const obsidianMaterial = new THREE.MeshBasicMaterial({map:obsidianTexture});
const grassMaterial = new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load("https://i.imgur.com/9MBd5pZ.png")});
const cube = new THREE.Mesh(geometry,material);
scene.add(cube);
camera.position.z=9;
camera.position.y=1.6;
camera.position.x=5.5;



for(let i = 0; i < 12; i++){
    for (let j = 0; j < 12; j++){   
        let floorBlock = new THREE.Mesh(geometry,material);
        floorBlock.position.z = j;
        floorBlock.position.x = i;
        floorBlock.position.y = 0;
        scene.add(floorBlock);
        let lowerBlock = new THREE.Mesh(geometry,grassMaterial);
        lowerBlock.position.z = j;
        lowerBlock.position.x = i;
        lowerBlock.position.y = -30;
        secScene.add(lowerBlock)
    }
}

for (let i = 0; i < 5; i++){
    for (let j = 0; j < 4; j++){
        let frameBlock = new THREE.Mesh(geometry,obsidianMaterial);
        let lowerFrame = new THREE.Mesh(geometry,obsidianMaterial);
        
        frameBlock.position.z = 5;
        frameBlock.position.x = 4+j;
        frameBlock.position.y = 1+i;
        lowerFrame.position.x = 4+j;
        lowerFrame.position.y = -29 + i;
        lowerFrame.position.z = 5;
        if (i < 1 || i > 3){
            scene.add(frameBlock);
        }
        else if (j < 1 || j > 2){
            scene.add(frameBlock);
        }
    }
}


function flip(){
    renderer.setRenderTarget(renderTarget);
    renderer.render(secScene,secondaryCamera);
    renderer.setRenderTarget(null);

    secondaryCamera.rotation.x = camera.rotation.x;
    secondaryCamera.rotation.y = camera.rotation.y;
    secondaryCamera.rotation.z = camera.rotation.z;

    controls.update();
    renderer.render(scene,camera);


    
}
renderer.setAnimationLoop(flip);
