import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelChar(delimiter);
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const clonedData = structuredClone(this);
        const clone = Object.create(Object.getPrototypeOf(this));
        const cloneObj = Object.assign(clone, clonedData)
        
        this.assertClassInvariants();
        MethodFailedException.assert(this.isEqual(cloneObj), "clone");

        return cloneObj;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelChar(delimiter);

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

        this.assertClassInvariants();
        MethodFailedException.assert("string" === typeof(str) ,"asString");
        return str;
        
    }

    public toString(): string {
        let str = this.asDataString();
        this.assertClassInvariants();
        MethodFailedException.assert("string" === typeof(str) ,"toString");
        return str;
    }

    public asDataString(): string {
        let delimiter = this.getDelimiterCharacter();
        let str = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            str += (i === 0 ? "" : delimiter) + this.getComponent(i);
        }
        this.assertClassInvariants();
        MethodFailedException.assert("string" === typeof(str) ,"asDataString");
        return str;
    }

    public isEqual(other: Name): boolean {
        this.assertIsNotNullOrUndefined(other);
        
        let equalHashCode: boolean = this.getHashCode() == other.getHashCode();
        let equalDelimiter: boolean = this.getDelimiterCharacter() == other.getDelimiterCharacter();
        let equal: boolean = equalDelimiter && equalHashCode;

        this.assertClassInvariants();
        MethodFailedException.assert("boolean" === typeof(equal) ,"isEqual");
        return equal;
    }

    public getHashCode(): number {
        
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        this.assertClassInvariants();
        MethodFailedException.assert("number" === typeof(hashCode) ,"asDataString");
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() == 0 ? true : false;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    abstract concat(other: Name): Name; 
    
    //Precondition assertion Methods 

    protected assertIsNotNullOrUndefined(other: Object): void {
        let condition: boolean = (other != null) && (other != undefined);
        IllegalArgumentException.assert(condition, "null or undefined argument");        
    }

    protected assertIsValidDelChar(d: string) {
        let condition: boolean = (d.length == 1);
        IllegalArgumentException.assert(condition, "invalid delimiter character");
    }

    protected assertMatchingDelChars(other: Name, delimiter: string) {
        let condition: boolean = (other.getDelimiterCharacter() === delimiter);
        IllegalArgumentException.assert(condition, "delimiters differ");
    }

    protected assertIsValidIndex(i: number) {
        let condition: boolean = (i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assert(condition, `Index ${i} is out of bounds.`);
    }
    
    /**
     * checks if Input Component is valid.
     * valid if: delimiter correctly escaped 
     *  -> odd number of escape char in front of delimiter -> true
     *  -> even number  or zero -> false
     */
    protected assertIsValidComponent(c: string) {
        let isEscaped = false;
        for (let i = 0; i < c.length; i++) {
            if (c[i] === ESCAPE_CHARACTER) {
                isEscaped = !isEscaped;
            } else {
                if (c[i] === this.delimiter) {
                    // Der Delimiter ist nur gültig, wenn isEscaped true ist
                    if (!isEscaped) {
                        throw new IllegalArgumentException(`Component not properly masked`);
                    }
                }
                isEscaped = false; // Reset für den nächsten Charakter
            }
        }
    }
    
    //Class Invariance Method
    protected assertClassInvariants() {
        // name not empty
        if (this.getNoComponents() === 0) throw new InvalidStateException("Name cannot be empty.");
        // valid del char
        if (this.getDelimiterCharacter().length != 1) throw new InvalidStateException("Invalid delimiter char for name object")
    }
    
}