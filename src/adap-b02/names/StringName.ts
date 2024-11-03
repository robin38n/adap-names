import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        if (delimiter){
            this.delimiter = delimiter
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
        this.name = other;
        this.length = other.length;
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation");
    }

    public asDataString(): string {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        return (this.name == "" ? true: false);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.name.split(this.delimiter).length;
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
        const components = this.name.split(this.delimiter);
        components[n] = c;
        this.name = components.join(this.delimiter);
        this.length += c.length + 1;
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.getNoComponents()) {
            throw new RangeError(`Index ${n} is out of bounds. Must be between 0 and ${this.getNoComponents()}.`);
        }
        const components = this.name.split(this.delimiter);
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.length += c.length + 1;
    }

    public append(c: string): void {
        const components = this.name.split(this.delimiter);
        components.push(c);
        this.name = components.join(this.delimiter);
        this.length += c.length + 1;
    }

    public remove(n: number): void {
        if (n < 0 || n >= this.getNoComponents()) {
            throw new RangeError(`Index ${n} is out of bounds. Must be between 0 and ${this.getNoComponents() - 1}.`);
        }
        const components = this.name.split(this.delimiter);
        const len = components[n].length
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.length -=  + 1;
    }

    public concat(other: Name): void {
        if (other.getDelimiterCharacter() !== this.delimiter) {
            throw new Error("Delimiters do not match.");
        }
    
        const components = this.name.split(this.delimiter);
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
            this.length += other.getComponent(i).length;
        }
    
        this.name = components.join(this.delimiter);
    }

}