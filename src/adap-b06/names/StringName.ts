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
        IllegalArgumentException.assert(other.length != 0, "Empty Name not allowed");
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

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        let components = this.splitToArray();
        components[i] = c;
        let newName = new StringName(components.join(this.delimiter), this.delimiter); 

        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getComponent(i) == c, 
            "setComponent failed");
        return newName;

    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert((i >= 0 && i <= this.noComponents), `Index ${i} is out of bounds.`);
        this.assertIsValidComponent(c);

        let components = this.splitToArray();
        components.splice(i, 0, c);
        let newName = new StringName(components.join(this.delimiter), this.delimiter); 

        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getNoComponents() == this.getNoComponents() + 1 
            && newName.getComponent(i) == c, 
            "insert failed");
        return newName;
    }

    public append(c: string): Name {
        this.assertIsValidComponent(c);

        let components = this.splitToArray();
        components.push(c);
        let newName = new StringName(components.join(this.delimiter), this.delimiter); 

        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getNoComponents() == this.getNoComponents() + 1 
            && newName.getComponent(newName.getNoComponents() - 1) == c, 
            "append failed");
        return newName;
    }

    public remove(i: number): Name {
        this.assertIsValidIndex(i);

        let components = this.splitToArray();
        components.splice(i, 1);
        let newName = new StringName(components.join(this.delimiter), this.delimiter);  

        this.assertClassInvariants();
        (newName as StringName).assertClassInvariants();
        MethodFailedException.assert(
            newName.getNoComponents() == this.getNoComponents() - 1, 
            "remove failed");

        return newName;       
    }

    public concat(other: Name): Name {
        this.assertIsNotNullOrUndefined(other);
        this.assertMatchingDelChars(other, this.getDelimiterCharacter());

        let components = this.splitToArray();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        let newName = new StringName(components.join(this.delimiter), this.getDelimiterCharacter());

        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getNoComponents() == this.getNoComponents() + other.getNoComponents(), 
            "concat failed");
        return newName;
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
    
}