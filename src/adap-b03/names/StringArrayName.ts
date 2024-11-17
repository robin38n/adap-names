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