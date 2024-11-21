import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

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
        this.noComponents = 1; 

        let isEscaped = false;
        for (let i = 0; i < other.length; i++) {
            if (other[i] === ESCAPE_CHARACTER) {
                isEscaped = !isEscaped;
            } else {
                if (other[i] === this.delimiter) {
                    if (!isEscaped) {
                        this.noComponents ++;
                    }
                }
                isEscaped = false;
            }
        }
        
    }

    public asString(delimiter: string = this.delimiter): string {
        let str = this.name;
        let isEscaped = false;
        for (let i = 0; i < this.name.length; i++) {
            if (this.name[i] === ESCAPE_CHARACTER) {
                isEscaped = !isEscaped;
            } else {
                if (this.name[i] === this.getDelimiterCharacter()) {
                    if (!isEscaped) {
                        str = str.slice(0, i) + delimiter + str.slice(i+1);
                    }
                }
                isEscaped = false;
            }
        }
        return str;
    }

    public asDataString(): string {
        let str = "";
        for (let i = 0; i < this.name.length; i++) {
            if (this.name[i] === ESCAPE_CHARACTER  && this.name[i+1] != this.delimiter) {
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
        return this.noComponents;
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
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        const components = this.name.split(this.delimiter);
        components[n] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.getNoComponents()) {
            throw new RangeError(`Index ${n} is out of bounds. Must be between 0 and ${this.getNoComponents()}.`);
        }
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        const components = this.name.split(this.delimiter);
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;
    }

    public append(c: string): void {
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        const components = this.name.split(this.delimiter);
        components.push(c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;
    }

    public remove(n: number): void {
        if (n < 0 || n >= this.getNoComponents()) {
            throw new RangeError(`Index ${n} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        const components = this.name.split(this.delimiter);
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.noComponents --;
    }

    public concat(other: Name): void {
        if (other.getDelimiterCharacter() !== this.delimiter) {
            throw new Error("Delimiters do not match.");
        }
        this.noComponents += other.getNoComponents();
    
        const components = this.name.split(this.delimiter);
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.name = components.join(this.delimiter);
    }

    public isValidInput(c: string): boolean {
        let isEscaped = false;
        for (let j = 0; j < c.length; j++) {
            if (c[j] === ESCAPE_CHARACTER) {
                isEscaped = !isEscaped;
            } else {
                if (c[j] === this.delimiter) {
                    // Der Delimiter ist nur gültig, wenn `isEscaped` true ist
                    if (!isEscaped) {
                        return false;
                    }
                }
            isEscaped = false; // Reset für den nächsten Char
            }
        }
        return true;
    }

}