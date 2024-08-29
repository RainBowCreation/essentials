import * as Ess from './ess';
import * as ExcelScript from './excelscript';
// remove this line if used in Office script

/**
   * Essential_excel_extension lib by nsuphar1
   * some function must include Essential lib
   * last update: 1 Apr 2024
   */
function getIntersectionCell(worksheet: ExcelScript.Worksheet, userange: ExcelScript.Range, json_data: string | string[][], cache: undefined | essxCache = undefined): ExcelScript.Range {
  let cell_location = getIntersectionCellLocation(userange, json_data, cache);
  if (cell_location == "")
    return null;
  return worksheet.getRange(cell_location);
}

type essxSetCells = [string, [string, string, string][]][];

type essxMiniCache = {
  list: string[][],
  x: Map<string, Set<number>>,
  y: Map<string, Set<number>>
}

type essxCache = {
  map: Map<string, essxMiniCache>
}

function newEssxMiniCache(): essxMiniCache {
  let lst: string[][] = [];
  let minicache = {
    list: lst,
    x: new Map<string, Set<number>>(),
    y: new Map<string, Set<number>>()
  }
  return minicache;
}

function newEssxCache(): essxCache {
  let cache = {
    map: new Map<string, essxMiniCache>()
  }
  return cache;
}

function getIntersectionCellLocation(userange: ExcelScript.Range, json_data: string | string[][], cache: undefined | essxCache = undefined): string {
  // Parse the JSON string into a JavaScript object after converting it to a valid JSON format
  let data: string[][] // [[ida1, ctdn1, rtdn1], [iad2, ctdn2, rtdn2]]

  if (typeof json_data == "string")
    data = JSON.parse(automateStringToJSON(json_data));
  else
    data = json_data;

  let cached: essxCache;

  if (cache !== undefined)
    cached = cache;
  else
    cached = newEssxCache();

  /// console.log(`Finding intersection of ${iadn}...`)

  // Initialize sets to store indices for CTDn and RTDn values
  let ctdn_set_list: Set<number>[] = [];
  let rtdn_set_list: Set<number>[] = [];

  // Iterate over each IADn in the current section
  for (let i in data) {
    let ini = data[i];
    let iadn = ini[0]; // The cell address indicator (IADn)

    // Extract the CTDn and RTDn values
    let ctdn_val = replaceFakeNewLine(ini[1]);
    let rtdn_val = replaceFakeNewLine(ini[2]);
    let ini_subrange_val: string[][];
    let ctdn_set: Set<number>;
    let rtdn_set: Set<number>;

    if (cached.map.has(iadn)) { // iadn
      let minicache = cached.map.get(iadn) as essxMiniCache; // no minicache
      if (minicache.list === undefined) {
        minicache.list = [getColumnValues(userange, iadn), getRowValues(userange, iadn)];
      }
      if (minicache.x.has(ctdn_val)) { // check x
        ctdn_set = minicache.x.get(ctdn_val) as Set<number>;
      }
      else {
        ctdn_set = findAllMergeIndexAsSet(ctdn_val, minicache.list[0]);
        minicache.x.set(ctdn_val, ctdn_set);
      }
      if (minicache.y.has(rtdn_val)) { // check y
        rtdn_set = minicache.y.get(rtdn_val) as Set<number>;
      }
      else {
        rtdn_set = findAllMergeIndexAsSet(rtdn_val, minicache.list[1]);
        minicache.y.set(rtdn_val, rtdn_set);
      }
    }
    else {
      let minicache = newEssxMiniCache();
      minicache.list = [getColumnValues(userange, iadn), getRowValues(userange, iadn)];
      ctdn_set = findAllMergeIndexAsSet(ctdn_val, minicache.list[0]);
      minicache.x.set(ctdn_val, ctdn_set);
      rtdn_set = findAllMergeIndexAsSet(rtdn_val, minicache.list[1]);
      minicache.y.set(rtdn_val, rtdn_set);
      cached.map.set(iadn, minicache);
    }
    ctdn_set_list.push(ctdn_set);
    rtdn_set_list.push(rtdn_set);
  }

  // Find the intersection of indices for CTDn and RTDn values
  // These intersections determine the target cell's column and row in the worksheet
  let column = Array.from(setsIntersection(ctdn_set_list));
  /// console.log(` |_ Found intersection of column subset = ${column}`)
  let row = Array.from(setsIntersection(rtdn_set_list));
  /// console.log(` |_ Found intersection of row subset = ${row}`)

  // Assuming the first index is the target, convert the column index to a letter
  // and find the row number; this assumes there's at least one intersection
  let column_letter = columnIndexToLetter(column[0] + 1); // Convert to 1-based index and then to letter

  let row_number = row[0] + 1; // Convert to 1-based index
  // console.log(`${column_letter}|${row_number}`)

  if (column_letter == "" || column_letter == "NaN" || `${row_number}` == "" || `${row_number}` == "NaN") { //skip if not found target cell
    ///console.log(` |_ Blank/Unknow Cell ${column_letter}${row_number} skipped.`)
    return "";
  }

  let cell_address = `${column_letter}${row_number}`; // Construct the cell address

  return cell_address;

  // Log the target cell address for the intersection
  /// console.log(` |_ FOUND target cell for updating: ${cell_address}`);

  // Get the target cell range using the calculated address
  /*
  let target_cell = worksheet.getRange(cell_address);
  return target_cell;
  */
}

/***
 * args = string[][][]
 * [
 *    [ // cellcon 1
 *        [iadn, ctdn, rtdn],
 *        [iadn, ctdn, rtdn]
 *    ],
 *    [ // cellcon 2
 *        [idan, ctdn, rtdn],
 *        [iadn, ctdn, rtdn]
 *    ]
 * ]
 * return string[]
 */
/**
 * 
 * @param worksheet 
 * @param userange 
 * @param json_data 
 * @param cache 
 */
function getCellsValue(worksheet: ExcelScript.Worksheet, json_data: string | string[][][], cache: undefined | essxCache = undefined): string[] {
  let data: string[][][];
  if (typeof json_data == "string")
    data = JSON.parse(automateStringToJSON(json_data));
  else
    data = json_data;

  let cached: essxCache;

  if (cache !== undefined)
    cached = cache;
  else
    cached = newEssxCache();

  let userange = worksheet.getUsedRange();
  let values: string[] = [];
  for (let cell_ini of data) {
    let cell = getIntersectionCell(worksheet, userange, cell_ini, cached);
    values.push(cell.getValue() as string);
  }
  return values;
}

function getCellsLocation(worksheet: ExcelScript.Worksheet, json_data: string | string[][][], cache: undefined | essxCache = undefined): string[] {
  let data: string[][][];
  if (typeof json_data == "string")
    data = JSON.parse(automateStringToJSON(json_data));
  else
    data = json_data;

  let cached: essxCache;

  if (cache !== undefined)
    cached = cache;
  else
    cached = newEssxCache();

  let userange = worksheet.getUsedRange();
  let values: string[] = [];
  for (let cell_ini of data) {
    let cell = getIntersectionCellLocation(userange, cell_ini, cached);
    values.push(cell);
  }
  return values;
}

function setCellsValue(worksheet: ExcelScript.Worksheet, json_data: string | essxSetCells, cache: undefined | essxCache = undefined) {
  // Parse the JSON string into a JavaScript object after converting it to a valid JSON format
  let data: essxSetCells;

  if (typeof json_data == "string")
    data = JSON.parse(automateStringToJSON(json_data));
  else
    data = json_data;

  let cached: essxCache;

  if (cache !== undefined)
    cached = cache;
  else
    cached = newEssxCache();

  let userange = worksheet.getUsedRange();

  // Iterate over each data section (VALn and its corresponding data)
  for (let i in data) {
    let section = data[i];
    //// console.log(`Finding address for cell ${section1}...`)

    // Get the target cell range using the calculated address
    let target_cell = getIntersectionCell(worksheet, userange, section[1], cached)

    // Set the value of the target cell to valn, effectively updating the worksheet
    if (target_cell != null)
      target_cell.setFormula(section[0]);
    /// console.log(' |_ UPDATED! ____________________')
  }
}

/**
 *
 * json_data = [["cell_loc1", "value1"], ["cell_loc2", "value2"] ...["cell_locN", "valueN"]];
 * @param worksheet 
 * @param json_data 
 * @param values 
 */
function setCellsValueByLocation(worksheet: ExcelScript.Worksheet, json_data: string | string[][]) {
  // Parse the JSON string into a JavaScript object after converting it to a valid JSON format
  let data: [string, string][];

  if (typeof json_data == "string")
    data = JSON.parse(json_data);
  else
    data = json_data as [string, string][];
  // Iterate over each data section (VALn and its corresponding data)
  for (let i of data) {
    let cell = worksheet.getRange(i[0]);
    cell.setFormula(i[1]);
  }
}


function cellToRowLetter(cell_address: string): string {
  // Utilizes the removeAlpha function to strip away alphabetic characters,
  // leaving only the numeric row part of the address
  return removeAlpha(cell_address);
}

function columnLetterToIndex(column: string): number {
  // Initialize the index to 0
  let index = 0;
  // Loop through each character in the column string
  for (let i = 0; i < column.length; i++) {
    // Multiply the current index by 26 for each character processed, reflecting the 26 letters of the alphabet
    index *= 26;
    // Add the numeric value of the current letter to the index
    // 'A'.charCodeAt(0) is subtracted to make 'A' = 0, then add 1 to align with Excel's 1-based indexing
    index += (column.charCodeAt(i) - 'A'.charCodeAt(0)) + 1;
  }
  // Return the index adjusted to be zero-based
  return index - 1;
}

function cellToColumnLetter(cell_address: string): string {
  // Uses the removeNumber function to strip away numeric characters, leaving only the column letters
  return removeNumber(cell_address);
}

function columnIndexToLetter(column_index: number): string {
  let column_letter = "";
  // Iteratively compute the column letter from the column index.
  while (column_index > 0) {
    // Calculate the modulo to find the current letter in reverse.
    let modulo = (column_index - 1) % 26;
    // Prepend the computed letter to the result string.
    column_letter = String.fromCharCode(65 + modulo) + column_letter;
    // Update the column_index for the next iteration.
    column_index = Math.floor((column_index - modulo) / 26);
  }
  return column_letter;
}

function getColumnValues(range: ExcelScript.Range, iadn: string): string[] {
  let ctdn_range = range.getRow(parseInt(cellToRowLetter(iadn)) - 1);
  let ctdn_range_val = ctdn_range.getValues()[0] as string[];
  return ctdn_range_val;
}

function getRowValues(range: ExcelScript.Range, iadn: string): string[] {
  let rtdn_range = range.getColumn(columnLetterToIndex(cellToColumnLetter(iadn)));
  let rtdn_range_val: string[] = rtdn_range.getValues().map(row => String(row[0]))
  return rtdn_range_val;
}
