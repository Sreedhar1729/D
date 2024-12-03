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
                this._loadDAEModel();
                this._loadBackSideModel();
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

            _loadDAEModel: function () {
                const loader = new THREE.ColladaLoader();
                loader.load(
                    "models/truck25.dae",
                    (collada) => {
                        this._processModelTextures(collada.scene);
                        collada.scene.position.set(0, 0, 0);
                        collada.scene.scale.set(0.6, 0.6, 0.6);
                        this.scene.add(collada.scene);
                        this._addTransparentContainer(collada.scene);
                        console.log("DAE Model loaded successfully.");
                    },
                    undefined,
                    (error) => {
                        console.error("Error loading DAE model:", error);
                    }
                );
            },

            _loadBackSideModel: function () {
                const loader = new THREE.ColladaLoader();
                loader.load(
                    "models/truckBackSide2.dae",
                    (collada) => {
                        this._processModelTextures(collada.scene);
                        collada.scene.position.set(0, -0.3, -1);
                        collada.scene.scale.set(0.6, 0.6, 0.6);
                        this.scene.add(collada.scene);
                        console.log("Truck backside model loaded successfully.");
                    },
                    undefined,
                    (error) => {
                        console.error("Error loading truck backside model:", error);
                    }
                );
            },

            _processModelTextures: function (scene) {
                const textureLoader = new THREE.TextureLoader();
                const defaultTexture = textureLoader.load("models/textures/Default_Texture.png");

                const textures = {
                    Frame: {
                        baseColor: "models/textures/Frame_Mixed_AO.png",
                        emissive: "models/textures/Frame_Emissive.png",
                        metallic: "models/textures/Frame_Metallic.png",
                        normal: "models/textures/Frame_Normal_OpenGL.png",
                        ao: "models/textures/Frame_Mixed_AO.png",
                        roughness: "models/textures/Frame_Roughness.png",
                    },
                    Cabin: {
                        baseColor: "models/textures/Cabin_Base_color.png",
                        normal: "models/textures/Cabin_Normal_OpenGL.png",
                        ao: "models/textures/Cabin_Mixed_AO.png",
                        roughness: "models/textures/Cabin_Roughness.png",
                    },
                    Wheel: {
                        baseColor: "models/textures/Wheel_Base_color.png",
                    },
                    Plane: {
                        baseColor: "models/textures/plate-mat.jpg",
                    },
                };

                scene.traverse((child) => {
                    if (child.isMesh) {
                        const materials = Array.isArray(child.material) ? child.material : [child.material];
                        materials.forEach((material) => {
                            const materialName = material.name;
                            console.log(`Material name: ${materialName}`);
                            if (textures[materialName]) {
                                const textureSet = textures[materialName];
                                material.map = this._loadTexture(textureSet.baseColor, defaultTexture);
                                material.emissiveMap = this._loadTexture(textureSet.emissive, defaultTexture);
                                material.metalnessMap = this._loadTexture(textureSet.metallic, defaultTexture);
                                material.normalMap = this._loadTexture(textureSet.normal, defaultTexture);
                                material.aoMap = this._loadTexture(textureSet.ao, defaultTexture);
                                material.roughnessMap = this._loadTexture(textureSet.roughness, defaultTexture);
                                material.needsUpdate = true;
                            } else {
                                console.warn(`No textures found for material: ${materialName}`);
                            }
                        });
                    }
                });
            },

            _loadTexture: function (path, fallbackTexture) {
                const textureLoader = new THREE.TextureLoader();
                return textureLoader.load(
                    path,
                    (texture) => {
                        console.log(`Texture loaded: ${path}`);
                    },
                    undefined,
                    (error) => {
                        console.error(`Failed to load texture: ${path}. Using fallback texture.`);
                        return fallbackTexture;
                    }
                );
            },

            _addTransparentContainer: function (truckScene) {
                const containerDimensions = { width: 2.13, height: 2.13, length: 4.27 };
            
                // Create geometry for the container
                const containerGeometry = new THREE.BoxGeometry(
                    containerDimensions.length,  // Length (Z-axis)
                    containerDimensions.height,  // Height (Y-axis)
                    containerDimensions.width    // Width (X-axis)
                );
            
                // Define a transparent material
                const transparentMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,       // Green
                    opacity: 0.5,          // Semi-transparent
                    transparent: true,     // Enables transparency
                });
            
                // Define an opaque material for the base, visible from both sides
                const opaqueMaterial = new THREE.MeshBasicMaterial({
                    color: 0x808080,       // Green
                    transparent: false,    // Fully opaque
                    side: THREE.DoubleSide // Make it visible from both sides
                });
            
                // Assign materials to each face (6 sides: +X, -X, +Y, -Y, +Z, -Z)
                const materials = [
                    transparentMaterial, // Right face (+X)
                    transparentMaterial, // Left face (-X)
                    transparentMaterial, // Top face (+Y)
                    opaqueMaterial,      // Bottom face (-Y, base, double-sided)
                    transparentMaterial, // Front face (+Z)
                    transparentMaterial, // Back face (-Z)
                ];
            
                // Create the mesh with geometry and materials
                const container = new THREE.Mesh(containerGeometry, materials);
            
                // Position and rotate the container
                container.position.set(0.1, 2.05, -3.6); // Position (X, Y, Z)
                container.rotation.y = -1.6;            // Rotate around Y-axis
            
                // Add the container to the scene
                this.scene.add(container);
            
                console.log("Transparent container with a non-transparent double-sided base added.");
                this._LoadData()
            },
            
           
            _LoadData: function () {
                var oData = this.getOwnerComponent().getModel("resultModel").getData();
                var ProductDetails = oData.Products;
                var VehicleType = oData.RequiredTrucks;
            
                // Assuming container is already created
                this._addProductsToContainer(ProductDetails);
            },
            
            _addProductsToContainer: function (ProductDetails, containerDimensions) {
                let currentX = -containerDimensions.length / 2 + 0.5; // Start X position (centered in container)
                let currentY = 0.5; // Start Y position (on the floor of the container)
                let currentZ = -containerDimensions.width / 2 + 0.5; // Start Z position (centered in container)
                const spacing = 0.1; // Spacing between products
            
                ProductDetails.forEach((product) => {
                    const productWidth = parseFloat(product.width);
                    const productHeight = parseFloat(product.height);
                    const productLength = parseFloat(product.length);
                    const quantity = parseInt(product.Quantity);
            
                    for (let i = 0; i < quantity; i++) {
                        // Check if the product fits in the current layer
                        if (currentX + productLength / 2 > containerDimensions.length / 2) {
                            currentX = -containerDimensions.length / 2 + 0.5;
                            currentZ += productWidth + spacing;
            
                            // Check if the row is full and move to the next layer
                            if (currentZ + productWidth / 2 > containerDimensions.width / 2) {
                                currentZ = -containerDimensions.width / 2 + 0.5;
                                currentY += productHeight + spacing;
                            }
                        }
            
                        // Ensure the products do not exceed the container's height
                        if (currentY + productHeight / 2 > containerDimensions.height) {
                            console.error("Container is full. Cannot add more products.");
                            break;
                        }
            
                        // Create product geometry
                        const productGeometry = new THREE.BoxGeometry(productLength, productHeight, productWidth);
            
                        // Create product material with random color
                        const randomColor = Math.random() * 0xffffff;
                        const productMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
            
                        // Create the product mesh
                        const productMesh = new THREE.Mesh(productGeometry, productMaterial);
            
                        // Position the product
                        productMesh.position.set(currentX, currentY, currentZ);
            
                        // Add borders using EdgesGeometry
                        const edgesGeometry = new THREE.EdgesGeometry(productGeometry);
                        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black border
                        const border = new THREE.LineSegments(edgesGeometry, edgesMaterial);
                        border.position.copy(productMesh.position);
            
                        // Create text for product number
                        const textCanvas = document.createElement("canvas");
                        const textContext = textCanvas.getContext("2d");
                        textCanvas.width = 256;
                        textCanvas.height = 256;
            
                        // Draw product number on canvas
                        textContext.fillStyle = "white";
                        textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
                        textContext.font = "Bold 30px Arial";
                        textContext.fillStyle = "black";
                        textContext.fillText(product.Product, 20, 130);
            
                        // Create text material
                        const textTexture = new THREE.CanvasTexture(textCanvas);
                        const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture });
                        const textGeometry = new THREE.PlaneGeometry(productLength, productHeight / 2);
            
                        // Create text mesh
                        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                        textMesh.position.set(
                            currentX,
                            currentY + productHeight / 2 + 0.1, // Slightly above the product
                            currentZ
                        );
            
                        // Group product and its border
                        const productGroup = new THREE.Group();
                        productGroup.add(productMesh);
                        productGroup.add(border);
                        productGroup.add(textMesh);
            
                        // Add product group to the scene
                        this.scene.add(productGroup);
            
                        // Update X position for the next product
                        currentX += productLength + spacing;
                    }
                });
            
                console.log("Products created and placed inside the container.");
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

      