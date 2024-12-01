import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.assertIsNotNullOrUndefined(other);
        IllegalArgumentException.assertCondition(other.length != 0, "Empty Name not allowed");
        this.name = other;

        // Calculate noComponents
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
        this.assertClassInvariants();
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        this.assertClassInvariants();
        
        let components = this.splitToArray();
        return components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        const backup = {name: this.name, length: this.noComponents};
        let components = this.splitToArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
        
        this.assertPostcondition(this.getComponent(i) === c, "setComponent" , backup);
        
    }

    public insert(i: number, c: string) {
        const validIndex = (i >= 0 && i <= this.noComponents);
        IllegalArgumentException.assertCondition(validIndex, `Index ${i} is out of bounds.`);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        const backup = {name: this.name, length: this.noComponents};
        let components = this.splitToArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;

        this.assertPostcondition(this.getComponent(i) === c && this.noComponents === backup.length + 1, "insert" , backup);
        
    }

    public append(c: string) {
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        const backup = {name: this.name, length: this.noComponents};
        let components = this.splitToArray();
        components.push(c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;

        this.assertPostcondition(this.getComponent(this.noComponents - 1) === c && this.noComponents === backup.length + 1, "append" , backup);
        
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        this.assertClassInvariants();

        const backup = {name: this.name, length: this.noComponents};
        let components = this.splitToArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents --;

        this.assertPostcondition(this.noComponents === backup.length - 1, "remove" , backup);
        
    }

    public concat(other: Name): void {
        this.assertClassInvariants();
        let backup = {name: this.name, length: this.noComponents};
        let expectedLength = this.getNoComponents() + other.getNoComponents();
        super.concat(other);
    
        // Berechnung der erwarteten Komponenten
        const originalComponents = this.splitToArray().slice(0, backup.length);
        const otherComponents = [];
        for (let i = 0; i < other.getNoComponents(); i++) {
            otherComponents.push(other.getComponent(i));
        }
        const expectedComponents = [...originalComponents, ...otherComponents];

        // Postcondition prüfen
        const actualComponents = this.splitToArray();
        const cond = (
            actualComponents.length === expectedLength &&
            actualComponents.every((c, index) => c === expectedComponents[index])
        );

        this.assertPostcondition(cond, "concat StringName", backup);
    }

    private splitToArray(): string[] {
        const components: string[] = [];
        let currentComponent = "";
        let isEscaped = false;

        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];

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

    protected assertPostcondition(condition: boolean, message: string, backup: { name: string, length: number }): void {
        if (!condition) {
            this.name = backup.name;
            this.noComponents = backup.length;
            throw new MethodFailedException(`Postcondition failed in Methode: ${message}`);
        }
        this.assertClassInvariants();
    }

}