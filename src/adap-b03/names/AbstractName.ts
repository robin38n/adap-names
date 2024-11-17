import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        } else {
            this.delimiter = DEFAULT_DELIMITER;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter.length != 1) {
            throw new Error ("delimiter expected to be a single character");
        }
        if (this.isEmpty()){
            return "";
        } 
        let str = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            let component = this.getComponent(i);
            let cleanedComp = "";
            for (let j = 0; j < component.length; j++) {
                if (component[j] != ESCAPE_CHARACTER) {
                    cleanedComp += component[j];
                }
            }
            str += (i === 0 ? "" : delimiter) + cleanedComp;
        }
        return str;
        
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        if (this.isEmpty()){
            return "";
        } 
        let delimiter = this.getDelimiterCharacter();
        let str = this.getComponent(0);
        for (let i = 1; i < this.getNoComponents(); i++) {
            str += (i === 0 ? "" : delimiter) + this.getComponent(i);
        }
        return str;
    }

    public isEqual(other: Name): boolean {
        if (this.getHashCode() == other.getHashCode()){
            return true;
        } else {
            return false;
        }
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        /*  Wenn zirkuläre Referenzen -> Fehler,
            aber in dieser Implementierung nicht vorhanden
        **/
    
        const clonedData = structuredClone(this);

        const clone = Object.create(Object.getPrototypeOf(this));
        
        return Object.assign(clone, clonedData);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() == 0 ? true : false;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if (other.getDelimiterCharacter() !== this.delimiter) {
            throw new Error("Delimiters do not match.");
        }

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    /**
     * checks if Input is valid.
     * valid if: delimiter correctly escaped 
     *  -> odd number of escape char in front of delimiter -> true
     *  -> even number  or zero -> false
     */
    protected isValidInput(c: string): boolean {
        let isEscaped = false;
        for (let j = 0; j < c.length; j++) {
            if (c[j] === ESCAPE_CHARACTER) {
                isEscaped = !isEscaped;
            } else {
                if (c[j] === this.delimiter) {
                    // Der Delimiter ist nur gültig, wenn isEscaped true ist
                    if (!isEscaped) {
                        return false;
                    }
                }
            isEscaped = false; // Reset für den nächsten Charakter
            }
        }
        return true;
    }
}