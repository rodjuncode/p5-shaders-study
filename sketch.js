const vert = `#ifdef GL_ES
precision mediump float;
#endif

// =====================================
// Built in p5js uniforms and attributes
// =====================================

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;    // Vertex position
attribute vec2 aTexCoord;    // Vertex texture coordinate
attribute vec3 aNormal;      // Vertex normal
attribute vec4 aVertexColor; // Vertex color

// =====================================

varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {

  // Store the vertex position for use in the fragment shader
  vPosition = aPosition;
  vTexCoord = aTexCoord;

  // Set the vertex position without any change besides the view transformations
  // Note: it is important to apply these matrices to get your shape to render in the correct location
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}`;

const frag = `#ifdef GL_ES
precision mediump float;
#endif
  
// Position in world space
varying vec3 vPosition;
// Position in texture space
varying vec2 vTexCoord;

// Ignored
uniform sampler2D uSampler;

uniform float color;
uniform float freq;

void main() {
  // Color based on texture coordinate position
  vec2 st = vTexCoord.xy;
  vec4 tex = texture2D(uSampler, vTexCoord);

  float color = 0.0;
  color += sin(st.x * freq) * 3. + 3.;
  gl_FragColor = vec4(color, color, color, 1.0);

  // Go from red to green on one diagonal and white to black on the other.
  // gl_FragColor = tex * 0.0 + vec4(st.y, color, (st.x + st.y) / 2., 1.); // R,G,B,A
}`;

let S;

function preload() {
  S = createShader(vert, frag);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
  noStroke();
}

function draw() {
  background(255);
  shader(S);
  orbitControl(2, 1, 0.1);

  // rotate(frameCount/100);


  // Define the vertices of the irregular polygon
  let p0 = [
    {x: 0, y: 0},
    {x: -100, y: -200},
    {x: 100, y: -300},
    {x: 200, y: -300},
    {x: 300, y: 100},
    {x: 100, y: 100},
    {x: -100, y: 600},
    {x: -200, y: -100}
  ];
  
  let p1 = [
    {x: 0, y: 0},
    {x: -50, y: -100},
    {x: 50, y: -150},
    {x: 100, y: -50},
    {x: 150, y: 50},
    {x: 50, y: 100},
    {x: -50, y: 50},
    {x: -100, y: -50}
  ];



  // S.setUniform('color', 1.0);
  S.setUniform('freq', 300.0);
  drawPolygon(p0);

  // S.setUniform('color', frameCount/1000);
  S.setUniform('freq', 100.0);
  drawPolygon(p1);
}


function drawPolygon(vertices) {
  beginShape();
  normal(0, 0, 1);

  // Add each vertex to the shape
  for (let i = 0; i < vertices.length; i++) {
    let u = map(vertices[i].x, -300, 300, 0, 1);
    let v = map(vertices[i].y, -300, 300, 0, 1);
    vertex(vertices[i].x, vertices[i].y, u, v);
  }

  endShape(CLOSE); // Use CLOSE to connect the last vertex back to the first
}