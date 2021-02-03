const generatePath: (
  width: number,
  height: number,
  sensor: (x: number, y: number) => boolean
) => string = (width, height, sensor) => {
  const sensorWithPadding = ({ col, row }: { col: number; row: number }) => {
    if (col < 0) return 0;
    if (row < 0) return 0;
    if (col >= width) return 0;
    if (row >= height) return 0;
    if (!sensor(col, row)) return 0;
    return 1;
  };

  const pos2index: ({ col, row }: { col: number; row: number }) => number = ({
    col,
    row,
  }) => col + row * (width + 1);
  const corner: ({ col, row }: { col: number; row: number }) => boolean = ({
    col,
    row,
  }) => {
    return (
      (sensorWithPadding({ col: col - 1, row: row - 1 }) ^
        sensorWithPadding({ col, row: row - 1 }) ^
        sensorWithPadding({ col: col - 1, row }) ^
        sensorWithPadding({ col, row })) ===
      1
    );
  };

  const visited: boolean[] = new Array((width + 1) * (height + 1)).fill(false);
  let motion: {
    axis: "h" | "v";
    direction: -1 | 1;
    distance: number;
  } | null = null;
  let pathD: string = "";
  let pos: { col: number; row: number } = { col: -1, row: 0 };

  while (pos.row <= height) {
    if (!motion) {
      pos = { ...pos, col: pos.col + 1 };
      if (pos.col > width) {
        pos = { col: 0, row: pos.row + 1 };
      }

      if (visited[pos2index(pos)]) continue;
      visited[pos2index(pos)] = true;

      if (!corner(pos)) continue;

      pathD += `M${pos.col},${pos.row}`;
      motion = { axis: "h", direction: 1, distance: 0 };
      continue;
    }

    pos = {
      col: motion.axis === "h" ? pos.col + motion.direction : pos.col,
      row: motion.axis === "v" ? pos.row + motion.direction : pos.row,
    };
    motion.distance += motion.direction;
    if (!corner(pos)) continue;

    if (visited[pos2index(pos)]) {
      pathD += "z";
      motion = null;
      continue;
    }

    visited[pos2index(pos)] = true;
    pathD += motion.axis + motion.distance;
    motion = {
      axis: motion.axis === "h" ? "v" : "h",
      direction:
        sensorWithPadding(pos) ===
        sensorWithPadding({
          ...pos,
          ...(motion.axis === "h"
            ? { col: pos.col - 1 }
            : { row: pos.row - 1 }),
        })
          ? -1
          : 1,
      distance: 0,
    };
  }
  return pathD;
};

export default generatePath;
