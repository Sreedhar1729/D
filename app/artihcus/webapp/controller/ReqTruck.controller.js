sap.ui.define(
    [
        "./BaseController",
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.artihcus.controller.ReqTruck", {
            onInit:  function () {
              
                this._validateDependencies();
                this._loadDependencies();
            
             


            },
            onBackPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("MainPage")
                this.getView().getModel("resultModel").refresh();
            },
            onAfterRendering: function () {
                this._init3DScene();
            },

            _validateDependencies: function () {
                if (typeof THREE === "undefined") {
                    console.error("THREE.js is not loaded. Please check the script source.");
                }
                if (typeof THREE.ColladaLoader === "undefined") {
                    console.error("ColladaLoader is not loaded. Please check the script source.");
                }
            },

            _loadDependencies: function () {
                if (typeof THREE === "undefined") {
                    const script = document.createElement("script");
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
                    script.onload = this._loadColladaLoader.bind(this);
                    script.onerror = function () {
                        console.error("Failed to load THREE.js");
                    };
                    document.head.appendChild(script);
                } else {
                    this._loadColladaLoader();
                }
            },

            _loadColladaLoader: function () {
                if (typeof THREE.ColladaLoader === "undefined") {
                    const loaderScript = document.createElement("script");
                    loaderScript.src = "loaders/ColladaLoader.js";
                    loaderScript.onload = function () {
                        console.log("ColladaLoader loaded successfully");
                        this._init3DScene();
                    }.bind(this);
                    loaderScript.onerror = function () {
                        console.error("Failed to load ColladaLoader");
                    };
                    document.head.appendChild(loaderScript);
                } else {
                    console.log("ColladaLoader is already loaded.");
                    this._init3DScene();
                }
            },

            _init3DScene: function () {
                this.scene = new THREE.Scene();
                
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                this.camera.position.set(20, 15, 30);

                this.renderer = new THREE.WebGLRenderer({ alpha: true });
                this.renderer.setSize(1500, 800);
                this.renderer.outputEncoding = THREE.sRGBEncoding;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1.0;
                this.renderer.shadowMap.enabled = true;

                const canvasContainer = document.getElementById("threejsCanvas");
                if (!canvasContainer) {
                    console.error("Canvas container not found");
                    return;
                }
                canvasContainer.appendChild(this.renderer.domElement);

                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;

                this._addLighting();
              
                this._animate();

            },

            _addLighting: function () {
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                this.scene.add(ambientLight);

                const lightPositions = [
                    { x: 50, y: 50, z: 50 },
                    { x: -50, y: 50, z: 50 },
                    { x: 50, y: 50, z: -50 },
                    { x: -50, y: 50, z: -50 }
                ];

                lightPositions.forEach((pos) => {
                    const light = new THREE.DirectionalLight(0xffffff, 0.5);
                    light.position.set(pos.x, pos.y, pos.z);
                    this.scene.add(light);
                });
            },

           
            
            _animate: function () {
                const animate = () => {
                    requestAnimationFrame(animate);
                    this.controls.update();
                    this.renderer.render(this.scene, this.camera);
                };
                animate();
            }
        });
    }
);

      