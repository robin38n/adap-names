export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    // @method-type Initialization Method (Mutation Method)
    constructor(other: string[], delimiter?: string) {
        this.components = other;

        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = this.DEFAULT_DELIMITER;
        }
    }

    // @method-type Conversion Method (Query Method)
    public asNameString(delimiter: string = this.delimiter): string {
        
        if (this.components.length == 0){
            return "";
        } 

        let str: string = this.components[0] || '';
        for (let i = 1; i < this.components.length; i++) {
            str = str.concat(delimiter, this.components[i]);
        }
        return str;
    }

    // @method-type Get Method (Query Method)
    public getComponent(i: number): string {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        return this.components[i];
    }

    // @method-type Set Method (Mutation Method)
    public setComponent(i: number, c: string): void {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        this.components[i] = c;
    }

    // @method-type Get Method (Query Method)
    public getNoComponents(): number {
        return this.components.length;
    }

    // @method-type Command Method (Mutation Method)
    public insert(i: number, c: string): void {

        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length}.`);
        }

        this.components.splice(i, 0, c);
    }

    // @method-type Command Method (Mutation Method)
    public append(c: string): void {
        this.components.push(c);
    }

    // @method-type Command Method (Mutation Method)
    public remove(i: number): void {

        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} is out of bounds. Must be between 0 and ${this.components.length - 1}.`);
        }

        this.components.splice(i, 1);
    }

}