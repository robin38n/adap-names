import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const clonedData = structuredClone(this);
        const clone = Object.create(Object.getPrototypeOf(this));
        this.assertClassInvariants();
        const cloneObj = Object.assign(clone, clonedData)
        this.assertPostconditionWithoutBackup(this.isEqual(cloneObj), "clone");
        return cloneObj;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelChar(delimiter);

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
        this.assertPostconditionWithoutBackup("string" === typeof(str) ,"asString");
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
        this.assertPostconditionWithoutBackup("string" === typeof(str) ,"asDataString");
        return str;
    }

    public isEqual(other: Name): boolean {
        this.assertIsNotNullOrUndefined(other);
        this.assertClassInvariants();
        let equal: boolean = false;
        if (this.getHashCode() == other.getHashCode()){
            equal = true;
        }
        
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
        this.assertPostconditionWithoutBackup("number" === typeof(hashCode) ,"asDataString");
        return hashCode;
    }

    public isEmpty(): boolean {
        this.assertClassInvariants();
        return this.getNoComponents() == 0 ? true : false;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        this.assertIsNotNullOrUndefined(other);
        this.assertMatchingDelChars(other, this.getDelimiterCharacter());

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        this.assertClassInvariants();
    }

    /**
     * Precondition assertion Methods
     */    
    protected assertIsNotNullOrUndefined(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument");        
    }

    protected assertIsValidDelChar(d: string) {
        let condition: boolean = (d.length == 1);
        IllegalArgumentException.assertCondition(condition, "invalid delimiter character");
    }

    protected assertMatchingDelChars(other: Name, delimiter: string) {
        let condition: boolean = (other.getDelimiterCharacter() === delimiter);
        IllegalArgumentException.assertCondition(condition, "delimiters differ");
    }

    protected assertIsValidIndex(i: number) {
        let condition: boolean = (i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assertCondition(condition, `Index ${i} is out of bounds.`);
    }
    
    /**
     * checks if Input Component is valid.
     * valid if: delimiter correctly escaped 
     *  -> odd number of escape char in front of delimiter -> true
     *  -> even number  or zero -> false
     */
    protected assertIsValidComponent(c: string) {
        let isEscaped = false;
        for (let j = 0; j < c.length; j++) {
            if (c[j] === ESCAPE_CHARACTER) {
                isEscaped = !isEscaped;
            } else {
                if (c[j] === this.delimiter) {
                    // Der Delimiter ist nur gültig, wenn isEscaped true ist
                    if (!isEscaped) {
                        throw new IllegalArgumentException(`Component ${j} not properly masked`);
                    }
                }
                isEscaped = false; // Reset für den nächsten Charakter
            }
        }
    }
    
    /**
     * Class Invariance Methods
     */
    protected assertClassInvariants() {
        // name not empty
        if (this.getNoComponents() === 0) {
            throw new InvalidStateException("Name cannot be empty.");
        }
    }

    /**
     * Postcondition
     */
    protected assertPostconditionWithoutBackup(condition: boolean, message: string): void {
        if (!condition) {
            throw new MethodFailureException(`Postcondition failed in Methode: ${message}`);
        }
    }
    
}