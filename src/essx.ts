import * as Ess from './ess';

export type Condition = [string, string, string];
export type Conditions = Condition[];
export type Redis = Map<string, string>;
export type RedisI = Map<string, number>;
export type RedisS = Map<string, Set<number>>;
export type Location = string
export type Locations = Location[];
export type Value = object | string | number | null;
export type Values = Value[];
export type Row = string | number;
export type Column = string;

export class Cell {
    get: ExcelScript.Range;
    value: Value; 
    set(value: Value = this.value) {
        setCells(this);
    }
    type: string;
    location: Location;
    row: Row;
    column: Column;
    json: string;
    condition: Condition;
    cache: Cache;
}

export class Cells {
    get: ExcelScript.Range;
    size: number;
    body: Cell[];
    values: Values;
    cache: Cache;
}

export class Cache {
    redis: Redis;
    map: RedisI;
    x: RedisS;
    y: RedisS;
}

export function setCells(cells: Cell | Cells) {

}
