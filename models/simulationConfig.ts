import { Player } from "./player";

export type SimulationConfig = {
    gamesToRun: number,
    debugLogs: boolean,
    playersConfig: Array<Player>
}
