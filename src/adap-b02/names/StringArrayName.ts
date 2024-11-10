import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0){
            throw new Error("Empty Array not allowed.");
        }

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
                if (component[j] === ESCAPE_CHARACTER && (component[j+1] === undefined || component[j+1] != delimiter)) {
                    escapedComponent += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                } else {
                    escapedComponent += component[j];
                }
            }
            str += (i === 0 ? "" : delimiter) + escapedComponent;
        }
        return str;
    }

    public asDataString(): string {
        if (this.components.length === 0){
            return "";
        }
        const delimiter = this.getDelimiterCharacter();
        let str: string = "";
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            let escapedComponent = "";
            
            for (let j = 0; j < component.length; j++) {
                if (component[j] === ESCAPE_CHARACTER && (component[j+1] === undefined || component[j+1] != delimiter)) {
                    escapedComponent += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                /*
                } else if (component[j] === delimiter) {
                    escapedComponent += ESCAPE_CHARACTER + delimiter;
                */
                } else {
                    escapedComponent += component[j];
                }
            }
            str += (i === 0 ? "" : delimiter) + escapedComponent;
        }
        return str;
    }

    public isEmpty(): boolean {
        if (this.components.length === 0 || (this.components.length === 1 && this.components[0] == "")){
            return true;
        } else {
            return false;
        }
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
        for (let j = 0; j < c.length; j++) {
            if (c[j] == this.delimiter && (c[j-1] != ESCAPE_CHARACTER || c[j-1] === undefined)) {
                throw new Error("Invalid Input");
            }
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length}.`);
        }
        for (let j = 0; j < c.length; j++) {
            if (c[j] == this.delimiter && (c[j-1] != ESCAPE_CHARACTER || c[j-1] === undefined)) {
                throw new Error("Invalid Input");
            }
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        for (let j = 0; j < c.length; j++) {
            if (c[j] == this.delimiter && (c[j-1] != ESCAPE_CHARACTER || c[j-1] === undefined)) {
                throw new Error("Invalid Input");
            }
        }
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        if (other.getDelimiterCharacter() !== this.delimiter) {
            throw new Error("Delimiters do not match.");
        }

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

}