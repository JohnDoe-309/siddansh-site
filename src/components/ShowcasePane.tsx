"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// One pane, many clips. Switching entries crossfades the two videos through a
// procedural displacement in WebGL; without WebGL it degrades to an opacity fade.
// No libraries: two video elements, two textures, one shader.

export type PaneItem = { id: string; title: string; activity: string; place?: string };

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D uFrom, uTo;
uniform float uProgress, uFromRatio, uToRatio, uPaneRatio;

// value noise, enough to break the edge without looking like a filter
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// cover-fit: keep the clip's aspect, crop the overflow
vec2 cover(vec2 uv, float ratio){
  float s = ratio / uPaneRatio;
  vec2 scale = s > 1.0 ? vec2(1.0 / s, 1.0) : vec2(1.0, s);
  return (uv - 0.5) * scale + 0.5;
}

void main(){
  float p = smoothstep(0.0, 1.0, uProgress);
  float n = noise(v * 4.0 + p * 2.0);
  float push = 0.14 * sin(p * 3.14159);
  vec2 dir = vec2(0.6, -0.4);
  vec4 a = texture2D(uFrom, cover(v + dir * push * n, uFromRatio));
  vec4 b = texture2D(uTo, cover(v - dir * push * (1.0 - n), uToRatio));
  gl_FragColor = mix(a, b, p);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

function makeTexture(gl: WebGLRenderingContext) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  for (const [k, val] of [
    [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
    [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
  ] as const) {
    gl.texParameteri(gl.TEXTURE_2D, k, val);
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 10, 16, 255]));
  return tex;
}

export function ShowcasePane({ items }: { items: PaneItem[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fromVideo = useRef<HTMLVideoElement>(null);
  const toVideo = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [webgl, setWebgl] = useState(true);
  const state = useRef({ progress: 0, target: 0, raf: 0, reduce: false });

  // Drive the shader. Runs once; the videos are swapped underneath it.
  useEffect(() => {
    const canvas = canvasRef.current;
    const from = fromVideo.current;
    const to = toVideo.current;
    if (!canvas || !from || !to) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) {
      setWebgl(false);
      return;
    }
    const anim = state.current;
    anim.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const texFrom = makeTexture(gl);
    const texTo = makeTexture(gl);
    const u = {
      progress: gl.getUniformLocation(program, "uProgress"),
      fromRatio: gl.getUniformLocation(program, "uFromRatio"),
      toRatio: gl.getUniformLocation(program, "uToRatio"),
      paneRatio: gl.getUniformLocation(program, "uPaneRatio"),
    };
    gl.uniform1i(gl.getUniformLocation(program, "uFrom"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uTo"), 1);

    const upload = (video: HTMLVideoElement, tex: WebGLTexture, unit: number) => {
      if (video.readyState < 2) return video.videoWidth / Math.max(1, video.videoHeight) || 0.5625;
      gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      return video.videoWidth / Math.max(1, video.videoHeight);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const frame = () => {
      resize();
      const s = anim;
      const step = s.reduce ? 1 : 0.055;
      s.progress += (s.target - s.progress) * step;
      if (Math.abs(s.target - s.progress) < 0.001) s.progress = s.target;
      const fromRatio = upload(from, texFrom, 0);
      const toRatio = upload(to, texTo, 1);
      gl.uniform1f(u.progress, s.progress);
      gl.uniform1f(u.fromRatio, fromRatio || 0.5625);
      gl.uniform1f(u.toRatio, toRatio || 0.5625);
      gl.uniform1f(u.paneRatio, canvas.clientWidth / Math.max(1, canvas.clientHeight));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      s.raf = requestAnimationFrame(frame);
    };
    frame();

    return () => cancelAnimationFrame(anim.raf);
  }, []);

  // Swap which video the shader is transitioning to.
  const show = useCallback(
    (next: number) => {
      const from = fromVideo.current;
      const to = toVideo.current;
      if (!from || !to || next === index) return;
      const src = `/life/${items[next].id}.mp4`;
      const incoming = state.current.target === 1 ? from : to;
      const outgoing = state.current.target === 1 ? to : from;
      incoming.src = src;
      incoming.load();
      void incoming.play().catch(() => undefined);
      // shader mixes from → to, so flip the direction each swap
      state.current.target = outgoing === to ? 0 : 1;
      setIndex(next);
    },
    [index, items],
  );

  useEffect(() => {
    const to = toVideo.current;
    const from = fromVideo.current;
    if (!to || !from) return;
    from.src = `/life/${items[0].id}.mp4`;
    void from.play().catch(() => undefined);
    to.src = `/life/${items[1 % items.length].id}.mp4`;
    void to.play().catch(() => undefined);
    state.current.target = 0;
  }, [items]);

  const current = items[index];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12">
      <ol className="order-2 flex flex-col lg:order-1">
        {items.map((item, i) => {
          const on = i === index;
          return (
            <li key={item.id}>
              <button
                type="button"
                onPointerEnter={(e) => e.pointerType === "mouse" && show(i)}
                onFocus={() => show(i)}
                onClick={() => show(i)}
                className="group flex w-full items-baseline justify-between gap-4 border-b border-white/10 py-3 text-left"
                aria-current={on}
              >
                <span
                  className={`display text-[clamp(1.25rem,3.2vw,2rem)] transition-all duration-300 ${
                    on ? "translate-x-1 text-[var(--paper)]" : "text-[var(--muted-2)] group-hover:translate-x-1"
                  }`}
                >
                  {item.title}
                </span>
                <span className={`label shrink-0 !text-[.625rem] transition-opacity ${on ? "opacity-100" : "opacity-50"}`}>
                  {item.activity}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="pane-reveal order-1 lg:order-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/15 bg-black sm:aspect-[3/4] lg:aspect-[4/5]">
          <canvas ref={canvasRef} className={`size-full ${webgl ? "" : "hidden"}`} aria-hidden="true" />
          <video ref={fromVideo} muted loop playsInline preload="auto" className={`absolute inset-0 size-full object-cover ${webgl ? "invisible" : ""}`} aria-hidden="true" />
          <video ref={toVideo} muted loop playsInline preload="auto" className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${webgl ? "invisible" : ""}`} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            <p className="text-[var(--paper)]">
              <span className="block font-semibold">{current.title}</span>
              {current.place && <span className="label !text-[.625rem]">{current.place}</span>}
            </p>
            <span className="label !text-[.625rem]">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
