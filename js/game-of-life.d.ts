interface lifeSettings {
    width: number;
    height: number;
    rule?: string;
    density?: number;
}
interface life {
    width: number;
    height: number;
    sensor: (x: number, y: number) => boolean;
    updateLife: () => void;
}
declare const createLife: (settings: lifeSettings) => life;
export default createLife;
