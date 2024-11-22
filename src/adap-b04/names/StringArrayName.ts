import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0 || other === undefined || other === null) {
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
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.assertIsValidComponent(c);
        this.components.push(c);
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

}