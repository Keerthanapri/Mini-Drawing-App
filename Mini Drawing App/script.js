const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toolbarHeight = document.querySelector(".toolbar").offsetHeight;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - toolbarHeight;
  fillBackground();
}

let painting = false;
let eraserMode = false;
let tool = "pen";
let color = document.getElementById("color").value;
let size = document.getElementById("size").value;
let bgColor = document.getElementById("bgColor").value;

// Fill background with selected color
function fillBackground() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Get mouse/touch position
function getPosition(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY - toolbarHeight
    };
  }
  return {
    x: e.clientX,
    y: e.clientY - toolbarHeight
  };
}

function startPosition(e) {
  painting = true;
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  const pos = getPosition(e);

  ctx.lineCap = "round";

  if (eraserMode) {
    ctx.globalCompositeOperation = "destination-out"; // real eraser
    ctx.lineWidth = size * 2;
  } else {
    ctx.globalCompositeOperation = "source-over"; // normal draw
    ctx.strokeStyle = color;

    if (tool === "pen") {
      ctx.lineWidth = size;
      ctx.globalAlpha = 1.0;
    } else if (tool === "pencil") {
      ctx.lineWidth = size * 0.7;
      ctx.globalAlpha = 0.3; // sketchy
    } else if (tool === "brush") {
      ctx.lineWidth = size * 2;
      ctx.globalAlpha = 0.6; // soft paint
    }
  }

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Mouse events
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

// Touch events
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);

// Tool selector
document.getElementById("tool").addEventListener("change", (e) => {
  tool = e.target.value;
  eraserMode = false;
  eraserBtn.classList.remove("active");
  updateCursor();
});

// Brush color
document.getElementById("color").addEventListener("input", (e) => {
  color = e.target.value;
  eraserMode = false;
  document.getElementById("eraser").classList.remove("active");
  updateCursor();
});

// Brush size
document.getElementById("size").addEventListener("input", (e) => {
  size = e.target.value;
});

// Background color
document.getElementById("bgColor").addEventListener("input", (e) => {
  bgColor = e.target.value;
  fillBackground();
});

// Toggle eraser
const eraserBtn = document.getElementById("eraser");
eraserBtn.addEventListener("click", () => {
  eraserMode = !eraserMode;
  eraserBtn.classList.toggle("active", eraserMode);
  updateCursor();
});

// Clear canvas
document.getElementById("clear").addEventListener("click", () => {
  fillBackground();
});

// Save drawing
document.getElementById("save").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "my_drawing.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// 🎯 Update cursor based on tool
function updateCursor() {
  if (eraserMode) {
    canvas.style.cursor = "url('img/eraser.png') 16 16, auto"; // center hotspot
  } else if (tool === "pen") {
    canvas.style.cursor = "url('img/pen.png') 20 85, auto"; // pen tip
  } else if (tool === "pencil") {
    canvas.style.cursor = "url('img/pencil.png') 6 28, auto"; // pencil tip
  } else if (tool === "brush") {
    canvas.style.cursor = "url('img/brush.png') 15 80, auto"; // brush tip
  }
}

// Set starting cursor
updateCursor();
