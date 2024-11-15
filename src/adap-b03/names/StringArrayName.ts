import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0){
            throw new Error("Empty Array not allowed.");
        }
        super();
        for (let i = 0; i < other.length; i++) {
            for (let j = 0; j < other[i].length; j++) {
                if (other[i][j] == this.delimiter && 
                    (other[i][j-1] != ESCAPE_CHARACTER || (other[i][j-1] === ESCAPE_CHARACTER && other[i][j-2] === ESCAPE_CHARACTER))){
                        throw new Error(`Invalid Input at component no ${i}.`);
                }
            }
        }
        this.components = other;
    }

    asString(delimiter: string = this.delimiter): string {
        if (this.components.length === 0){
            return "";
        } 

        let str: string = "";
        for (let i = 0; i < this.components.length; i++) {
            str += (i === 0 ? "" : delimiter) + this.components[i];
        }
        return str;
    }

    asDataString(): string {
        if (this.components.length === 0){
            return "";
        }
        const delimiter = this.getDelimiterCharacter();
        let str: string = "";
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            let escapedComponent = "";
            
            for (let j = 0; j < component.length; j++) {
                if (component[j] === ESCAPE_CHARACTER && component[j+1] != delimiter) {
                    escapedComponent += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                } else {
                    escapedComponent += component[j];
                }
            }
            str += (i === 0 ? "" : delimiter) + escapedComponent;
        }
        return str;
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }
        return this.components[i];
    }
    setComponent(i: number, c: string) {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        this.components[i] = c;
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length}.`);
        }
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        this.components.splice(i, 0, c);
    }

    append(c: string) {
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        this.components.push(c);
    }

    remove(i: number) {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }
        this.components.splice(i, 1);
    }

}