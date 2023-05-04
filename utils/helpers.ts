export class MyHelpers {
    /**
     * Create an array of strings from some baseText, appended with its index + 1 IF enumerateStrings is set to true
     * @param numberOfElements the number of elements in the string array
     * @param baseText the text from which to create the array
     * @param enumerateStrings flag to disable array string enumeration
     * @returns Array(baseText+1, baseText+2, ..., baseText+numberOfElements)
     * @remarks uses type coalescing to allow us to add string and number
     */
    async createArrayOfStrings(numberOfElements: number, baseText: string, enumerateStrings: boolean): Promise<string[]> {
        let returnArray = new Array<string>(numberOfElements);
            if (enumerateStrings === true){
                for (let i = 1; i <= numberOfElements; i++)
                {
                returnArray[i - 1] = baseText + i;
                }
            }
            else {
               returnArray.fill(baseText);
            }
        return returnArray;
    }

    /**
     * Check if the input text has no leading and no trailing whitespace.
     * @param text The text to check for whitespace.
     * @returns true if the text has no surrounding whitespace.
     */
    async checkStringHasBeenTrimmed(text: string): Promise<boolean> {
        return (text === text.trim());
    }
}
