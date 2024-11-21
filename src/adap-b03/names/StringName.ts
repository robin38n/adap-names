import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        if (other.length === 0){
            throw new Error("Empty String not allowed.");
        }
        super(delimiter);
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

    getNoComponents(): number {
        return this.noComponents;
    }

    getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        let components = this.splitToArray();
        
        return components[i];

    }

    setComponent(i: number, c: string) {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        let components = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components[i] = this.getComponent(i);
        }
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents()}.`);
        }
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        let components = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components[i] = this.getComponent(i);
        }
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;
    }

    append(c: string) {
        if (!this.isValidInput(c)) throw new Error(`Invalid Input`);

        let components = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components[i] = this.getComponent(i);
        }
        components.push(c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;
    }

    remove(i: number) {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        let components = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components[i] = this.getComponent(i);
        }
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents --;
    }

    private splitToArray(): string[] {
        const components: string[] = [];
        let currentComponent = "";
        let isEscaped = false;

        for (let j = 0; j < this.name.length; j++) {
            const char = this.name[j];

            if (isEscaped) {
                currentComponent += char;
                isEscaped = false;
            } else if (char === ESCAPE_CHARACTER) {
                isEscaped = true;
                currentComponent += char;
            } else if (char === this.getDelimiterCharacter()) {
                components.push(currentComponent);
                currentComponent = "";
            } else {
                currentComponent += char;
            }
        }

        components.push(currentComponent);
        return components;
    }

}