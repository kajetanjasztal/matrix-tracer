import matrixTracer from "../../lib/matrix-tracer";
import createLife from "./game-of-life";

const { width, height, sensor, updateLife } = createLife({
  width: 40,
  height: 30,
  rule: "3/23",
  density: 0.2,
});

const svgContent = () =>
  `<svg viewBox="-4 -4 ${width + 8} ${
    height + 8
  }" width="${400}" height="${300}">` +
  `<rect x="${-5}" y="${-5}" width="${width + 10}" height="${
    height + 10
  }" style="fill:#fff"/>` +
  `<path\nstyle="fill-rule:evenodd" ` +
  `d="${matrixTracer(width, height, sensor, true)}"/></svg>`;

