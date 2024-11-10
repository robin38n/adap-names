import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        if (other.length === 0){
            throw new Error("Empty String not allowed.");
        }

        if (delimiter){
            this.delimiter = delimiter
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
        this.name = other;
        this.length = 1; 

        for (let i = 0; i < other.length; i++) {
            if (other[i] === ESCAPE_CHARACTER && (i + 1 < other.length && other[i + 1] === this.delimiter) && (i != 0 && other[i - 1] !== ESCAPE_CHARACTER)) {
                i++; 
            } else if (other[i] === this.delimiter) {
                this.length++;
            }
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        let escapedName = "";
        for (let i = 0; i < this.name.length; i++) {
            if (this.name[i] === ESCAPE_CHARACTER && (this.name[i+1] === undefined || this.name[i+1] != delimiter)) {
                escapedName += ESCAPE_CHARACTER + this.name[i];
            } else {
                escapedName += this.name[i];
            }
        }

        return escapedName;
    }

    public asDataString(): string {
        const delimiter = this.getDelimiterCharacter();
        let str = "";
        for (let i = 0; i < this.name.length; i++) {
            if (this.name[i] === ESCAPE_CHARACTER  && (this.name[i+1] === undefined || this.name[i+1] != delimiter)) {
                str += ESCAPE_CHARACTER + this.name[i];
            } else {
                str += this.name[i];
            }
        }

        return str;
    }

    public isEmpty(): boolean {
        return (this.name == "" ? true: false);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.length;
    }

    public getComponent(x: number): string {
        if (x < 0 || x >= this.getNoComponents()) {
            throw new RangeError(`Index ${x} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        return this.name.split(this.delimiter)[x]
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.getNoComponents()) {
            throw new RangeError(`Index ${n} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        for (let j = 0; j < c.length; j++) {
            if (c[j] == this.delimiter && (c[j-1] != ESCAPE_CHARACTER || c[j-1] === undefined)) {
                throw new Error("Invalid Input");
            }
        }
        const components = this.name.split(this.delimiter);
        components[n] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.getNoComponents()) {
            throw new RangeError(`Index ${n} is out of bounds. Must be between 0 and ${this.getNoComponents()}.`);
        }
        for (let j = 0; j < c.length; j++) {
            if (c[j] == this.delimiter && (c[j-1] != ESCAPE_CHARACTER || c[j-1] === undefined)) {
                throw new Error("Invalid Input");
            }
        }
        const components = this.name.split(this.delimiter);
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.length ++;
    }

    public append(c: string): void {
        for (let j = 0; j < c.length; j++) {
            if (c[j] == this.delimiter && (c[j-1] != ESCAPE_CHARACTER || c[j-1] === undefined)) {
                throw new Error("Invalid Input");
            }
        }
        const components = this.name.split(this.delimiter);
        components.push(c);
        this.name = components.join(this.delimiter);
        this.length ++;
    }

    public remove(n: number): void {
        if (n < 0 || n >= this.getNoComponents()) {
            throw new RangeError(`Index ${n} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        const components = this.name.split(this.delimiter);
        const len = components[n].length
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.length --;
    }

    public concat(other: Name): void {
        if (other.getDelimiterCharacter() !== this.delimiter) {
            throw new Error("Delimiters do not match.");
        }
    
        const components = this.name.split(this.delimiter);
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
            this.length ++;
        }
    
        this.name = components.join(this.delimiter);
    }

}