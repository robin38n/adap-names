import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (other === undefined || other === null || other.length === 0) {
            throw new IllegalArgumentException("Empty Array not allowed.");
        }
        super(delimiter);
        // assert all components in other properly masked
        for (let i = 0; i < other.length; i++) {
            const c = other[i];
            let isEscaped = false;
            for (let j = 0; j < c.length; j++) {
                if (c[j] === ESCAPE_CHARACTER) {
                    isEscaped = !isEscaped;
                } else {
                    if (c[j] === this.delimiter) {
                        if (!isEscaped) {
                            throw new IllegalArgumentException (`Invalid Input at component ${i}.`);
                        }
                    }
                    isEscaped = false;
                }
            }
        }
        this.components = other;
        this.assertClassInvariants();
    }

    public getNoComponents(): number {
        this.assertClassInvariants();
        
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);

        this.assertClassInvariants();

        return this.components[i];
        
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);
        const backup ={ components: [...this.components] };

        this.components[i] = c;
        
        this.assertPostcondition(this.components[i] === c, "setComponent", backup);
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        const validIndex = (i >= 0 && i <= this.components.length);
        if (!validIndex) throw new IllegalArgumentException(`Index ${i} is out of bounds.`);
        this.assertIsValidComponent(c);

        const backup ={ components: [...this.components] };

        this.components.splice(i, 0, c);
        
        this.assertPostcondition(this.components[i] === c && this.getNoComponents() == backup.components.length + 1, "insert", backup);
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsValidComponent(c);
        const backup ={ components: [...this.components] };

        this.components.push(c);
        
        this.assertPostcondition(this.components[this.components.length - 1] === c && this.components.length == backup.components.length + 1, "append", backup);
        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        const backup ={ components: [...this.components] };

        this.components.splice(i, 1);

        this.assertPostcondition(this.components.length == backup.components.length - 1, "remove", backup);
        this.assertClassInvariants();
    }
    
    protected assertClassInvariants(): void {
        // all components valid
        for (const component of this.components) {
            this.assertIsValidComponent(component);
        }
        // name not empty
        if (this.getNoComponents() === 0) {
            throw new InvalidStateException("Name cannot be empty.");
        }
        
    }

    protected assertPostcondition(condition: boolean, message: string, backup: { components: string[] }): void {
        if (!condition) {
            this.components = [...backup.components];
            this.assertClassInvariants();
            throw new MethodFailureException(`Postcondition failed in Methode: ${message}`);
        }
    }

}