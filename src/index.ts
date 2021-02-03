import generatePath from "./generatePath";

const pathFromSquareString = (map: string) => {
  const size = Math.sqrt(map.length);
  if (size % 1 !== 0)
    throw `not a square\nlength: ${map.length}\nsize: ${size}`;
  console.log(
    generatePath(size, size, (col: number, row: number) => {
      if (map[row * size + col] !== " ") return true;
      return false;
    })
  );
};

pathFromSquareString(
  "1   2    1" + // 1 - black cells in corners
    "  3   4   " + // 2 - black colls on edges
    " 33  4 4  " + // 3 - concave polygon
    "          " + // 4 - self-intesection
    "2      5  " + // 5 - intersection
    "      5 5 " + // 6 - hole
    "  666  5  " +
    "  6 6    2" +
    "  666     " +
    "1     2  1"
);

pathFromSquareString(
  "##########" +
    "##########" +
    "##########" +
    "##########" +
    "##########" +
    "##########" +
    "##########" +
    "##########" +
    "##########" +
    "##########"
);

pathFromSquareString(
  "          " +
    "          " +
    "          " +
    "          " +
    "          " +
    "          " +
    "          " +
    "          " +
    "          " +
    "          "
);
