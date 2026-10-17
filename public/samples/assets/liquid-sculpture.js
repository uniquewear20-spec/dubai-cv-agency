/* Liquid sculpture: a plain-JS port of the "Sculpture Hero — liquid particle hero" React component
   by guglielmogiannattasio.it (supplied by the client for this collection).

   The image is rebuilt from GPU-simulated particles sampled from its own pixels. The cursor turns the
   material liquid; it settles back into the crisp image. WebGL2 + float render targets are required;
   without them the page keeps showing the static image.

   Changes from the original: no React; the particle grid is sized by area (so tall portraits don't
   produce several hundred thousand particles); everything else (shaders, simulation, timings) is kept.

   Usage:
     var eng = new LiquidSculpture(canvas, options, onFail);
     eng.onFirstFrame = fn;            // called once the canvas has really drawn
     eng.setImage(img);                // a loaded, same-origin <img>
     eng.resize(cssW, cssH, {x, y, w, h});
     eng.pointer("move"|"down"|"up"|"leave", x, y, isTouch);
     eng.setVisible(bool); eng.setOptions({...}); eng.destroy();  */
(function () {
  "use strict";
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  var NOISE = [
    "float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }",
    "float vnoise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);",
    "  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x), u.y); }",
    "vec2 ambientField(vec2 uv, float t){",
    "  vec2 q = uv*vec2(3.2,1.7);",
    "  vec2 a = vec2(vnoise(q+vec2(t*0.11,0.0))-0.5, vnoise(q+vec2(5.2,t*0.08)+3.1)-0.5);",
    "  vec2 q2 = uv*vec2(7.5,4.0) + vec2(-t*0.19, t*0.13);",
    "  vec2 b = vec2(vnoise(q2+1.7)-0.5, vnoise(q2+9.3)-0.5);",
    "  return a + b*0.45;",
    "}"
  ].join("\n");

  var ENERGY = [
    "float energyAt(vec2 rectPx, vec2 mouse, float radius, float presence, float wakeEnergy){",
    "  vec2 d = rectPx - mouse;",
    "  float f = exp(-dot(d,d)/(radius*radius))*presence;",
    "  return smoothstep(0.06, 0.5, f*1.15 + wakeEnergy*1.7);",
    "}"
  ].join("\n");

  var QUAD_VS = "#version 300 es\nlayout(location=0) in vec2 aPos;\nout vec2 vUv;\nvoid main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }\n";

  var FLOW_FS = [
    "#version 300 es",
    "precision highp float;",
    "in vec2 vUv;",
    "out vec4 o;",
    "uniform sampler2D uPrev;",
    "uniform vec2 uTexel;",
    "uniform vec2 uMouse;",
    "uniform vec2 uVel;",
    "uniform vec2 uSize;",
    "uniform float uRadius;",
    "uniform float uPresence;",
    "uniform float uDecay;",
    "vec2 decV(vec4 c){ return (c.rg*255.0-128.0)/127.0; }",
    "void main(){",
    "  vec2 v0 = decV(texture(uPrev, vUv));",
    "  vec2 uv = vUv - v0*uTexel*2.5;",
    "  vec4 c = texture(uPrev, uv)*0.52",
    "    + 0.12*(texture(uPrev, uv+vec2(uTexel.x,0.0)) + texture(uPrev, uv-vec2(uTexel.x,0.0))",
    "          + texture(uPrev, uv+vec2(0.0,uTexel.y)) + texture(uPrev, uv-vec2(0.0,uTexel.y)));",
    "  vec2 v = decV(c);",
    "  float p = c.b;",
    "  vec2 d = (vUv-uMouse)*uSize;",
    "  float f = exp(-dot(d,d)/(uRadius*uRadius))*uPresence;",
    "  float sp = clamp(length(uVel)*2.5, 0.0, 1.0);",
    "  v += uVel*f*0.22;",
    "  p = max(p, f*sp);",
    "  v *= uDecay;",
    "  p *= uDecay;",
    "  v = sign(v)*max(abs(v)-1.2/127.0, 0.0);",
    "  p = max(p-1.2/255.0, 0.0);",
    "  v = clamp(v, -1.0, 1.0);",
    "  o = vec4((v*127.0+128.0)/255.0, p, 1.0);",
    "}"
  ].join("\n");

  var SIM_FS = [
    "#version 300 es",
    "precision highp float;",
    "out vec4 o;",
    "uniform sampler2D uState;",
    "uniform sampler2D uHome;",
    "uniform sampler2D uFlow;",
    "uniform vec2 uSize;",
    "uniform vec2 uMouse;",
    "uniform float uRadius;",
    "uniform float uPresence;",
    "uniform float uStrength;",
    "uniform float uSpread;",
    "uniform float uTurb;",
    "uniform float uReturn;",
    "uniform float uTime;",
    "uniform float uDt;",
    "uniform float uIntro;",
    NOISE,
    "vec2 curl(vec2 p){",
    "  const float e = 0.35;",
    "  float a = vnoise(p+vec2(0.0,e)) - vnoise(p-vec2(0.0,e));",
    "  float b = vnoise(p+vec2(e,0.0)) - vnoise(p-vec2(e,0.0));",
    "  return vec2(a, -b)/(2.0*e);",
    "}",
    "void main(){",
    "  ivec2 ij = ivec2(gl_FragCoord.xy);",
    "  vec4 hm = texelFetch(uHome, ij, 0);",
    "  if(hm.w <= 0.0){ o = vec4(0.0); return; }",
    "  vec4 st = texelFetch(uState, ij, 0);",
    "  vec2 off = st.xy;",
    "  vec2 vel = st.zw;",
    "  float sd = hm.z;",
    "  float light = 0.45 + sd*1.1;",
    "  vec2 p = hm.xy*uSize + off;",
    "  vec4 fl = texture(uFlow, clamp(p/uSize, 0.0, 1.0));",
    "  vec2 wake = (fl.rg*255.0-128.0)/127.0;",
    "  float pr = fl.b;",
    "  vec2 toM = p - uMouse;",
    "  float r2 = dot(toM,toM);",
    "  float f = exp(-r2/(uRadius*uRadius))*uPresence;",
    "  vec2 n = toM*inversesqrt(r2+1.0);",
    "  float e = clamp(pr*2.0 + f, 0.0, 1.0);",
    "  vec2 acc = vec2(0.0);",
    "  acc += n*f*1.25*uStrength*uSpread*light;",
    "  acc += vec2(-n.y, n.x)*f*1.45*uStrength*uSpread*(0.4+sd);",
    "  acc += (wake*42.0*uSpread*light - vel)*e*0.08;",
    "  vec2 q = p*0.0095 + vec2(uTime*0.35, -uTime*0.2);",
    "  vec2 c = curl(q) + 0.5*curl(q*2.3 + 7.1);",
    "  acc += c*(e*1.2*uSpread + uIntro*1.5)*uTurb*light;",
    "  float k = (0.006 + 0.02*uReturn)*(0.65+sd*0.7)*(1.0 - uIntro*0.75);",
    "  acc -= off*k;",
    "  vel += acc*uDt;",
    "  vel *= pow(mix(0.93, 0.955, e), uDt);",
    "  off += vel*uDt;",
    "  if(dot(off,off) < 0.0004 && dot(vel,vel) < 0.0004){ off = vec2(0.0); vel = vec2(0.0); }",
    "  o = vec4(off, vel);",
    "}"
  ].join("\n");

  var PART_VS = [
    "#version 300 es",
    "precision highp float;",
    "layout(location=0) in vec2 aCorner;",
    "uniform sampler2D uState;",
    "uniform sampler2D uHome;",
    "uniform sampler2D uCol;",
    "uniform sampler2D uFlow;",
    "uniform int uTexW;",
    "uniform vec4 uRect;",
    "uniform vec2 uRes;",
    "uniform vec2 uMouse;",
    "uniform float uRadius;",
    "uniform float uPresence;",
    "uniform float uDot;",
    "uniform float uTime;",
    "uniform float uAmbient;",
    "uniform float uStreak;",
    "uniform float uIntroVis;",
    "uniform float uRest;",
    "uniform vec3 uTint;",
    "out vec2 vLocal;",
    "out float vHalfLen;",
    "out float vR;",
    "out vec3 vCol;",
    "out float vA;",
    NOISE,
    ENERGY,
    "void main(){",
    "  int id = gl_InstanceID;",
    "  ivec2 ij = ivec2(id % uTexW, id / uTexW);",
    "  vec4 hm = texelFetch(uHome, ij, 0);",
    "  vec4 st = texelFetch(uState, ij, 0);",
    "  vec4 cl = texelFetch(uCol, ij, 0);",
    "  float wakeE = texture(uFlow, hm.xy).b;",
    "  float E = energyAt(hm.xy*uRect.zw, uMouse, uRadius, uPresence, wakeE);",
    "  float lift = smoothstep(0.35, 2.5, length(st.xy));",
    "  float a = max(max(E, lift), max(uRest, 1.0-uIntroVis));",
    "  if(a < 0.01 || hm.w <= 0.0){ gl_Position = vec4(2.0,2.0,2.0,1.0); return; }",
    "  vec2 base = uRect.xy + hm.xy*uRect.zw + st.xy;",
    "  base -= ambientField(hm.xy, uTime)*10.0*uAmbient;",
    "  vec2 v = st.zw;",
    "  float sp = length(v);",
    "  vec2 dir = sp > 0.001 ? v/sp : vec2(1.0,0.0);",
    "  float r = uDot*hm.w*0.5;",
    "  float len = min(sp*1.25, 18.0)*uStreak;",
    "  vec2 lc = aCorner*vec2(r + len*0.5 + 1.0, r + 1.0);",
    "  vec2 center = base - dir*len*0.5;",
    "  vec2 world = center + dir*lc.x + vec2(-dir.y, dir.x)*lc.y;",
    "  vec2 clip = world/uRes*2.0-1.0;",
    "  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);",
    "  vLocal = lc;",
    "  vHalfLen = len*0.5;",
    "  vR = r;",
    "  vec3 col = cl.rgb*uTint;",
    "  float glint = smoothstep(2.0, 16.0, sp);",
    "  col = mix(col, min(col*1.18 + vec3(0.07,0.075,0.085), vec3(1.0)), glint*0.75);",
    "  vCol = col;",
    "  vA = a;",
    "}"
  ].join("\n");

  var PART_FS = [
    "#version 300 es",
    "precision highp float;",
    "in vec2 vLocal;",
    "in float vHalfLen;",
    "in float vR;",
    "in vec3 vCol;",
    "in float vA;",
    "uniform float uDpr;",
    "out vec4 o;",
    "void main(){",
    "  vec2 q = vec2(max(abs(vLocal.x)-vHalfLen, 0.0), vLocal.y);",
    "  float d = length(q) - vR;",
    "  float a = clamp(0.5 - d*uDpr, 0.0, 1.0);",
    "  float tail = vHalfLen > 0.0 ? clamp(0.5 - vLocal.x/(2.0*(vHalfLen+vR)), 0.0, 1.0) : 0.0;",
    "  a *= 1.0 - tail*0.55;",
    "  a *= vA;",
    "  if(a < 0.004) discard;",
    "  o = vec4(vCol*a, a);",
    "}"
  ].join("\n");

  var IMAGE_FS = [
    "#version 300 es",
    "precision highp float;",
    "out vec4 o;",
    "uniform sampler2D uImg;",
    "uniform sampler2D uFlow;",
    "uniform vec2 uRes;",
    "uniform float uDpr;",
    "uniform vec4 uRect;",
    "uniform vec3 uBg;",
    "uniform vec3 uImgBg;",
    "uniform vec2 uMouse;",
    "uniform float uPresence;",
    "uniform float uRadius;",
    "uniform float uStrength;",
    "uniform float uTime;",
    "uniform float uAmbient;",
    "uniform float uIntroVis;",
    "uniform float uRest;",
    "uniform float uAlphaMode;",
    NOISE,
    ENERGY,
    "void main(){",
    "  vec2 px = vec2(gl_FragCoord.x, uRes.y*uDpr - gl_FragCoord.y)/uDpr;",
    "  vec2 size = uRect.zw;",
    "  vec2 uv = (px-uRect.xy)/size;",
    "  if(uv.x < -0.05 || uv.x > 1.05 || uv.y < -0.12 || uv.y > 1.12){ o = vec4(0.0); return; }",
    "  vec4 fl = texture(uFlow, clamp(uv,0.0,1.0));",
    "  vec2 vel = (fl.rg*255.0-128.0)/127.0;",
    "  vec2 rp = uv*size;",
    "  vec2 toM = rp - uMouse;",
    "  float fall = exp(-dot(toM,toM)/(uRadius*uRadius))*uPresence;",
    "  vec2 disp = -toM*0.22*uStrength*fall - vel*10.0*uStrength;",
    "  disp += ambientField(uv, uTime)*10.0*uAmbient;",
    "  vec2 suv = uv + disp/size;",
    "  vec4 tx = texture(uImg, suv);",
    "  vec3 col = tx.rgb;",
    "  vec2 e = smoothstep(vec2(0.0), vec2(0.004,0.01), suv) * smoothstep(vec2(1.0), vec2(0.996,0.99), suv);",
    "  float key = uAlphaMode > 0.5 ? tx.a : smoothstep(0.012, 0.05, length(col-uImgBg));",
    "  float k = key*e.x*e.y;",
    "  float E = energyAt(rp, uMouse, uRadius, uPresence, fl.b);",
    "  float show = (1.0 - max(E, uRest))*uIntroVis;",
    "  vec3 mat = uAlphaMode > 0.5 ? col : col*(uBg/max(uImgBg, vec3(0.001)));",
    "  float A = k*show;",
    "  o = vec4(mat*A, A);",
    "}"
  ].join("\n");

  function compile(gl, vs, fs) {
    function make(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(sh);
        gl.deleteShader(sh);
        throw new Error("Shader: " + log);
      }
      return sh;
    }
    var p = gl.createProgram(), v = make(gl.VERTEX_SHADER, vs), f = make(gl.FRAGMENT_SHADER, fs);
    gl.attachShader(p, v); gl.attachShader(p, f);
    gl.bindAttribLocation(p, 0, "aPos");
    gl.linkProgram(p);
    gl.deleteShader(v); gl.deleteShader(f);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("Link: " + gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var info = gl.getActiveUniform(p, i);
      if (info) u[info.name] = gl.getUniformLocation(p, info.name);
    }
    return { p: p, u: u };
  }

  var TEX_W = 1024, SETTLE_FRAMES = 270;

  function LiquidSculpture(canvas, opts, onFail) {
    this.lastImage = null;
    this.onFirstFrame = null;
    this.canvas = canvas;
    this.opts = Object.assign({
      interactive: true, strength: 1, radius: 220, density: 1, dotSize: 1, spread: 1, turbulence: 1, returnSpeed: 1,
      streaks: true, restStyle: "image", ambient: false, ambientIntensity: 1, speed: 1, intro: false, reducedMotion: false,
      bg: [0.92, 0.91, 0.9], imgBg: null, liquid: 1, cells: 0
    }, opts || {});
    this.onFail = onFail || function () {};
    this.flowTex = []; this.flowFb = []; this.flowW = 256; this.flowH = 104; this.flowIdx = 0; this.flowDirty = false;
    this.homeTex = null; this.colTex = null; this.stateTex = []; this.stateFb = []; this.stateIdx = 0;
    this.texH = 1; this.n = 0; this.gridW = 1; this.stateDirty = false; this.alphaMode = false;
    this.imgBg = [0.918, 0.914, 0.906]; this.flowing = 0; this.aspect = 2.5;
    this.rect = { x: 0, y: 0, w: 1, h: 1 }; this.cssW = 1; this.cssH = 1;
    this.target = { x: -9999, y: -9999 }; this.mouse = { x: -9999, y: -9999 }; this.prevMouse = { x: -9999, y: -9999 };
    this.mvel = { x: 0, y: 0 }; this.presence = 0; this.presenceTarget = 0; this.burst = 0; this.lastInput = -1e9;
    this.settle = 1e9; this.touchRelease = 0; this.time = 0; this.introT = 1; this.raf = 0; this.running = false;
    this.last = 0; this.skip = 0; this.visible = true; this.ready = false; this.destroyed = false; this.lost = false;
    this.imgTex = null; this.homeData = null;

    var gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;
    var nav = navigator;
    this.lowPower = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4 || window.matchMedia("(pointer: coarse)").matches;
    var self = this;
    this.frame = function (now) { self._frame(now); };
    this.onLost = function (e) { e.preventDefault(); self.lost = true; self.stop(); self.onFail(); };
    this.initGL();
    canvas.addEventListener("webglcontextlost", this.onLost, false);
  }

  var P = LiquidSculpture.prototype;

  P.initGL = function () {
    var gl = this.gl;
    var full = gl.getExtension("EXT_color_buffer_float");
    var half = full ? null : gl.getExtension("EXT_color_buffer_half_float");
    if (!full && !half) throw new Error("No float render targets");
    this.stateFormat = { internal: gl.RGBA16F, type: gl.HALF_FLOAT };
    this.pFlow = compile(gl, QUAD_VS, FLOW_FS);
    this.pSim = compile(gl, QUAD_VS, SIM_FS);
    this.pPart = compile(gl, PART_VS, PART_FS);
    this.pImg = compile(gl, QUAD_VS, IMAGE_FS);
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    for (var i = 0; i < 2; i++) {
      var t = this.makeTex(gl.RGBA8, this.flowW, this.flowH, gl.RGBA, gl.UNSIGNED_BYTE, null, gl.LINEAR);
      var fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      this.flowTex.push(t); this.flowFb.push(fb);
    }
    this.clearFlow();
  };

  P.makeTex = function (internal, w, h, format, type, data, filter) {
    var gl = this.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };

  P.clearFlow = function () {
    var gl = this.gl;
    for (var i = 0; i < this.flowFb.length; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.flowFb[i]);
      gl.viewport(0, 0, this.flowW, this.flowH);
      gl.clearColor(128 / 255, 128 / 255, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.flowDirty = false;
  };

  P.clearState = function () {
    var gl = this.gl;
    for (var i = 0; i < this.stateFb.length; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.stateFb[i]);
      gl.viewport(0, 0, TEX_W, this.texH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.stateDirty = false;
  };

  P.setImage = function (img) {
    if (this.destroyed || this.lost) return;
    var gl = this.gl;
    this.lastImage = img;
    this.aspect = img.naturalWidth / img.naturalHeight || 2.5;
    this.flowH = Math.max(32, Math.round(this.flowW / this.aspect));
    for (var i = 0; i < this.flowTex.length; i++) {
      gl.bindTexture(gl.TEXTURE_2D, this.flowTex[i]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.flowW, this.flowH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    this.clearFlow();
    if (this.imgTex) gl.deleteTexture(this.imgTex);
    this.imgTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.imgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.buildParticles(img);
    this.ready = true;
    if (this.opts.intro && !this.opts.reducedMotion) this.startIntro();
    this.wake();
  };

  /* One particle per material pixel of a grid laid over the image. */
  P.buildParticles = function (img) {
    var gl = this.gl;
    // Grid sized by area: the original's 1000 x 400 cells for a wide sculpture, the same budget for any aspect.
    var cells = (this.opts.cells || (this.lowPower ? 150000 : 380000)) * clamp(this.opts.density, 0.15, 2);
    var gw = Math.max(64, Math.round(Math.sqrt(cells * this.aspect)));
    var gh = Math.max(1, Math.round(gw / this.aspect));
    this.gridW = gw;
    var data;
    try {
      var c = document.createElement("canvas");
      c.width = gw; c.height = gh;
      var ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, gw, gh);
      data = ctx.getImageData(0, 0, gw, gh).data;
    } catch (e) {
      throw new Error("Image is not CORS-readable");
    }
    var transparent = 0, i;
    for (i = 3; i < data.length; i += 4 * 7) if (data[i] < 250) transparent++;
    this.alphaMode = transparent > data.length / (4 * 7) / 20;
    if (this.opts.imgBg) this.imgBg = this.opts.imgBg;
    else if (!this.alphaMode) {
      var r = 0, g = 0, b = 0, cnt = 0, pw = Math.max(2, Math.round(gw * 0.012));
      [[0, 0], [gw - pw, 0], [0, gh - pw], [gw - pw, gh - pw]].forEach(function (cc) {
        for (var y = cc[1]; y < cc[1] + pw; y++)
          for (var x = cc[0]; x < cc[0] + pw; x++) {
            var k = (y * gw + x) * 4;
            r += data[k]; g += data[k + 1]; b += data[k + 2]; cnt++;
          }
      });
      this.imgBg = [r / cnt / 255, g / cnt / 255, b / cnt / 255];
    }
    var home = [], col = [];
    for (var y = 0; y < gh; y++) {
      for (var x = 0; x < gw; x++) {
        i = (y * gw + x) * 4;
        var rr = data[i] / 255, gg = data[i + 1] / 255, bb = data[i + 2] / 255;
        if (this.alphaMode) {
          var a = data[i + 3] / 255;
          if (a < 0.12) continue;
          if (a < 0.5 && Math.random() > a * 2) continue;
        } else {
          var dev = Math.hypot(rr - this.imgBg[0], gg - this.imgBg[1], bb - this.imgBg[2]);
          if (dev < 0.03) continue;
          if (dev < 0.07 && Math.random() > (dev - 0.03) / 0.04) continue;
        }
        var jx = (Math.random() - 0.5) * 0.6, jy = (Math.random() - 0.5) * 0.6;
        home.push((x + 0.5 + jx) / gw, (y + 0.5 + jy) / gh, Math.random(), 0.85 + Math.random() * 0.3);
        col.push(data[i], data[i + 1], data[i + 2], 255);
      }
    }
    var n = home.length / 4;
    this.n = n;
    this.texH = Math.max(1, Math.ceil(n / TEX_W));
    var total = TEX_W * this.texH;
    var homeArr = new Float32Array(total * 4); homeArr.set(home);
    var colArr = new Uint8Array(total * 4); colArr.set(col);
    var self = this;
    [this.homeTex, this.colTex].concat(this.stateTex).forEach(function (t) { if (t) gl.deleteTexture(t); });
    this.stateFb.forEach(function (f) { gl.deleteFramebuffer(f); });
    this.stateTex = []; this.stateFb = [];
    this.homeTex = this.makeTex(gl.RGBA32F, TEX_W, this.texH, gl.RGBA, gl.FLOAT, homeArr, gl.NEAREST);
    this.colTex = this.makeTex(gl.RGBA8, TEX_W, this.texH, gl.RGBA, gl.UNSIGNED_BYTE, colArr, gl.NEAREST);
    for (i = 0; i < 2; i++) {
      var t = this.makeTex(this.stateFormat.internal, TEX_W, this.texH, gl.RGBA, this.stateFormat.type, null, gl.NEAREST);
      var fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Float FBO incomplete");
      self.stateTex.push(t); self.stateFb.push(fb);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.homeData = homeArr;
    this.clearState();
  };

  P.startIntro = function () {
    var gl = this.gl, home = this.homeData;
    if (!home) return;
    var w = this.rect.w > 10 ? this.rect.w : 1300, total = TEX_W * this.texH, st = new Float32Array(total * 4);
    for (var i = 0; i < this.n; i++) {
      var hx = home[i * 4] - 0.5, hy = home[i * 4 + 1] - 0.5, sd = home[i * 4 + 2];
      var ang = (Math.random() - 0.5) * 0.9 + (hx > 0 ? 0 : Math.PI);
      var dist = w * (0.04 + Math.random() * 0.14) * (0.5 + Math.abs(hx) * 1.4);
      st[i * 4] = Math.cos(ang) * dist + hx * w * 0.25 * sd;
      st[i * 4 + 1] = Math.sin(ang) * dist * 0.55 + hy * 120 * (Math.random() - 0.5);
    }
    gl.bindTexture(gl.TEXTURE_2D, this.stateTex[this.stateIdx]);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.stateFormat.internal, TEX_W, this.texH, 0, gl.RGBA, gl.FLOAT, st);
    this.introT = 0;
    this.stateDirty = true;
  };

  P.setOptions = function (o) {
    var rebuild = (o.density !== undefined && o.density !== this.opts.density) || (o.imgBg !== undefined && String(o.imgBg) !== String(this.opts.imgBg));
    this.opts = Object.assign({}, this.opts, o);
    if (rebuild && this.ready && this.lastImage) {
      try { this.buildParticles(this.lastImage); } catch (e) { this.onFail(); }
    }
    this.wake();
  };

  P.replayIntro = function () { if (this.ready && !this.opts.reducedMotion) { this.startIntro(); this.wake(); } };

  P.resize = function (cssW, cssH, rect) {
    this.cssW = Math.max(1, cssW); this.cssH = Math.max(1, cssH); this.rect = rect;
    var dpr = Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.5 : 2);
    var px = this.cssW * this.cssH * dpr * dpr;
    if (px > 4.5e6) dpr = Math.max(1, Math.sqrt(4.5e6 / (this.cssW * this.cssH)));
    var w = Math.round(this.cssW * dpr), h = Math.round(this.cssH * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    this.draw();
  };

  P.setVisible = function (v) { this.visible = v; if (v) this.wake(); else this.stop(); };

  P.pointer = function (type, x, y, touch) {
    if (!this.opts.interactive || this.lost) return;
    var now = performance.now();
    if (type === "leave" || type === "up") {
      if (touch) this.touchRelease = now + 260;
      else this.presenceTarget = 0;
      this.wake();
      return;
    }
    if (this.mouse.x < -9000 || type === "down") {
      this.mouse.x = this.prevMouse.x = x;
      this.mouse.y = this.prevMouse.y = y;
    }
    this.target.x = x; this.target.y = y;
    this.presenceTarget = 1; this.lastInput = now; this.settle = 0;
    if (type === "down") { this.burst = 1; this.touchRelease = 0; }
    this.wake();
  };

  P.wake = function () {
    if (!this.ready || this.running || !this.visible || this.destroyed || this.lost) {
      if (this.ready && !this.running) this.draw();
      return;
    }
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  };

  P.stop = function () { this.running = false; cancelAnimationFrame(this.raf); };

  P.radiusPx = function () { return this.opts.radius * clamp(this.rect.w / 1400, 0.6, 1.25); };
  P.strength = function () { return this.opts.strength * (this.opts.reducedMotion ? 0.5 : 1); };

  P._frame = function (now) {
    if (!this.running) return;
    var rawMs = now - this.last, dt = clamp(rawMs / 16.6667, 0.25, 3);
    this.last = now;
    var o = this.opts, ambientOn = o.ambient && !o.reducedMotion;
    if (this.touchRelease && now > this.touchRelease) { this.presenceTarget = 0; this.touchRelease = 0; }
    var ease = 1 - Math.pow(1 - 0.22, dt);
    this.mouse.x += (this.target.x - this.mouse.x) * ease;
    this.mouse.y += (this.target.y - this.mouse.y) * ease;
    var vx = (this.mouse.x - this.prevMouse.x) / dt, vy = (this.mouse.y - this.prevMouse.y) / dt;
    this.prevMouse.x = this.mouse.x; this.prevMouse.y = this.mouse.y;
    this.mvel.x += (clamp(vx, -60, 60) - this.mvel.x) * 0.5;
    this.mvel.y += (clamp(vy, -60, 60) - this.mvel.y) * 0.5;
    var pk = this.presenceTarget > this.presence ? 0.1 : 0.035;
    this.presence += (this.presenceTarget - this.presence) * (1 - Math.pow(1 - pk, dt));
    if (this.presence < 0.001 && this.presenceTarget === 0) this.presence = 0;
    var fk = this.presenceTarget > this.flowing ? 0.05 : 0.018;
    this.flowing += (this.presenceTarget - this.flowing) * (1 - Math.pow(1 - fk, dt));
    if (this.flowing < 0.002 && this.presenceTarget === 0) this.flowing = 0;
    if (this.introT < 1) this.introT = Math.min(1, this.introT + Math.min(rawMs, 100) / 3200);
    var interacting = this.presence > 0.001 || this.burst > 0;
    this.settle = interacting ? 0 : this.settle + dt;
    var active = interacting || this.settle < SETTLE_FRAMES || this.introT < 1;
    if (!active) {
      if (this.flowDirty) this.clearFlow();
      if (this.stateDirty) this.clearState();
      if (!ambientOn) { this.draw(); this.firstFrame(); this.stop(); return; }
      this.raf = requestAnimationFrame(this.frame);
      if (this.skip++ % 2) return;
      this.time += (dt * 2 * o.speed) / 60;
      this.draw(); this.firstFrame();
      return;
    }
    this.raf = requestAnimationFrame(this.frame);
    this.time += (dt * o.speed * (1 + this.flowing * 1.6)) / 60;
    this.stepFlow(dt);
    this.stepSim(dt);
    this.burst = Math.max(0, this.burst - 0.1 * dt);
    this.draw();
    this.firstFrame();
  };

  P.firstFrame = function () {
    if (this.onFirstFrame) {
      var cb = this.onFirstFrame;
      this.onFirstFrame = null;
      requestAnimationFrame(function () { cb(); });
    }
  };

  P.stepFlow = function (dt) {
    var gl = this.gl, Pr = this.pFlow, dst = 1 - this.flowIdx, r = this.rect;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.flowFb[dst]);
    gl.viewport(0, 0, this.flowW, this.flowH);
    gl.disable(gl.BLEND);
    gl.useProgram(Pr.p);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]);
    gl.uniform1i(Pr.u.uPrev, 0);
    gl.uniform2f(Pr.u.uTexel, 1 / this.flowW, 1 / this.flowH);
    gl.uniform2f(Pr.u.uMouse, (this.mouse.x - r.x) / r.w, (this.mouse.y - r.y) / r.h);
    gl.uniform2f(Pr.u.uVel, clamp(this.mvel.x / 40, -1, 1), clamp(this.mvel.y / 40, -1, 1));
    gl.uniform2f(Pr.u.uSize, r.w, r.h);
    gl.uniform1f(Pr.u.uRadius, this.radiusPx());
    gl.uniform1f(Pr.u.uPresence, Math.max(this.presence, this.burst));
    gl.uniform1f(Pr.u.uDecay, Math.pow(0.968, dt));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.flowIdx = dst;
    this.flowDirty = true;
  };

  P.stepSim = function (dt) {
    if (!this.n) return;
    var gl = this.gl, Pr = this.pSim, o = this.opts, r = this.rect, dst = 1 - this.stateIdx;
    var intro = o.reducedMotion || !o.intro ? 0 : Math.pow(1 - this.introT, 2);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.stateFb[dst]);
    gl.viewport(0, 0, TEX_W, this.texH);
    gl.disable(gl.BLEND);
    gl.useProgram(Pr.p);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.stateTex[this.stateIdx]); gl.uniform1i(Pr.u.uState, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.homeTex); gl.uniform1i(Pr.u.uHome, 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]); gl.uniform1i(Pr.u.uFlow, 2);
    gl.uniform2f(Pr.u.uSize, r.w, r.h);
    gl.uniform2f(Pr.u.uMouse, this.mouse.x - r.x, this.mouse.y - r.y);
    gl.uniform1f(Pr.u.uRadius, this.radiusPx());
    gl.uniform1f(Pr.u.uPresence, Math.max(this.presence, this.burst));
    gl.uniform1f(Pr.u.uStrength, this.strength() * (1 + this.burst * 1.5));
    gl.uniform1f(Pr.u.uSpread, clamp(o.spread, 0, 2));
    gl.uniform1f(Pr.u.uTurb, clamp(o.turbulence, 0, 2) * (o.reducedMotion ? 0.3 : 1));
    gl.uniform1f(Pr.u.uReturn, clamp(o.returnSpeed, 0, 2));
    gl.uniform1f(Pr.u.uTime, this.time);
    gl.uniform1f(Pr.u.uDt, dt);
    gl.uniform1f(Pr.u.uIntro, intro);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.stateIdx = dst;
    this.stateDirty = true;
  };

  P.draw = function () {
    if (!this.ready || this.lost || this.destroyed) return;
    var gl = this.gl, o = this.opts, r = this.rect, rm = o.reducedMotion;
    var introVis = rm || !o.intro ? 1 : Math.pow(this.introT, 2.2);
    var base = o.ambient && !rm ? clamp(o.ambientIntensity, 0, 2) : 0;
    var amb = base + this.flowing * 0.85 * clamp(o.liquid, 0, 2) * (rm ? 0.3 : 1);
    var rest = o.restStyle === "particles" ? 1 : 0;
    var bgc = o.bg, ib = this.imgBg, dpr = this.canvas.width / this.cssW, pres = Math.max(this.presence, this.burst);
    var mx = this.mouse.x - r.x, my = this.mouse.y - r.y;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.bindVertexArray(this.vao);
    gl.disable(gl.BLEND);
    var I = this.pImg;
    gl.useProgram(I.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.imgTex); gl.uniform1i(I.u.uImg, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]); gl.uniform1i(I.u.uFlow, 1);
    gl.uniform2f(I.u.uRes, this.cssW, this.cssH);
    gl.uniform1f(I.u.uDpr, dpr);
    gl.uniform4f(I.u.uRect, r.x, r.y, r.w, r.h);
    gl.uniform3f(I.u.uBg, bgc[0], bgc[1], bgc[2]);
    gl.uniform3f(I.u.uImgBg, ib[0], ib[1], ib[2]);
    gl.uniform2f(I.u.uMouse, mx, my);
    gl.uniform1f(I.u.uPresence, pres);
    gl.uniform1f(I.u.uRadius, this.radiusPx());
    gl.uniform1f(I.u.uStrength, this.strength());
    gl.uniform1f(I.u.uTime, this.time);
    gl.uniform1f(I.u.uAmbient, amb);
    gl.uniform1f(I.u.uIntroVis, introVis);
    gl.uniform1f(I.u.uRest, rest);
    gl.uniform1f(I.u.uAlphaMode, this.alphaMode ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!this.n || (!this.stateDirty && rest === 0 && introVis >= 1)) return;
    var Pp = this.pPart;
    gl.useProgram(Pp.p);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.stateTex[this.stateIdx]); gl.uniform1i(Pp.u.uState, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.homeTex); gl.uniform1i(Pp.u.uHome, 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.colTex); gl.uniform1i(Pp.u.uCol, 2);
    gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, this.flowTex[this.flowIdx]); gl.uniform1i(Pp.u.uFlow, 3);
    gl.uniform1i(Pp.u.uTexW, TEX_W);
    gl.uniform4f(Pp.u.uRect, r.x, r.y, r.w, r.h);
    gl.uniform2f(Pp.u.uRes, this.cssW, this.cssH);
    gl.uniform2f(Pp.u.uMouse, mx, my);
    gl.uniform1f(Pp.u.uRadius, this.radiusPx());
    gl.uniform1f(Pp.u.uPresence, pres);
    var spacing = r.w / this.gridW;
    gl.uniform1f(Pp.u.uDot, spacing * 1.45 * clamp(o.dotSize, 0.2, 3));
    gl.uniform1f(Pp.u.uTime, this.time);
    gl.uniform1f(Pp.u.uAmbient, amb);
    gl.uniform1f(Pp.u.uStreak, (o.streaks ? 1 : 0) * (0.45 + 0.55 * introVis));
    gl.uniform1f(Pp.u.uIntroVis, introVis);
    gl.uniform1f(Pp.u.uRest, rest);
    gl.uniform1f(Pp.u.uDpr, dpr);
    if (this.alphaMode) gl.uniform3f(Pp.u.uTint, 1, 1, 1);
    else gl.uniform3f(Pp.u.uTint, bgc[0] / Math.max(ib[0], 0.001), bgc[1] / Math.max(ib[1], 0.001), bgc[2] / Math.max(ib[2], 0.001));
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.n);
    gl.disable(gl.BLEND);
  };

  P.destroy = function () {
    this.destroyed = true;
    this.stop();
    this.canvas.removeEventListener("webglcontextlost", this.onLost);
    var gl = this.gl;
    if (!this.lost) {
      gl.deleteBuffer(this.quad);
      gl.deleteVertexArray(this.vao);
      this.flowTex.concat(this.stateTex, [this.imgTex, this.homeTex, this.colTex]).forEach(function (t) { if (t) gl.deleteTexture(t); });
      this.flowFb.concat(this.stateFb).forEach(function (f) { gl.deleteFramebuffer(f); });
      [this.pFlow, this.pSim, this.pPart, this.pImg].forEach(function (p) { if (p) gl.deleteProgram(p.p); });
    }
    var ext = gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  };

  window.LiquidSculpture = LiquidSculpture;
})();
