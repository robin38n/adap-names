import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        if (other.length === 0){
            throw new Error("Empty String not allowed.");
        }
        super();
        this.name = other;
        this.length = 1; 

        let isEscaped = false;
        for (let i = 0; i < other.length; i++) {
            if (other[i] === ESCAPE_CHARACTER) {
                isEscaped = !isEscaped;
            } else {
                if (other[i] === this.delimiter) {
                    if (!isEscaped) {
                        this.length ++;
                    }
                }
                isEscaped = false;
            }
        }
    }

    asString(delimiter: string = this.delimiter): string {
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

    asDataString(): string {
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

    getNoComponents(): number {
        return this.length;
    }

    getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        return this.name.split(this.delimiter)[i]
    }
    setComponent(i: number, c: string) {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        const components = this.name.split(this.delimiter);
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents()}.`);
        }
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        const components = this.name.split(this.delimiter);
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.length ++;
    }
    append(c: string) {
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        const components = this.name.split(this.delimiter);
        components.push(c);
        this.name = components.join(this.delimiter);
        this.length ++;

    }
    remove(i: number) {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        const components = this.name.split(this.delimiter);
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.length --;
    }
}