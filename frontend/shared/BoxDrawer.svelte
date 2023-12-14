<svelte:options accessors={true} />

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";

  const dispatch = createEventDispatcher();

  export let width = 0;
  export let height = 0;
  export let natural_width = 0;
  export let natural_height = 0;

  let boxes: Array<Array<number>> = [];
  let points: Array<Array<number>> = [];

  let canvas_container: HTMLElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;

  let mouse_pressing: boolean = false;
  let mouse_button: number;
  let prev_x: number, prev_y: number;
  let cur_x: number, cur_y: number;

  let old_width = 0;
  let old_height = 0;
  let canvasObserver: ResizeObserver;

  async function set_canvas_size(dimensions: {
    width: number;
    height: number;
  }) {
    await tick();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    canvas.style.marginTop = `-${dimensions.height}px`;
  }

  export async function resize_canvas() {
    if (width === old_width && height === old_height) return;
    await set_canvas_size({ width: width, height: height });
    draw_canvas();
    setTimeout(() => {
      old_height = height;
      old_width = width;
    }, 100);
    clear();
  }

  export function clear() {
    boxes = [];
    points = [];
    draw_canvas();
    dispatch("change", points);
    return true;
  }

  export function undo() {
    boxes.pop();
    points.pop();
    draw_canvas();
    dispatch("change", points);
    return true;
  }

  onMount(async () => {
    ctx = canvas.getContext("2d");
    if (ctx) {
      (ctx.lineJoin = "round"), (ctx.lineCap = "round");
      ctx.strokeStyle = "#000";
    }
    canvasObserver = new ResizeObserver(() => {
      resize_canvas();
    });
    canvasObserver.observe(canvas_container);
    draw_loop();
    clear();
  });

  onDestroy(() => {
    canvasObserver.unobserve(canvas_container);
  });

  function get_mouse_pos(e: MouseEvent | TouchEvent | FocusEvent) {
    const rect = canvas.getBoundingClientRect();
    let screenX, screenY: number;
    if (e instanceof MouseEvent) {
      screenX = e.clientX;
      screenY = e.clientY;
    } else if (e instanceof TouchEvent) {
      screenX = e.changedTouches[0].clientX;
      screenY = e.changedTouches[0].clientY;
    } else {
      return { x: prev_x, y: prev_y };
    }
    return { x: screenX - rect.left, y: screenY - rect.top };
  }

  function handle_draw_start(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    (mouse_pressing = true), (mouse_button = 0);
    if (e instanceof MouseEvent) mouse_button = e.button;
    const { x, y } = get_mouse_pos(e);
    (prev_x = x), (prev_y = y);
  }

  function handle_draw_move(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const { x, y } = get_mouse_pos(e);
    (cur_x = x), (cur_y = y);
  }

  function handle_draw_end(e: MouseEvent | TouchEvent | FocusEvent) {
    e.preventDefault();
    if (mouse_pressing) {
      const { x, y } = get_mouse_pos(e);
      let x1 = Math.min(prev_x, x);
      let y1 = Math.min(prev_y, y);
      let x2 = Math.max(prev_x, x);
      let y2 = Math.max(prev_y, y);
      boxes.push([x1, y1, x2, y2]);
      let scale_x = natural_width / width;
      let scale_y = natural_height / height;
      let is_point = x1 == x2 && y1 == y2;
      points.push([
        Math.round(x1 * scale_x),
        Math.round(y1 * scale_y),
        is_point ? (mouse_button == 0 ? 1 : 0) : 2, // label1
        is_point ? 0 : Math.round(x2 * scale_x),
        is_point ? 0 : Math.round(y2 * scale_y),
        is_point ? 4 : 3, // label2
      ]);
      dispatch("change", points);
    }
    mouse_pressing = false;
  }

  function draw_loop() {
    draw_canvas();
    window.requestAnimationFrame(() => {
      draw_loop();
    });
  }

  function draw_canvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (mouse_pressing && cur_x != prev_x && prev_y != cur_y) {
      let boxes_temp = boxes.slice();
      boxes_temp.push([prev_x, prev_y, cur_x, cur_y]);
      draw_boxes(boxes_temp);
      draw_points(boxes);
    } else {
      draw_boxes(boxes);
      draw_points(boxes);
    }
  }

  function draw_boxes(boxes: Array<Array<number>>) {
    if (!ctx) return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.beginPath();
    boxes.forEach((box: Array<number>) => {
      if (box[0] != box[2] && box[1] != box[3]) {
        ctx.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
      }
    });
    ctx.fill();
    ctx.stroke();
  }

  function draw_points(boxes: Array<Array<number>>) {
    if (!ctx) return;
    // Draw foreground points.
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 255, 255, 1.0)"; // Cyan.
    boxes.forEach((box: Array<number>, index: number) => {
      if (points[index][2] == 1) {
        let radius = Math.sqrt(width * height) * 0.01;
        ctx.moveTo(box[0] + radius, box[1]);
        ctx.arc(box[0], box[1], radius, 0, 2 * Math.PI, false);
      }
    });
    ctx.fill();
    ctx.stroke();
    // Draw background points.
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 192, 203, 1.0)"; // Pink.
    boxes.forEach((box: Array<number>, index: number) => {
      if (points[index][2] == 0) {
        let radius = Math.sqrt(width * height) * 0.01;
        ctx.moveTo(box[0] + radius, box[1]);
        ctx.arc(box[0], box[1], radius, 0, 2 * Math.PI, false);
      }
    });
    ctx.fill();
    ctx.stroke();
  }
</script>

<div class="wrap" bind:this={canvas_container}>
  <canvas
    bind:this={canvas}
    on:mousedown={handle_draw_start}
    on:mousemove={handle_draw_move}
    on:mouseout={handle_draw_move}
    on:mouseup={handle_draw_end}
    on:touchstart={handle_draw_start}
    on:touchmove={handle_draw_move}
    on:touchend={handle_draw_end}
    on:touchcancel={handle_draw_end}
    on:blur={handle_draw_end}
    on:click|stopPropagation
    style=" z-index: 15"
  />
</div>

<style>
  canvas {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }

  .wrap {
    position: relative;
    width: var(--size-full);
    height: var(--size-full);
    touch-action: none;
  }
</style>
