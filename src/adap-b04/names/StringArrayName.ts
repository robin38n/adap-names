import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

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

        this.components[i] = c;
        
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        const validIndex = (i >= 0 && i <= this.components.length);
        if (!validIndex) throw new IllegalArgumentException(`Index ${i} is out of bounds.`);
        this.assertIsValidComponent(c);

        this.components.splice(i, 0, c);
        
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        this.components.push(c);

        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        this.components.splice(i, 1);

        this.assertClassInvariants();
    }
    
    protected assertClassInvariants(): void {
        // Alle Komponenten korrekt
        for (const component of this.components) {
            this.assertIsValidComponent(component);
        }
        // Name darf nicht leer sein
        if (this.getNoComponents() === 0) {
            throw new InvalidStateException("Name cannot be empty.");
        }
        
    }

}