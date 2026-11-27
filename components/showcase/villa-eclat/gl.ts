// VILLA ÉCLAT's film camera: one WebGL canvas that frames generated stills like a moving camera.
// Every effect from the showreel lives in one fragment shader: cover framing with zoom, pan and
// roll; crossfade; radial (zoom) and directional (whip) motion blur; a rounded frame that grows
// on ivory; a strip of film frames with sprocket holes; a sun flare; red light leaks; fades,
// vignette and grain. Plain WebGL 1, so it also runs in Safari on iPhone.

import { sized } from "@/lib/showcase/media";

const VS = `attribute vec2 a; varying vec2 v; void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

const FS = `precision highp float;
varying vec2 v;
uniform float uAsp;
uniform sampler2D uTA, uTB;
uniform vec4 uA, uB;
uniform vec2 uAWH, uBWH;
uniform vec4 uACrop, uBCrop;
uniform float uMix;
uniform vec4 uBlur;
uniform vec4 uFrame;
uniform float uFrameR, uFrameOn;
uniform vec4 uGate;
uniform vec3 uFlare;
uniform vec2 uLeak;
uniform vec4 uFade;
uniform vec3 uBg;
uniform float uGrain, uSeed, uVig;

float box(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }

vec3 pic(sampler2D t, vec4 c, vec2 wh, vec4 cr, vec2 p) {
  float cs = cos(c.w), sn = sin(c.w);
  vec2 q = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y) / c.z;
  vec2 uv = clamp(c.xy + vec2(q.x / wh.x, -q.y / wh.y), vec2(0.002), vec2(0.998));
  return texture2D(t, cr.xy + uv * cr.zw).rgb;
}

vec3 look(sampler2D t, vec4 c, vec2 wh, vec4 cr, vec2 p) {
  if (uBlur.x + uBlur.y < 0.0005) return pic(t, c, wh, cr, p);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 12; i++) {
    float f = float(i) / 11.0;
    acc += pic(t, c, wh, cr, p - p * uBlur.x * f + uBlur.zw * uBlur.y * (f - 0.5));
  }
  return acc / 12.0;
}

vec3 gate(vec2 p) {
  float fh = uGate.z, fw = fh * uAsp, pitch = fw + uGate.w, off = uGate.y * pitch;
  float open = clamp((1.0 - fh) * 7.0, 0.0, 1.0);
  vec3 col = vec3(0.045, 0.036, 0.03);
  float hy = fh * 0.5 + (0.5 - fh * 0.5) * 0.5, hs = 0.075;
  vec2 hp = vec2(mod(p.x + off + hs * 0.5, hs) - hs * 0.5, abs(p.y) - hy);
  float hole = box(hp, vec2(0.017, 0.024) * open, 0.006 * open);
  col = mix(col, vec3(0.2, 0.16, 0.13), (1.0 - smoothstep(0.0, 0.002, hole)) * open);
  vec2 ca = vec2(-off, 0.0), cb = vec2(pitch - off, 0.0);
  float r = 0.022 * open;
  float da = box(p - ca, vec2(fw, fh) * 0.5, r);
  float db = box(p - cb, vec2(fw, fh) * 0.5, r);
  if (da < 0.003) col = mix(look(uTA, uA, uAWH, uACrop, (p - ca) / fh), col, smoothstep(-0.0015, 0.0015, da));
  if (db < 0.003) col = mix(look(uTB, uB, uBWH, uBCrop, (p - cb) / fh), col, smoothstep(-0.0015, 0.0015, db));
  return col;
}

vec3 flare(vec2 p) {
  vec2 s = uFlare.xy, d = p - s;
  float L = length(d);
  vec3 c = vec3(1.0, 0.86, 0.62) * 0.02 / (L * L * 1.6 + 0.02);
  c += vec3(1.0, 0.72, 0.45) * exp(-abs(d.y) * 90.0) * exp(-abs(d.x) * 2.2) * 0.42;
  for (int i = 0; i < 4; i++) {
    float f = 0.35 + float(i) * 0.42, rr = 0.018 + float(i) * 0.016;
    c += vec3(0.55, 0.7, 1.0) * 0.1 * (1.0 - smoothstep(rr * 0.5, rr, length(p - s * (1.0 - f * 2.0))));
  }
  return c * uFlare.z;
}

vec3 leak(vec2 p) {
  float a = exp(-pow((p.x - uLeak.x) * 1.7, 2.0)) * (0.72 + 0.28 * sin(p.y * 4.0 + uLeak.x * 6.0));
  return (vec3(1.0, 0.27, 0.09) * a + vec3(1.0, 0.82, 0.5) * pow(a, 5.0) * 0.8) * uLeak.y;
}

void main() {
  vec2 p = (v - 0.5) * vec2(uAsp, 1.0);
  vec3 col;
  if (uGate.x > 0.5) col = gate(p);
  else if (uFrameOn > 0.5) {
    float d = box(p - uFrame.xy, uFrame.zw, uFrameR);
    col = uBg;
    if (d < 0.003) col = mix(look(uTB, uB, uBWH, uBCrop, p), uBg, smoothstep(-0.0015, 0.0015, d));
  } else {
    vec3 a = uMix < 0.999 ? look(uTA, uA, uAWH, uACrop, p) : vec3(0.0);
    vec3 b = uMix > 0.001 ? look(uTB, uB, uBWH, uBCrop, p) : vec3(0.0);
    col = mix(a, b, uMix);
  }
  if (uFlare.z > 0.001) col = 1.0 - (1.0 - col) * (1.0 - clamp(flare(p), 0.0, 1.0));
  if (uLeak.y > 0.001) col = 1.0 - (1.0 - col) * (1.0 - clamp(leak(p), 0.0, 1.0));
  col = mix(col, uFade.rgb, uFade.a);
  col *= mix(1.0, 1.0 - smoothstep(0.25, 1.15, length(p * vec2(0.9 / uAsp, 1.0))), uVig);
  col += (fract(sin(dot(gl_FragCoord.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * uGrain;
  gl_FragColor = vec4(col, 1.0);
}`;

/** A picture as the shader sees it: texture, size, and the cell of a grid it shows. */
type Tex = { t: WebGLTexture; w: number; h: number; crop: [number, number, number, number]; ready: boolean; used: number; video?: HTMLVideoElement; target?: number };

/** Where a picture sits: camera centre in picture uv, zoom, roll in radians. */
export type View = { key: string; c: [number, number]; s: number; r: number; wh: [number, number] };

export type Uniforms = {
  A: View | null;
  B: View | null;
  mix: number;
  blur: [number, number, number, number];
  frame: [number, number, number, number, number] | null;
  gate: [number, number, number] | null; // position fraction, frame height, gap
  flare: [number, number, number];
  leak: [number, number];
  fade: [number, number, number, number];
  grain: number;
  seed: number;
  vig: number;
};

const NAMES = ["uAsp", "uTA", "uTB", "uA", "uB", "uAWH", "uBWH", "uACrop", "uBCrop", "uMix", "uBlur", "uFrame", "uFrameR", "uFrameOn", "uGate", "uFlare", "uLeak", "uFade", "uBg", "uGrain", "uSeed", "uVig"] as const;

/** Parses "crop:<url>#W,H,x,y,w,h" into the source and the cell as a uv rectangle. */
export function parseSrc(src: string): { url: string; crop: [number, number, number, number]; aspect?: number } {
  if (!src.startsWith("crop:")) return { url: src, crop: [0, 0, 1, 1] };
  const [url, box] = src.slice(5).split("#");
  const [W, H, x, y, w, h] = box.split(",").map(Number);
  const i = 6; // keep clear of the white gutters between grid cells
  return { url, crop: [(x + i) / W, (y + i) / H, (w - 2 * i) / W, (h - 2 * i) / H], aspect: (w - 2 * i) / (h - 2 * i) };
}

export class FilmGL {
  gl: WebGLRenderingContext;
  private loc = {} as Record<(typeof NAMES)[number], WebGLUniformLocation | null>;
  private tex = new Map<string, Tex>();
  private clock = 0;
  onLoad: () => void = () => {};
  constructor(private canvas: HTMLCanvasElement, private srcOf: (key: string) => string, private maxW: number, private keep: number) {
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("no webgl");
    this.gl = gl;
    const sh = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    for (const n of NAMES) this.loc[n] = gl.getUniformLocation(prog, n);
    gl.uniform1i(this.loc.uTA, 0);
    gl.uniform1i(this.loc.uTB, 1);
    gl.uniform3f(this.loc.uBg, 0.937, 0.906, 0.855);
  }

  /** Aspect (w / h) of a picture once known; 16:9 until then. */
  aspect(key: string) {
    const x = this.tex.get(key);
    return x && x.ready ? (x.w * x.crop[2]) / (x.h * x.crop[3]) : parseSrc(this.srcOf(key)).aspect ?? 16 / 9;
  }

  /** Starts loading a picture (or paints its placeholder) and marks it as recently used. */
  want(key: string) {
    const have = this.tex.get(key);
    if (have) { have.used = ++this.clock; return; }
    const gl = this.gl;
    const t = gl.createTexture()!;
    const src = this.srcOf(key);
    const { url, crop } = parseSrc(src);
    const entry: Tex = { t, w: 16, h: 9, crop, ready: false, used: ++this.clock };
    this.tex.set(key, entry);
    this.upload(entry, placeholder(key));
    entry.ready = !url; // a placeholder stands in for a picture not generated yet
    if (url.endsWith(".mp4")) {
      // A real camera move: a short-GOP clip whose current frame is the texture.
      const v = document.createElement("video");
      v.crossOrigin = "anonymous";
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";
      const show = () => {
        if (this.tex.get(key) !== entry || v.readyState < 2) return;
        this.upload(entry, v);
        entry.ready = true;
        this.onLoad();
        const want = entry.target ?? 0;
        if (Math.abs(v.currentTime - want) > 0.02 && !v.seeking) v.currentTime = want;
      };
      v.addEventListener("loadeddata", show);
      v.addEventListener("seeked", show);
      v.src = url;
      entry.video = v;
    } else if (url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        if (this.tex.get(key) !== entry) return;
        this.upload(entry, img);
        entry.ready = true;
        this.onLoad();
      };
      img.src = sized(url, crop[2] < 1 ? 1600 : this.maxW);
    }
    this.trim();
  }

  /** Moves a clip to a moment (seconds); the newest request wins while a seek is running. */
  seek(key: string, time: number) {
    const e = this.tex.get(key);
    if (!e?.video) return;
    e.target = time;
    const v = e.video;
    if (v.readyState >= 1 && !v.seeking && Math.abs(v.currentTime - time) > 0.02) v.currentTime = time;
  }

  private upload(e: Tex, src: TexImageSource & { width: number; height: number }) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, e.t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    e.w = (src as HTMLVideoElement).videoWidth || (src as HTMLImageElement).naturalWidth || src.width;
    e.h = (src as HTMLVideoElement).videoHeight || (src as HTMLImageElement).naturalHeight || src.height;
  }

  /** Keeps GPU memory bounded: the least recently used pictures are dropped first. */
  private trim() {
    if (this.tex.size <= this.keep) return;
    const old = [...this.tex.entries()].sort((a, b) => a[1].used - b[1].used);
    for (const [k, e] of old.slice(0, this.tex.size - this.keep)) {
      this.drop(e);
      this.tex.delete(k);
    }
  }

  size(w: number, h: number) {
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
  }

  draw(u: Uniforms) {
    const gl = this.gl, L = this.loc;
    gl.uniform1f(L.uAsp, this.canvas.width / this.canvas.height);
    const bind = (v: View | null, unit: number, cam: WebGLUniformLocation | null, wh: WebGLUniformLocation | null, crop: WebGLUniformLocation | null) => {
      if (!v) return;
      this.want(v.key);
      const e = this.tex.get(v.key)!;
      gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, e.t);
      gl.uniform4f(cam, v.c[0], v.c[1], v.s, v.r);
      gl.uniform2f(wh, v.wh[0], v.wh[1]);
      gl.uniform4f(crop, ...e.crop);
    };
    bind(u.A, 0, L.uA, L.uAWH, L.uACrop);
    bind(u.B ?? u.A, 1, L.uB, L.uBWH, L.uBCrop);
    gl.uniform1f(L.uMix, u.B ? u.mix : 0);
    gl.uniform4f(L.uBlur, ...u.blur);
    gl.uniform1f(L.uFrameOn, u.frame ? 1 : 0);
    if (u.frame) {
      gl.uniform4f(L.uFrame, u.frame[0], u.frame[1], u.frame[2], u.frame[3]);
      gl.uniform1f(L.uFrameR, u.frame[4]);
    }
    gl.uniform4f(L.uGate, u.gate ? 1 : 0, u.gate?.[0] ?? 0, u.gate?.[1] ?? 1, u.gate?.[2] ?? 0);
    gl.uniform3f(L.uFlare, ...u.flare);
    gl.uniform2f(L.uLeak, ...u.leak);
    gl.uniform4f(L.uFade, ...u.fade);
    gl.uniform1f(L.uGrain, u.grain);
    gl.uniform1f(L.uSeed, u.seed);
    gl.uniform1f(L.uVig, u.vig);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private drop(e: Tex) {
    this.gl.deleteTexture(e.t);
    if (e.video) {
      e.video.removeAttribute("src");
      e.video.load();
    }
  }

  dispose() {
    for (const e of this.tex.values()) this.drop(e);
    this.tex.clear();
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

/** Until a picture exists: a dark plate with Art Deco lines and the room's name. */
function placeholder(key: string) {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 360;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 640, 360);
  g.addColorStop(0, "#1b1712");
  g.addColorStop(1, "#0f0d0a");
  x.fillStyle = g;
  x.fillRect(0, 0, 640, 360);
  x.strokeStyle = "rgba(201,164,106,0.35)";
  x.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    x.beginPath();
    x.arc(320, 420, 150 + i * 14, Math.PI, 2 * Math.PI);
    x.stroke();
  }
  x.fillStyle = "rgba(227,201,154,0.6)";
  x.font = "20px serif";
  x.textAlign = "center";
  x.fillText(key.toUpperCase(), 320, 190);
  return c;
}

/** Cover framing: the picture's size in screen-height units on a screen of aspect `sa`. */
export function cover(aspect: number, sa: number): [number, number] {
  return aspect >= sa ? [aspect, 1] : [sa, sa / aspect];
}

/**
 * A camera on a picture. Pan is a share of the view; the zoom grows when the roll would show the
 * picture's edges, and the centre is held inside the picture.
 */
export function frameView(key: string, aspect: number, sa: number, focus: [number, number], s: number, x: number, y: number, rollDeg: number): View {
  const wh = cover(aspect, sa);
  const r = (rollDeg * Math.PI) / 180;
  const cs = Math.abs(Math.cos(r)), sn = Math.abs(Math.sin(r));
  const need = Math.max((cs * sa * 0.5 + sn * 0.5) / (0.5 * wh[0]), (sn * sa * 0.5 + cs * 0.5) / (0.5 * wh[1]));
  const z = Math.max(s, need);
  const ex = (cs * sa * 0.5 + sn * 0.5) / z / wh[0];
  const ey = (sn * sa * 0.5 + cs * 0.5) / z / wh[1];
  const cx = focus[0] + (x * sa) / wh[0];
  const cy = focus[1] + y / wh[1];
  return { key, c: [Math.min(1 - ex, Math.max(ex, cx)), Math.min(1 - ey, Math.max(ey, cy))], s: z, r, wh };
}
