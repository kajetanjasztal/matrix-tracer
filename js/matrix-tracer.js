const generatePath = (width, height, sensor, rounding = false) => {
    const position2index = ({ x, y, }) => x + y * (width + 1);
    const sensorWithPadding = ({ x, y }) => {
        if (x < 0)
            return 0;
        if (y < 0)
            return 0;
        if (x >= width)
            return 0;
        if (y >= height)
            return 0;
        if (!sensor(x, y))
            return 0;
        return 1;
    };
    const corner = ({ x, y, }) => {
        return ((sensorWithPadding({ x: x - 1, y: y - 1 }) ^
            sensorWithPadding({ x, y: y - 1 }) ^
            sensorWithPadding({ x: x - 1, y }) ^
            sensorWithPadding({ x, y })) ===
            1);
    };
    const visited = [];
    let tracing = null;
    let path = "";
    let position = { x: -1, y: 0 };
    while (position.y <= height) {
        if (!tracing) {
            position = Object.assign(Object.assign({}, position), { x: position.x + 1 });
            if (position.x > width)
                position = { x: 0, y: position.y + 1 };
            if (visited.includes(position2index(position)))
                continue;
            if (!corner(position))
                continue;
            visited.push(position2index(position));
            path += rounding
                ? `M${position.x}\n${position.y + 0.5}q0-.5 .5-.5`
                : `M${position.x}\n${position.y}`;
            tracing = { axis: "h", direction: 1, distance: 0 };
            continue;
        }
        position = {
            x: tracing.axis === "h" ? position.x + tracing.direction : position.x,
            y: tracing.axis === "v" ? position.y + tracing.direction : position.y,
        };
        tracing.distance += tracing.direction;
        if (!corner(position))
            continue;
        if (visited.includes(position2index(position))) {
            path += "z";
            tracing = null;
            continue;
        }
        visited.push(position2index(position));
        if (rounding) {
            path += tracing.axis + (tracing.distance - tracing.direction) + "q";
            path +=
                tracing.axis === "h" ? (tracing.direction < 0 ? "-.5" : ".5") : "0";
            path +=
                tracing.axis === "v" ? (tracing.direction < 0 ? "-.5" : " .5") : " 0";
        }
        else {
            path += tracing.axis + tracing.distance;
        }
        const repeat = tracing.direction < 0 ? "-.5" : " .5";
        tracing = {
            axis: tracing.axis === "h" ? "v" : "h",
            direction: sensorWithPadding(position) ===
                sensorWithPadding(Object.assign(Object.assign({}, position), (tracing.axis === "h"
                    ? { x: position.x - 1 }
                    : { y: position.y - 1 })))
                ? -1
                : 1,
            distance: 0,
        };
        if (rounding) {
            path += tracing.axis === "v" ? repeat : "";
            path += tracing.direction < 0 ? "-.5" : " .5";
            path += tracing.axis === "h" ? repeat : "";
        }
    }
    return path;
};
export default generatePath;
