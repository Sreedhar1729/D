sap.ui.define(["./BaseController"],function(e){"use strict";return e.extend("com.app.artihcus.controller.ReqTruck",{onInit:function(){this._validateDependencies();this._loadDependencies()},onBackPress:function(){const e=this.getOwnerComponent().getRouter();e.navTo("MainPage");this.getView().getModel("resultModel").refresh()},onAfterRendering:function(){this._init3DScene()},_validateDependencies:function(){if(typeof THREE==="undefined"){console.error("THREE.js is not loaded. Please check the script source.")}if(typeof THREE.ColladaLoader==="undefined"){console.error("ColladaLoader is not loaded. Please check the script source.")}},_loadDependencies:function(){if(typeof THREE==="undefined"){const e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";e.onload=this._loadColladaLoader.bind(this);e.onerror=function(){console.error("Failed to load THREE.js")};document.head.appendChild(e)}else{this._loadColladaLoader()}},_loadColladaLoader:function(){if(typeof THREE.ColladaLoader==="undefined"){const e=document.createElement("script");e.src="loaders/ColladaLoader.js";e.onload=function(){console.log("ColladaLoader loaded successfully");this._init3DScene()}.bind(this);e.onerror=function(){console.error("Failed to load ColladaLoader")};document.head.appendChild(e)}else{console.log("ColladaLoader is already loaded.");this._init3DScene()}},_init3DScene:function(){this.scene=new THREE.Scene;this.scene.background=new THREE.Color(8421504);this.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);this.camera.position.set(20,15,30);this.renderer=new THREE.WebGLRenderer({alpha:true});this.renderer.setSize(1500,800);this.renderer.outputEncoding=THREE.sRGBEncoding;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1;this.renderer.shadowMap.enabled=true;const e=document.getElementById("threejsCanvas");if(!e){console.error("Canvas container not found");return}e.appendChild(this.renderer.domElement);this.controls=new THREE.OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this._addLighting();this._loadDAEModel();this._loadBackSideModel();this._animate()},_addLighting:function(){const e=new THREE.AmbientLight(16777215,.8);this.scene.add(e);const o=[{x:50,y:50,z:50},{x:-50,y:50,z:50},{x:50,y:50,z:-50},{x:-50,y:50,z:-50}];o.forEach(e=>{const o=new THREE.DirectionalLight(16777215,.5);o.position.set(e.x,e.y,e.z);this.scene.add(o)})},_loadDAEModel:function(){const e=new THREE.ColladaLoader;e.load("models/truck25.dae",e=>{this._processModelTextures(e.scene);e.scene.position.set(0,0,0);e.scene.scale.set(.6,.6,.6);this.scene.add(e.scene);this._addTransparentContainer(e.scene);console.log("DAE Model loaded successfully.")},undefined,e=>{console.error("Error loading DAE model:",e)})},_loadBackSideModel:function(){const e=new THREE.ColladaLoader;e.load("models/truckBackSide2.dae",e=>{this._processModelTextures(e.scene);e.scene.position.set(0,-.3,-1);e.scene.scale.set(.6,.6,.6);this.scene.add(e.scene);console.log("Truck backside model loaded successfully.")},undefined,e=>{console.error("Error loading truck backside model:",e)})},_processModelTextures:function(e){const o=new THREE.TextureLoader;const n=o.load("models/textures/Default_Texture.png");const t={Frame:{baseColor:"models/textures/Frame_Mixed_AO.png",emissive:"models/textures/Frame_Emissive.png",metallic:"models/textures/Frame_Metallic.png",normal:"models/textures/Frame_Normal_OpenGL.png",ao:"models/textures/Frame_Mixed_AO.png",roughness:"models/textures/Frame_Roughness.png"},Cabin:{baseColor:"models/textures/Cabin_Base_color.png",normal:"models/textures/Cabin_Normal_OpenGL.png",ao:"models/textures/Cabin_Mixed_AO.png",roughness:"models/textures/Cabin_Roughness.png"},Wheel:{baseColor:"models/textures/Wheel_Base_color.png"},Plane:{baseColor:"models/textures/plate-mat.jpg"}};e.traverse(e=>{if(e.isMesh){const o=Array.isArray(e.material)?e.material:[e.material];o.forEach(e=>{const o=e.name;console.log(`Material name: ${o}`);if(t[o]){const s=t[o];e.map=this._loadTexture(s.baseColor,n);e.emissiveMap=this._loadTexture(s.emissive,n);e.metalnessMap=this._loadTexture(s.metallic,n);e.normalMap=this._loadTexture(s.normal,n);e.aoMap=this._loadTexture(s.ao,n);e.roughnessMap=this._loadTexture(s.roughness,n);e.needsUpdate=true}else{console.warn(`No textures found for material: ${o}`)}})}})},_loadTexture:function(e,o){const n=new THREE.TextureLoader;return n.load(e,o=>{console.log(`Texture loaded: ${e}`)},undefined,n=>{console.error(`Failed to load texture: ${e}. Using fallback texture.`);return o})},_addTransparentContainer:function(e){const o={width:2.13,height:2.13,length:4.27};const n=new THREE.BoxGeometry(o.length,o.height,o.width);const t=new THREE.MeshBasicMaterial({color:65280,opacity:.5,transparent:true});const s=new THREE.MeshBasicMaterial({color:8421504,transparent:false,side:THREE.DoubleSide});const a=[t,t,t,s,t,t];const r=new THREE.Mesh(n,a);r.position.set(.1,2.05,-3.6);r.rotation.y=-1.6;this.scene.add(r);console.log("Transparent container with a non-transparent double-sided base added.")},_animate:function(){const e=()=>{requestAnimationFrame(e);this.controls.update();this.renderer.render(this.scene,this.camera)};e()}})});
//# sourceMappingURL=ReqTruck.controller.js.map