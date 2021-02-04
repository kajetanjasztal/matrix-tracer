const generatePath: (
  width: number,
  height: number,
  sensor: (x: number, y: number) => boolean
) => string = (width, height, sensor) => {
  const position2index: ({ x, y }: { x: number; y: number }) => number = ({
    x,
    y,
  }) => x + y * (width + 1);

  const sensorWithPadding = ({ x, y }: { x: number; y: number }) => {
    if (x < 0) return 0;
    if (y < 0) return 0;
    if (x >= width) return 0;
    if (y >= height) return 0;
    if (!sensor(x, y)) return 0;
    return 1;
  };

  const corner: ({ x, y }: { x: number; y: number }) => boolean = ({
    x,
    y,
  }) => {
    return (
      (sensorWithPadding({ x: x - 1, y: y - 1 }) ^
        sensorWithPadding({ x, y: y - 1 }) ^
        sensorWithPadding({ x: x - 1, y }) ^
        sensorWithPadding({ x, y })) ===
      1
    );
  };

  const visited: number[] = [];
  let tracing: {
    axis: "h" | "v";
    direction: -1 | 1;
    distance: number;
  } | null = null;
  let path: string = "";
  let position: { x: number; y: number } = { x: -1, y: 0 };
  while (position.y <= height) {
    if (!tracing) {
      position = { ...position, x: position.x + 1 };
      if (position.x > width) position = { x: 0, y: position.y + 1 };
      if (visited.includes(position2index(position))) continue;
      if (!corner(position)) continue;
      visited.push(position2index(position));
      path += `M${position.x} ${position.y}`;
      tracing = { axis: "h", direction: 1, distance: 0 };
      continue;
    }
    position = {
      x: tracing.axis === "h" ? position.x + tracing.direction : position.x,
      y: tracing.axis === "v" ? position.y + tracing.direction : position.y,
    };
    tracing.distance += tracing.direction;
    if (!corner(position)) continue;
    if (visited.includes(position2index(position))) {
      path += "z";
      tracing = null;
      continue;
    }
    visited.push(position2index(position));
    path += tracing.axis + tracing.distance;
    tracing = {
      axis: tracing.axis === "h" ? "v" : "h",
      direction:
        sensorWithPadding(position) ===
        sensorWithPadding({
          ...position,
          ...(tracing.axis === "h"
            ? { x: position.x - 1 }
            : { y: position.y - 1 }),
        })
          ? -1
          : 1,
      distance: 0,
    };
  }
  return path;
};

export default generatePath;
