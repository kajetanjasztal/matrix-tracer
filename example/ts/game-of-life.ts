interface lifeSettings {
  width: number;
  height: number;
  rule?: string; // B/S notation
  density?: number;
}

interface life {
  width: number;
  height: number;
  sensor: (x: number, y: number) => boolean;
  updateLife: () => void;
}

const createLife: (settings: lifeSettings) => life = ({
  width,
  height,
  rule = "3/23",
  density = 0.5,
}) => {
  let life: boolean[] = [];
  for (let i = 0; i < width * height; i++) life.push(Math.random() < density);

  //// Glider - for testing
  // let life: boolean[] = new Array(width * height).map((i) => false);
  // life[1 * width + 5] = true;
  // life[2 * width + 6] = true;
  // life[3 * width + 4] = true;
  // life[3 * width + 5] = true;
  // life[3 * width + 6] = true;

  const createRulles: () => number[][] = () => {
    const ruleSets = rule.split("/");
    if (ruleSets.length !== 2)
      throw "invalid rulestring, provide rulestring in B/S notation";
    return ruleSets.map((ruleset) =>
      ruleset.split("").map((character) => Number(character))
    );
  };

  const [birth, survive] = createRulles();

  const sensor = (x: number, y: number) => {
    return life[((width + x) % width) + ((height + y) % height) * width];
  };

  const executeRule: (x: number, y: number) => boolean = (x, y) => {
    let neighbours = 0;
    for (let dx = -1; dx < 2; dx++)
      for (let dy = -1; dy < 2; dy++) {
        if (dx === 0 && dy === 0) continue;
        if (sensor(x + dx, y + dy)) neighbours++;
      }
    return sensor(x, y)
      ? survive.includes(neighbours)
      : birth.includes(neighbours);
  };

  const updateLife: () => void = () => {
    const newLife: boolean[] = [];
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) newLife.push(executeRule(x, y));
    life = newLife;
  };

  return {
    width,
    height,
    sensor,
    updateLife,
  };
};

export default createLife;
