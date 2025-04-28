/* 
Ethan Wight
April 27, 2025
CMSC 410
Project 3
*/

// Global WebGL context and shader program variables
var gl;
var program;

// Arrays to store cube positions, colors, rotations
var cubes = [];

// Camera and perspective settings
var eye = vec3(0.0, 0.0, 5.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

// Uniform locations
var modelViewMatrixLoc;
var projectionMatrixLoc;

// Rotation speed (in degrees per frame)
var rotationSpeed = 1.0;

// Initialize everything when the window loads
window.onload = function init() {
    // Get the canvas element and set up WebGL
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set background back to white
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Get uniform locations
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    // Create cube data for rendering
    createCubeBuffers();

    // Initialize with default number of cubes (1)
    initCubes(1);

    // Start rendering
    render();
};

// Create and set up the cube geometry and buffers
function createCubeBuffers() {
    // Define cube vertices
    var vertices = [
        vec4(-0.1, -0.1, 0.1, 1.0),  // 0
        vec4(-0.1, 0.1, 0.1, 1.0),   // 1
        vec4(0.1, 0.1, 0.1, 1.0),    // 2
        vec4(0.1, -0.1, 0.1, 1.0),   // 3
        vec4(-0.1, -0.1, -0.1, 1.0), // 4
        vec4(-0.1, 0.1, -0.1, 1.0),  // 5
        vec4(0.1, 0.1, -0.1, 1.0),   // 6
        vec4(0.1, -0.1, -0.1, 1.0)   // 7
    ];

    // Define cube edges (12 edges total)
    var indices = [
        0, 1,   // Front face edges
        1, 2,
        2, 3,
        3, 0,
        4, 5,   // Back face edges
        5, 6,
        6, 7,
        7, 4,
        0, 4,   // Connecting edges
        1, 5,
        2, 6,
        3, 7
    ];

    // Generate points for all edges
    var points = [];
    
    // For each edge
    for (var i = 0; i < indices.length; i++) {
        points.push(vertices[indices[i]]);
    }

    // Create and bind vertex buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Set up vertex position attribute
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // We'll set colors per cube during rendering
}

// Generate random color
function getRandomColor() {
    return vec4(
        Math.random(),
        Math.random(),
        Math.random(),
        1.0
    );
}

// Get random position in 3D space, ensuring distribution in all 8 eighths
function getRandomPosition() {
    // Get random position but ensure we're using all octants
    // First determine which octant (+ or - in each dimension)
    var xSign = Math.random() < 0.5 ? -1 : 1;
    var ySign = Math.random() < 0.5 ? -1 : 1;
    var zSign = Math.random() < 0.5 ? -1 : 1;
    
    return vec3(
        xSign * (0 + Math.random() * 0.7), 
        ySign * (0 + Math.random() * 0.7),
        zSign * (0 + Math.random() * 0.7)  
    );
}

// Initialize cubes with positions, colors, etc.
function initCubes(count) {
    cubes = [];
    
    // If we have 8 or more cubes, place at least one in each octant
    if (count >= 8) {
        // Create one cube in each of the 8 eighths of space
        for (var x = -1; x <= 1; x += 2) {
            for (var y = -1; y <= 1; y += 2) {
                for (var z = -1; z <= 1; z += 2) {
                    cubes.push({
                        position: vec3(
                            x * (0.4 + Math.random() * 0.6),
                            y * (0.4 + Math.random() * 0.6),
                            z * (0.4 + Math.random() * 0.6)
                        ),
                        color: getRandomColor(),
                        rotation: Math.random() * 360,
                        scale: 1.0
                    });
                }
            }
        }
        
        // Add remaining cubes randomly
        for (var i = 8; i < count; i++) {
            cubes.push({
                position: getRandomPosition(),
                color: getRandomColor(),
                rotation: Math.random() * 360,
                scale: 1.0
            });
        }
    } else {
        // For less than 8 cubes, place them randomly
        for (var i = 0; i < count; i++) {
            cubes.push({
                position: getRandomPosition(),
                color: getRandomColor(),
                rotation: Math.random() * 360,
                scale: 1.0
            });
        }
    }
}

// Handle dropdown selection change
function updateCubeCount() {
    var selectElement = document.getElementById("cubeCount");
    var count = parseInt(selectElement.value);
    initCubes(count);
}

// Render function - called for each frame
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set up perspective projection
    var aspect = gl.canvas.width / gl.canvas.height;
    var projectionMatrix = perspective(45, aspect, 0.1, 10.0);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Update and render each cube
    for (var i = 0; i < cubes.length; i++) {
        var cube = cubes[i];
        
        // Update rotation
        cube.rotation += rotationSpeed;
        if (cube.rotation > 360) {
            cube.rotation -= 360;
        }
        
        // Set model-view matrix for this cube
        var modelViewMatrix = lookAt(eye, at, up);
        
        // Move to cube position, then rotate around its y-axis
        modelViewMatrix = mult(modelViewMatrix, translate(cube.position));
        modelViewMatrix = mult(modelViewMatrix, rotateY(cube.rotation));
        
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        
        // Set this cube's color (same color for all vertices)
        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        
        var cubeColors = [];
        for (var j = 0; j < 24; j++) { // 24 vertices for lines (12 edges × 2 vertices)
            cubeColors.push(cube.color);
        }
        
        gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeColors), gl.STATIC_DRAW);
        
        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        
        // Draw the cube as lines (24 vertices - 12 edges, 2 vertices per edge)
        gl.drawArrays(gl.LINES, 0, 24);
    }
    
    // Request next frame
    requestAnimFrame(render);
}
