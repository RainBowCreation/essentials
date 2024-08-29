/**
 * Essential lib by nsuphar1
 * last update: 5 April 2024
 **/

/**
 * Removes all alphabetic characters (both lowercase and uppercase) from a given string, 
 * leaving only non-alphabetic characters such as digits, punctuation, and whitespace. 
 * This function is particularly useful for extracting non-textual information from a string 
 * or when you need to cleanse a string of textual data.
 *
 * @param {string} str - The input string from which alphabetic characters will be removed.
 * 
 * @returns {string} - A new string with all alphabetic characters removed. If the original string 
 * contains no alphabetic characters, the function returns the original string unchanged.
 * 
 * Example:
 * // Removes all alphabetical characters from the string, leaving only numbers and any special characters
 * console.log(removeAlpha("Hello, World 2023!")); // Outputs ", 2023!"
 */
function removeAlpha(str: string): string {
    // Use a regular expression to match and remove all lowercase and uppercase alphabetic characters globally
    return str.replace(/[A-Za-z]/g, "");
}

/**
 * Strips a string of all characters except alphabetical letters, effectively leaving only the 
 * lowercase and uppercase letters from A to Z. This function is useful for filtering out numbers, 
 * punctuation, whitespace, and any other non-letter characters from a string, which can be 
 * particularly helpful in text processing tasks where only the alphabetic content is relevant.
 *
 * @param {string} str - The input string to be processed.
 * 
 * @returns {string} - A new string containing only the alphabetic characters from the original string.
 * If the original string contains no non-alphabetic characters, the function returns the original string unchanged.
 * 
 * Example:
 * // Demonstrates removing digits, punctuation, and whitespace, leaving only alphabetical characters
 * console.log(removeNotAlpha("Hello, World 2023!")); // Outputs "HelloWorld"
 */
function removeNotAlpha(str: string): string {
    // Use a regular expression to match and remove all characters that are not lowercase or uppercase letters
    return str.replace(/[^A-Za-z]/g, "");
}

/**
 * Eliminates all numeric characters (0-9) from the provided string, resulting in a string that 
 * consists solely of non-numeric characters. This function is particularly useful when you need 
 * to extract or isolate textual or symbolic information from a string that includes a mix of 
 * letters, numbers, and potentially other characters.
 *
 * @param {string} str - The input string from which numeric characters will be removed.
 * 
 * @returns {string} - A new string with all numeric characters stripped out. If the original 
 * string does not contain any numeric characters, the function returns the original string unchanged.
 * 
 * Example:
 * // Demonstrates the removal of numbers from a string, leaving letters and any special characters intact
 * console.log(removeNumber("Hello123, World456!")); // Outputs "Hello, World!"
 */
function removeNumber(str: string): string {
    // Utilizes a regular expression to identify and remove all numeric characters globally from the string
    return str.replace(/[0-9]/g, "");
}

/**
 * Filters out every character in a string except for numeric digits (0-9). This function is 
 * beneficial for extracting numerical data from strings that contain a mixture of text, 
 * symbols, and numbers. It can be particularly useful in scenarios where you need to isolate 
 * numeric values from mixed content for further numerical processing or analysis.
 *
 * @param {string} str - The input string to be processed.
 * 
 * @returns {string} - A new string containing only the numeric characters from the original string.
 * If the original string contains no non-numeric characters, the function returns the original string unchanged.
 * 
 * Example:
 * // Illustrates extracting numeric characters from a mixed-content string
 * console.log(removeNotNumber("Year 2023, Month 09")); // Outputs "202309"
 */
function removeNotNumber(str: string): string {
    // Employs a regular expression to identify and remove all characters that are not numeric digits globally in the string
    return str.replace(/[^0-9]/g, "");
}

/**
 * Filters out all alphanumeric characters (both letters and numbers) from the provided string, 
 * leaving only non-alphanumeric characters such as punctuation marks and spaces. This function 
 * can be used to isolate special characters from a string that contains a mix of letters, 
 * digits, and symbols, making it useful for parsing or cleaning textual data.
 *
 * @param {string} str - The input string from which alphanumeric characters will be removed.
 * 
 * @returns {string} - A new string containing only the non-alphanumeric characters from the original string.
 * If the original string consists entirely of alphanumeric characters, the function returns an empty string.
 * 
 * Example:
 * // Demonstrates removing alphanumeric characters to isolate special characters and spaces
 * console.log(removeNotAlphaNumberic("abc123!@# ")); // Should output "!@# "
 */
function removeNotAlphaNumberic(str: string): string {
    // Corrects the regular expression to remove alphanumeric characters, leaving only non-alphanumeric ones
    return str.replace(/[A-Za-z0-9]/g, "");
}

/**
 * Converts a string formatted for use with Power Automate (which may contain single quotes as string delimiters 
 * and escaped newline characters) into a valid JSON string by replacing single quotes with double quotes and 
 * removing newline escapes. This function is particularly useful when dealing with JSON strings from Power Automate 
 * that need to be parsed into JavaScript objects or used in contexts where standard JSON format is required.
 *
 * @param {string} js_string - A JSON-like string possibly using single quotes for strings and containing escaped newlines.
 * 
 * @returns {string} - A valid JSON string with double quotes for string delimiters and without newline escapes.
 * 
 * Example:
 * // Converts a Power Automate formatted string to standard JSON format
 * const inputString = "{'key': 'value',\\n'key2': 'value2\\n'}";
 * const jsonString = automateToJSON(inputString);
 * console.log(jsonString); // Outputs: "{"key": "value","key2": "value2\\n"}"
 */
function automateStringToJSON(js_string: string): string {
    // Replace single quotes with double quotes and remove escaped newlines to make the string JSON-compatible
    return js_string.replace(/'/g, '"').replace(/(?<!\\)\n/g, '');
}

/**
 * Identifies the indices of a target string within an array and continues to include indices of 
 * subsequent empty strings, treating them as part of a merged sequence. This approach is useful 
 * when interpreting data structures that represent merged cells, such as in Excel, where the value 
 * is present only at the first index of the merge, and subsequent positions are empty. The function 
 * ensures that once the target string is found, all directly following empty strings are also 
 * considered part of the target 'group', simulating the behavior of merged cells.
 *
 * @param {string} str - The target string to search for within the array.
 * @param {string[]} strlist - The array of strings to be searched, potentially representing a column of Excel data.
 * 
 * @returns {Set<number>} - A set of indices representing the start of the target string and 
 * the continuation of any directly subsequent empty strings. This set provides the positions 
 * where either the target string is found or where empty strings immediately follow the found target string.
 * 
 * Example:
 * // Assuming a list of strings where "Target" is followed by empty strings
 * const strlist = ["", "Target", "", "", "Other"];
 * const indicesSet = findAllMergeIndexAsSet("Target", strlist);
 * console.log(indicesSet); // Outputs: Set { 1, 2, 3 }
 * // Indicates that "Target" was found at index 1, with merged 'cells' extending to index 3.
 */
function findAllMergeIndexAsSet(str: string, strlist: string[]): Set<number> {
    let out_set: Set<number> = new Set();
    let has_founded = false; // Flag to keep track if the target string has been found

    // Iterate over each string in the array
    for (let k = 0; k < strlist.length; k++) {
        let str_k_val = strlist[k];

        // If the current string matches the target, mark as found and add its index to the set
        if (str_k_val == str) {
            has_founded = true;
            out_set.add(k);
            ///console.log(` | | |_ Adding Major at ${k}..`)
        }
        // If the target string has been found and the current string is empty, add its index to the set
        else if (has_founded) {
            if (str_k_val != "") {
                has_founded = false
            } // Stop adding if a non-empty, non-target string is encountered
            else {
                out_set.add(k);
                ///console.log(` | | |_ Adding Minor at ${k}...`)
            }
        }
    }

    //console.log(out_set); // Optionally log the resulting set of indices
    return out_set; // Return the set of indices
}

/**
 * Searches through an array of strings and identifies all indices where the specified string is found.
 * This function returns a Set containing all matching indices, ensuring uniqueness and providing an efficient 
 * way to determine the positions of a specific string within a larger array. It's particularly useful for 
 * scenarios where you need to locate all occurrences of a given string within a dataset, such as finding 
 * all matching entries in a column of Excel data.
 *
 * @param {string} str - The target string to search for within the array.
 * @param {string[]} range - The array of strings to be searched.
 * 
 * @returns {Set<number>} - A set of unique indices representing the positions in the array where the target 
 * string is found. If the target string is not found, an empty Set is returned.
 * 
 * Example:
 * // Assuming a list of strings with multiple occurrences of "Target"
 * const range = ["Target", "Other", "Target", "Another", "Target"];
 * const indices = strFindAllIndexToSet("Target", range);
 * console.log(indices); // Outputs: Set { 0, 2, 4 }
 * // Indicates that "Target" was found at indices 0, 2, and 4 within the array.
 */
function strFindAllIndexToSet(str: string, range: string[]): Set<number> {
    let index_set: Set<number> = new Set();
    // Iterate over each string in the array
    for (let k = 0; k < range.length; k++) {
        // If the current string matches the target, add its index to the set
        if (range[k] === str)
            index_set.add(k);
    }
    // Return the set of indices where the target string was found
    return index_set;
}

/**
 * Computes the intersection of multiple sets of numbers, returning a set that contains only the elements
 * present in all the given sets. This function is useful for finding common elements across various collections,
 * similar to finding the intersection in a Venn diagram. It iterates through an array of sets, successively 
 * computing the intersection of each with the cumulative result.
 *
 * @param {Set<number>[]} set_list - An array of sets, each containing numbers, from which to find the intersection.
 * 
 * @returns {Set<number>} - A new set containing only the elements that are present in every set within the input array.
 * If the input array contains only one set, that set is returned as is.
 * 
 * Example:
 * // Assuming three sets of numbers
 * const setA = new Set([1, 2, 3, 4]);
 * const setB = new Set([2, 3, 4, 5]);
 * const setC = new Set([3, 4, 5, 6]);
 * const commonElements = multiple_list_intersection([setA, setB, setC]);
 * console.log(commonElements); // Outputs: Set {3, 4}
 */
function setsIntersection(setsArray: Set<number>[]): Set<number> {
    // Sort the array of sets based on their size to ensure we start with the smallest sets
    setsArray.sort((a, b) => a.size - b.size);

    // Start with the smallest set for the initial intersection
    let currentIntersection: Set<number> = setsArray[0];

    // Iterate over the rest of the sets and update the currentIntersection
    for (let i = 1; i < setsArray.length; i++) {
        // Temporary set to store the intersection of currentIntersection and the next set
        let tempIntersection: Set<number> = new Set<number>();

        // Iterate over the currentIntersection, check if the element exists in the next set
        // and if so, add it to tempIntersection
        for (let item of Array.from(currentIntersection)) {
            if (setsArray[i].has(item)) {
                tempIntersection.add(item);
            }
        }

        // Update currentIntersection with the results from tempIntersection
        currentIntersection = tempIntersection;

        // If at any point currentIntersection becomes empty, we can break early
        // as the intersection of further sets will also be empty
        if (currentIntersection.size === 0) {
            break;
        }
    }
    return currentIntersection;
}


function replaceFakeNewLine(str: string): string {
    return str.replace(/\\n/g, '\n');
}

function print(message: string | number | object) {
    console.log(message);
}

function now(): number {
    return Date.now();
}

function int(str: string): number {
    return Number.parseInt(str);
}

function automateStringToDate(date: string): Date {
    let fi = date.indexOf("-");
    let li = date.lastIndexOf("-");
    let year = Number.parseInt(date.substring(0, fi));
    let month = Number.parseInt(date.substring(fi + 1, li));
    let day = Number.parseInt(date.substring(li + 1));
    return new Date(year, month, day)
}
