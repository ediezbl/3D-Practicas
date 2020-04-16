
var stepX = 0.15;
var stepY = 0.25;
var pala_Jugador = 2;
var pala_CPU = 2;
var puntos_CPU = 0;
var puntos_J1 = 0;
var borders = [];
var inicio = false;
var textMesh;
var file;
function marcador(scene, number1, number2){
  var loader = new THREE.FontLoader();
  loader.load('fonts/helvetiker_regular.typeface.json', function ( font ) {
     var geometry = new THREE.TextGeometry( number1 + "-" + number2, {
       font: font,
       size: 5,
       height: 5,
       bevelEnabled: false,
       bevelThickness: 0.1,
       bevelSize: 0.1,
       bevelOffset: 0.1,
       bevelSegments: 0.1
     });
     var textMaterial = new THREE.MeshNormalMaterial();
      textMesh = new THREE.Mesh(geometry, textMaterial);
      textMesh.position.set(-5,30,0);
      textMesh.rotation.x = -5;
      scene.add(textMesh);
  });
}

function init() {
   var scene = new THREE.Scene();
   var sceneWidth = window.innerWidth - 20;
   var sceneHeight = window.innerHeight - 20;

   var camera = new THREE.PerspectiveCamera(90, sceneWidth / sceneHeight, 0.01, 100);
   camera.position.set(0, -10, 15);
   camera.lookAt(scene.position);

   var renderer = new THREE.WebGLRenderer({
      antialias : true
   });
   renderer.shadowMap.enabled = true;
   renderer.setSize(sceneWidth, sceneHeight);
   document.body.appendChild(renderer.domElement);

   var light = getLight();
   var leftBorder = getBorder("left", 1, 20, 2, -5, 0, 0);
   var rightBorder = getBorder("right", 1, 20, 2, 5, 0, 0);
   var topBorder = getBorder("top", pala_CPU, 1, 2, 0, 10, 0);
   var downBorder = getBorder("down", pala_Jugador, 1, 2, 0, -9.5, 0);
   var sphere = getSphere();
   var floor = getFloor();
   scene.add(light);
   scene.add(leftBorder);
   scene.add(rightBorder);
   scene.add(topBorder);
   scene.add(downBorder);
   scene.add(sphere);
   scene.add(floor);
   marcador(scene,puntos_J1,puntos_CPU);
   borders = [ leftBorder, rightBorder, topBorder, downBorder ];
   animate(sphere, borders, renderer, scene, camera);
}

function comprobarRaqueta(raqueta){
  if (raqueta.position.x <= -2.25){
    raqueta.position.x = -2.25;
  } else if (raqueta.position.x >= 2.25) {
    raqueta.position.x = 2.25;
  }
}
function bola_init(sphere,scene,inicio){
  sphere.position.x = 0;
  sphere.position.y = 0;
  scene.remove(textMesh);
}

function comprobarBola(sphere,scene){
  if (sphere.position.y >= 10){
    bola_init(sphere,scene);
    puntos_J1 += 1;
    restartGame(sphere, scene);
    marcador(scene,puntos_J1,puntos_CPU);
  } else if (sphere.position.y <= -9){
   bola_init(sphere, scene, inicio);
   puntos_CPU += 1;
   restartGame(sphere, scene);
   marcador(scene,puntos_J1,puntos_CPU);
 }
 }
 function restart(){
   inicio = false;
   puntos_J1 = 0;
   puntos_CPU = 0;
 }
function restartGame(sphere,scene){
 if(puntos_J1 == 5){
   restart();
 } else if (puntos_CPU == 5) {
   restart();
 }
}
function Mover_Pala(raqueta){
  document.onkeydown = function(ev){
    console.log(ev.keyCode);
    switch(ev.keyCode){
      case 37:
      raqueta.position.x -= 0.25;
      break;
      case 39:
      raqueta.position.x += 0.25;
      break;
      case 32:
      inicio = true;
      break;
  };
}
comprobarRaqueta(raqueta);
}

function mover_CPU(raqueta,sphere){
raqueta.position.x = sphere.position.x;
if (raqueta.position.x <= -2.25){
  raqueta.position.x = -2.25;
} else if (raqueta.position.x >= 2.25) {
  raqueta.position.x = 2.25;
}
}

function mover_Bola(sphere,inicio,scene){
if(inicio){
  sphere.position.x += stepX;
  sphere.position.y += stepY;
}
comprobarBola(sphere,scene);
}

function animate(sphere, borders, renderer, scene, camera) {
   checkCollision(sphere, borders);
   raqueta_J1 = borders[3];
   raqueta_CPU = borders[2];
   Mover_Pala(raqueta_J1);
   mover_CPU(raqueta_CPU,sphere);
   mover_Bola(sphere,inicio,scene);
   renderer.render(scene, camera);
   requestAnimationFrame(function() {
      animate(sphere, borders, renderer, scene, camera);
   });
}

function getLight() {
   var light = new THREE.DirectionalLight();
   light.position.set(4, 4, 4);
   light.castShadow = true;
   light.shadow.camera.near = 0;
   light.shadow.camera.far = 16;
   light.shadow.camera.left = -8;
   light.shadow.camera.right = 5;
   light.shadow.camera.top = 10;
   light.shadow.camera.bottom = -10;
   light.shadow.mapSize.width = 4096;
   light.shadow.mapSize.height = 4096;
   return light;
}

function getSphere() {
   var geometry = new THREE.SphereGeometry(1, 20, 20);
   file = 'bola.png'
   var mesh = new THREE.Mesh(geometry, getTexture(file));
   mesh.position.z = 1;
   mesh.castShadow = true;
   mesh.name = "sphere";

   return mesh;
}

function getFloor() {
   var geometry = new THREE.PlaneGeometry(10, 20);
   file = 'grass.jpg';
   var mesh = new THREE.Mesh(geometry, getTexture(file));
   mesh.receiveShadow = true;

   return mesh;
}

function getBorder(name, x, y, z, posX, posY, posZ) {
   var geometry = new THREE.BoxGeometry(x, y, z);
   file = 'wood.png'
   var mesh = new THREE.Mesh(geometry, getTexture(file));
   mesh.receiveShadow = true;
   mesh.position.set(posX, posY, posZ);
   mesh.name = name;

   return mesh;
}

function getTexture(file) {
   var texture = new THREE.TextureLoader().load(file);
   var material = new THREE.MeshPhysicalMaterial({
      map : texture
   });
   material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
   material.map.repeat.set(4, 4);
   material.side = THREE.DoubleSide;

   return material;
}

function checkCollision(sphere, borders) {
   var originPosition = sphere.position.clone();

   for (var i = 0; i < sphere.geometry.vertices.length; i++) {
      var localVertex = sphere.geometry.vertices[i].clone();
      var globalVertex = localVertex.applyMatrix4(sphere.matrix);
      var directionVector = globalVertex.sub(sphere.position);
      var ray = new THREE.Raycaster(originPosition, directionVector.clone().normalize());
      var collisionResults = ray.intersectObjects(borders);
      if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
         // Collision detected
         if (collisionResults[0].object.name == "left" || collisionResults[0].object.name == "right") {
            stepX *= -1;
         }
         if (collisionResults[0].object.name == "down" || collisionResults[0].object.name == "top") {
            stepY *= -1;
         }
         break;
      }
   }
}
