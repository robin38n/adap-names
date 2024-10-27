export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    /**  @methodtype initialization-method */
    constructor(other: string[], delimiter?: string) {
        this.components = other;

        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = this.DEFAULT_DELIMITER;
        }
    }

    /** @methodtype conversion-method */
    /** Returns human-readable representation of Name instance */
    public asNameString(delimiter: string = this.delimiter): string {
        
        if (this.components.length == 0){
            return "";
        } 

        let str: string = "";
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            let escapedComponent = "";
            for (let j = 0; j < component.length; j++) {
                if (component[j] === this.ESCAPE_CHARACTER) {
                    // Double the escape character
                    escapedComponent += this.ESCAPE_CHARACTER + this.ESCAPE_CHARACTER;
                } else if (component[j] === delimiter) {
                    // Escape the delimiter
                    escapedComponent += this.ESCAPE_CHARACTER + delimiter;
                } else {
                    escapedComponent += component[j];
                }
            }
            str += (i === 0 ? "" : delimiter) + escapedComponent;
        }
        return str;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        return this.components[i];
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        this.components[i] = c;
    }

    /** @methodtype get-method */
    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        return this.components.length;
    }
     
    /** @methodtype command-method */
    public insert(i: number, c: string): void {

        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length}.`);
        }

        this.components.splice(i, 0, c);
    }

    /** @methodtype command-method */
    public append(c: string): void {
        this.components.push(c);
    }

    /** @methodtype command-method */
    public remove(i: number): void {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        this.components.splice(i, 1);
    }

}