import matrixTracer from "../../lib/matrix-tracer";
import * as fs from "fs";

import QRCode from "qrcode-svg";

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
  fs.writeFile(
    "example/svg/matrix-tracer.svg",
    `<?xml version="1.0" standalone="yes"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-${padding} -${padding} ${
      modules.length + 2 * padding
    } ${
      modules.length + 2 * padding
    }" width="${size}" height="${size}"><rect x="${-padding - 1}" y="${
      -padding - 1
    }" width="${size + (padding + 1) * 2}" height="${
      size + (padding + 1) * 2
    }" style="fill:#fff"/><path style="fill-rule:evenodd"\nd="${matrixTracer(
      modules.length,
      modules.length,
      (x, y) => modules[x][y]
    )}"/></svg>`,
    (error) => error && console.log(error)
  );
};

const content = "https://github.com/kajetanjasztal/matrix-tracer";
pathFromQrCodeModules(content, 4, 120);
