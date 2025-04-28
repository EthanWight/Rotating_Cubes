# Rotating Cubes WebGL Project

## Overview
This WebGL project displays a set of 3D cubes that rotate around their own axes. Users can choose the number of cubes (1, 5, 10, or 20) using a dropdown menu. The cubes are colored randomly and are evenly distributed across different octants of the 3D space for better visual spread when there are 8 or more cubes.

---

## Files

- **rotating_cubes.html**: Main HTML page that includes the canvas, shaders, dropdown selection, and scripts.
- **rotating_cubes.js**: JavaScript file containing the logic for creating cubes, applying transformations, animation, and handling user input.
- **initShaders.js**: Helper script for compiling and linking WebGL shaders.
- **MV.js**: Math library for 3D vectors, matrices, and transformations.
- **webgl-utils.js**: WebGL context setup and requestAnimationFrame utilities.

---

## Features

- **Dynamic Cube Generation**: Choose the number of cubes displayed (1, 5, 10, or 20).
- **Rotation Animation**: Each cube independently rotates around its Y-axis.
- **Randomized Attributes**:
  - Random colors for each cube.
  - Random 3D positions ensuring spread across octants if enough cubes.
- **Camera Setup**:
  - Fixed view looking at the origin from a slight distance.
  - Perspective projection with a 45-degree field of view.
- **Wireframe Cubes**: Only edges of cubes are drawn (using GL.LINES).

---

## How to Run

1. Place all files (**rotating_cubes.html**, **rotating_cubes.js**, **initShaders.js**, **MV.js**, **webgl-utils.js**) into the same directory.
2. Open **rotating_cubes.html** in a WebGL-enabled browser (Chrome, Firefox, Edge, etc.).

No server setup is required.

---

## Controls

| Control          | Description                          |
|------------------|--------------------------------------|
| Number of Cubes  | Dropdown to select 1, 5, 10, or 20 cubes |

Changing the selection updates the displayed cubes immediately.

---

## Project Details

- **Author**: Ethan Wight
- **Date**: April 27, 2025
- **Course**: CMSC 410 - Computer Graphics

---

## Dependencies

- No external libraries needed beyond included local scripts.
- Requires a WebGL-capable browser.

---

## Notes

- Each cube's rotation angle is updated frame-by-frame.
- Wireframe appearance allows seeing through the structure.
- Aspect ratio of the canvas is respected for proper projection.
