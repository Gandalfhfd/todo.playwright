export class MyHelpers {

    /**
     * Create an array of strings from some baseText, appended with its index + 1
     * @param numberOfElements the number of elements in the string array
     * @param baseText the text from which to create the array
     * @returns Array(baseText+1, baseText+2, ..., baseText+numberOfElements)
     * @remarks uses type coalescing to allow us to add string and number
     */
    async createArrayOfEnumeratedStrings(numberOfElements: number, baseText: string): Promise<string[]> {
        let returnArray = new Array<string>(numberOfElements);
        for (let i = 1; i <= numberOfElements; i++) {
            returnArray[i - 1] = baseText + i;
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