import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        this.components = other;

        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        if (this.components.length === 0){
            return "";
        } 

        let str: string = "";
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            let escapedComponent = "";

            for (let j = 0; j < component.length; j++) {
                if (component[j] === ESCAPE_CHARACTER) {
                    escapedComponent += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                } else if (component[j] === delimiter) {
                    escapedComponent += ESCAPE_CHARACTER + delimiter;
                } else {
                    escapedComponent += component[j];
                }
            }
            str += (i === 0 ? "" : delimiter) + escapedComponent;
        }
        return str;
    }

    public asDataString(): string {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        return (this.components.length === 0 ? true: false);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length}.`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        // Check if delimiters match
        if (other.getDelimiterCharacter() !== this.delimiter) {
            throw new Error("Delimiters do not match.");
        }

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

}