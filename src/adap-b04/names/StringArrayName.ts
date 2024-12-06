import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        this.assertIsNotNullOrUndefined(other);
        IllegalArgumentException.assert(other.length != 0, "Empty Name not allowed");
        for (let i = 0; i < other.length; i++) {
            this.assertIsValidComponent(other[i]);
        }
        
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
        this.assertClassInvariants();
        const backup ={ components: [...this.components] };

        this.components[i] = c;
        
        this.assertPostcondition(this.components[i] === c, "setComponent", backup);
    }

    public insert(i: number, c: string) {
        const validIndex = (i >= 0 && i <= this.components.length);
        IllegalArgumentException.assert(validIndex, `Index ${i} is out of bounds.`);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        const backup ={ components: [...this.components] };

        this.components.splice(i, 0, c);
        
        this.assertPostcondition(this.components[i] === c && this.getNoComponents() == backup.components.length + 1, "insert", backup);
    }

    public append(c: string) {
        this.assertIsValidComponent(c);
        this.assertClassInvariants();
        const backup ={ components: [...this.components] };

        this.components.push(c);
        
        this.assertPostcondition(this.components[this.components.length - 1] === c && this.components.length == backup.components.length + 1, "append", backup);
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        this.assertClassInvariants();
        const backup ={ components: [...this.components] };

        this.components.splice(i, 1);

        this.assertPostcondition(this.components.length == backup.components.length - 1, "remove", backup);
        
    }

    public concat(other: Name): void {
        this.assertClassInvariants();
        let backup = { components: [...this.components] };
        let expectedLength = this.getNoComponents() + other.getNoComponents();
        super.concat(other);
    
        const expectedComponents = [...backup.components];    
        for (let i = 0; i < other.getNoComponents(); i++) {
            expectedComponents.push(other.getComponent(i));
        }
        
        // Postcondition prüfen
        const cond = (
            this.components.length === expectedLength &&
            this.components.every((c, index) => c === expectedComponents[index])
        );

        this.assertPostcondition(cond, "concat StringArrayName", backup);
    }

    protected assertPostcondition(condition: boolean, message: string, backup: { components: string[] }): void {
        if (!condition) {
            this.components = [...backup.components];
            throw new MethodFailedException(`Postcondition failed in Methode: ${message}`);
        }
        this.assertClassInvariants();
    }

}