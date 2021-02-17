const createLife = ({ width, height, rule = "3/23", density = 0.5, }) => {
    let life = [];
    for (let i = 0; i < width * height; i++)
        life.push(Math.random() < density);
    const createRulles = () => {
        const ruleSets = rule.split("/");
        if (ruleSets.length !== 2)
            throw "invalid rulestring, provide rulestring in B/S notation";
        return ruleSets.map((ruleset) => ruleset.split("").map((character) => Number(character)));
    };
    const [birth, survive] = createRulles();
    const sensor = (x, y) => {
        return life[((width + x) % width) + ((height + y) % height) * width];
    };
    const executeRule = (x, y) => {
        let neighbours = 0;
        for (let dx = -1; dx < 2; dx++)
            for (let dy = -1; dy < 2; dy++) {
                if (dx === 0 && dy === 0)
                    continue;
                if (sensor(x + dx, y + dy))
                    neighbours++;
            }
        return sensor(x, y)
            ? survive.includes(neighbours)
            : birth.includes(neighbours);
    };
    const updateLife = () => {
        const newLife = [];
        for (let y = 0; y < height; y++)
            for (let x = 0; x < width; x++)
                newLife.push(executeRule(x, y));
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
