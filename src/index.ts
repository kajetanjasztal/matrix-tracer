import generatePath from "./generatePath";
import * as fs from "fs";
const QRCode = require("qrcode-svg");

const pathFromQrCodeModules = (
  content: string,
  padding: number,
  size: number
) => {
  const qrcode = new QRCode(content);
  qrcode.save("../outputs/native.svg");

  const modules = qrcode.qrcode.modules;
  fs.writeFile(
    "../outputs/our.svg",
    `<?xml version="1.0" standalone="yes"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-${padding} -${padding} ${
      modules.length + 2 * padding
    } ${
      modules.length + 2 * padding
    }" width="${size}" height="${size}"><path style="fill-rule:evenodd" d="${generatePath(
      modules.length,
      modules.length,
      (x, y) => modules[x][y]
    )}" /></svg>`,
    () => console.log("saved ours")
  );
};

const content = "https://github.com/kajetanjasztal/svgQR";
console.log(pathFromQrCodeModules(content, 4, 256));
