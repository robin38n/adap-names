import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        if (!other || other.length === 0) {
            throw new IllegalArgumentException("Empty Array not allowed.");
        }
        super(delimiter);
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
        this.assertClassInvariants();
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

        const backup = {name: this.name, length: this.noComponents}
        let components = this.splitToArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
        
        this.assertPostcondition(this.getComponent(i) === c, "setComponent" , backup);
        this.assertClassInvariants();
        
    }

    public insert(i: number, c: string) {
        const validIndex = (i >= 0 && i <= this.noComponents);
        if (!validIndex) throw new IllegalArgumentException(`Index ${i} is out of bounds.`);
        this.assertIsValidComponent(c);

        const backup = {name: this.name, length: this.noComponents}
        let components = this.splitToArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;

        this.assertPostcondition(this.getComponent(i) === c && this.noComponents === backup.length + 1, "insert" , backup);
        this.assertClassInvariants();
        
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        const backup = {name: this.name, length: this.noComponents}
        let components = this.splitToArray();
        components.push(c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;

        this.assertPostcondition(this.getComponent(this.noComponents - 1) === c && this.noComponents === backup.length + 1, "append" , backup);
        this.assertClassInvariants();
        
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        const backup = {name: this.name, length: this.noComponents}
        let components = this.splitToArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents --;

        this.assertPostcondition(this.noComponents === backup.length - 1, "remove" , backup);
        this.assertClassInvariants();
        
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

    protected assertClassInvariants() {
        // noComponents must match the number of components in name
        const actualComponents = this.splitToArray().length;
        if (this.noComponents !== actualComponents) {
            throw new InvalidStateException(
                `noComponents (${this.noComponents}) dont match actual number of components (${actualComponents}).`
            );
        }
        // name not empty
        if (this.getNoComponents() === 0) {
            throw new InvalidStateException("Name cannot be empty.");
        }
    }

    protected assertPostcondition(condition: boolean, message: string, backup: { name: string, length: number }): void {
        if (!condition) {
            this.name = backup.name;
            this.noComponents = backup.length;
            this.assertClassInvariants();
            throw new MethodFailureException(`Postcondition failed in Methode: ${message}`);
        }
    }

}