import matrixTracer from "../../lib/matrix-tracer";
import * as fs from "fs";
import QRCode from "qrcode-svg";

const saveTracedMatrix = ({
  filename,
  path = "",
  width,
  height,
  outputWidth,
  outputHeight,
  padding = 0,
}: {
  filename: string;
  path: string;
  width: number;
  height: number;
  outputWidth?: number;
  outputHeight?: number;
  padding?: number;
}) => {
  fs.writeFile(
    `example/svg/${filename.replace(/\.svg$/, "")}.svg`,
    `<?xml version="1.0" standalone="yes"?><svg\n` +
      `xmlns="http://www.w3.org/2000/svg" version="1.1"\n` +
      `viewBox="-${padding} -${padding} ${width + 2 * padding} ${
        height + 2 * padding
      }" width="${outputWidth ?? width}" height="${
        outputHeight ?? height
      }"><rect\nx="${-1 - padding}" y="${-1 - (padding ?? 0)}" width="${
        width + (padding + 1) * 2
      }" height="${
        height + (padding + 1) * 2
      }" style="fill:#fff"/><path\nstyle="fill-rule:evenodd" d="${path}"/></svg>`,
    (error) => error && console.log(error)
  );
};

const pathFromQrCodeModules = (
  content: string,
  padding: number,
  size: number
) => {
  const qrcode = new QRCode({
    content,
    padding,
    width: size,
    height: size,
    ecl: "M",
  });
  qrcode.save(
    "example/svg/qrcode-svg.svg",
    (error) => error && console.log(error)
  );

  const modules = qrcode.qrcode.modules;
  saveTracedMatrix({
    filename: "matrix-tracer",
    width: modules.length,
    height: modules.length,
    padding,
    outputWidth: size,
    outputHeight: size,
    path: matrixTracer(modules.length, modules.length, (x, y) => modules[x][y]),
  });
};

const content = "https://github.com/kajetanjasztal/matrix-tracer";
pathFromQrCodeModules(content, 4, 61);

// other examples

const squareStringSensor = (matrix: string, empty: string = " .") => {
  const size = Math.sqrt(matrix.length);
  if (size % 1 !== 0) throw "String is not a square matrix";
  return (x: number, y: number) => !empty.includes(matrix[x + size * y]);
};

const squareStringSensorWithHole = (matrix: string) => {
  const size = Math.sqrt(matrix.length);
  const hole: (x: number, y: number) => boolean = (x, y) =>
    Math.pow(x - (size - 1) / 2, 2) + Math.pow(y - (size - 1) / 2, 2) <
    Math.pow(size / 4, 2);
  const sensor = squareStringSensor(matrix);
  return (x: number, y: number) => {
    if (hole(x, y)) return false;
    return sensor(x, y);
  };
};

const full = "#".repeat(100);
saveTracedMatrix({
  filename: "full",
  width: Math.sqrt(full.length),
  height: Math.sqrt(full.length),
  outputWidth: 128,
  outputHeight: 128,
  padding: 1,
  path: matrixTracer(
    Math.sqrt(full.length),
    Math.sqrt(full.length),
    squareStringSensor(full)
  ),
});

saveTracedMatrix({
  filename: "empty",
  width: Math.sqrt(full.length),
  height: Math.sqrt(full.length),
  outputWidth: 128,
  outputHeight: 128,
  padding: 1,
  path: matrixTracer(
    Math.sqrt(full.length),
    Math.sqrt(full.length),
    squareStringSensor(full, "#")
  ),
});

const alternate = (" #".repeat(10) + "# ".repeat(10)).repeat(10);
saveTracedMatrix({
  filename: "alternate",
  width: Math.sqrt(alternate.length),
  height: Math.sqrt(alternate.length),
  outputWidth: 128,
  outputHeight: 128,
  padding: 2,
  path: matrixTracer(
    Math.sqrt(alternate.length),
    Math.sqrt(alternate.length),
    squareStringSensor(alternate)
  ),
});

saveTracedMatrix({
  filename: "with-hole",
  width: Math.sqrt(alternate.length),
  height: Math.sqrt(alternate.length),
  outputWidth: 128,
  outputHeight: 128,
  padding: 2,
  path: matrixTracer(
    Math.sqrt(alternate.length),
    Math.sqrt(alternate.length),
    squareStringSensorWithHole(alternate)
  ),
});

const isolated =
  "1.....22.1" + // 1 - corners
  "..333....." + // 2 - edges
  "2.3.3..4.." + // 3 - holes
  "2.333.4.4." + // 4 - intersections
  "2......4.." + // 5 - self intersections
  "2..55....2" + // 6 - shared corners
  "2.5.5..6.." +
  "2.555.6.6." +
  ".........." +
  "1.222222.1";
saveTracedMatrix({
  filename: "isolated",
  width: Math.sqrt(isolated.length),
  height: Math.sqrt(isolated.length),
  outputWidth: 128,
  outputHeight: 128,
  padding: 1,
  path: matrixTracer(
    Math.sqrt(isolated.length),
    Math.sqrt(isolated.length),
    squareStringSensor(isolated)
  ),
});
