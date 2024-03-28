import * as ExcelScript from './excelscript';

export function print(message?: object | string | number) {
    console.log(message);
    ExcelScript.getRange("A1");
}