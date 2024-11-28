export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    // @method-type Initialization Method
    constructor(other: string[], delimiter?: string) {
        this.components = other;

        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @method-type Conversion Method
    public asNameString(delimiter: string = this.delimiter): string {
        if (this.components.length == 0){
            return "";
        } 

        let str: string = this.components[0] || '';
        for (let i = 1; i < this.components.length; i++) {
            str = str.concat(delimiter, this.components[i]);
        }
        return str;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }

    // @method-type Get Method
    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        return this.components[i];
    }

    // @method-type Set Method
    public setComponent(i: number, c: string): void {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        this.components[i] = c;
    }

    // @method-type Get Method
    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        return this.components.length;
    }

    // @method-type Command Method
    public insert(i: number, c: string): void {

        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length}.`);
        }

        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    // @method-type Command Method
    public append(c: string): void {
        this.components.push(c);
    }

    // @method-type Command Method
    public remove(i: number): void {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        this.components.splice(i, 1);
    }

}