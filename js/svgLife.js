import matrixTracer from "./matrix-tracer.js";
import createLife from "./game-of-life.js";
const startLife = (id, fps) => {
    const { width, height, sensor, updateLife } = createLife({
        width: 60,
        height: 40,
        rule: "3/23",
        density: 0.2,
    });
    const svgContent = () => `<svg viewBox="0 0 ${width} ${height}" width="${600}" height="${400}">` +
        `<path\nstyle="fill:#5eb;fill-rule:evenodd" ` +
        `d="${matrixTracer(width, height, sensor, true)}"/></svg>`;
    const container = document.getElementById(id);
    if (!container)
        return () => { };
    const loop = setInterval(() => {
        container.innerHTML = svgContent();
        updateLife();
    }, 1000 / fps);
    return () => clearInterval(loop);
};
export default startLife;
