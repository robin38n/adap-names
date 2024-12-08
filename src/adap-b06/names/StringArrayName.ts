import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.assertIsNotNullOrUndefined(source);
        IllegalArgumentException.assert(source.length != 0, "Empty Name not allowed");
        for (let i = 0; i < source.length; i++) this.assertIsValidComponent(source[i]);
        
        this.components = source;

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

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);
    
        let components = [...this.components];
        components[i] = c;
        let newName: Name = new StringArrayName(components, this.getDelimiterCharacter());
        
        //class inv for newName
        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getComponent(i) == c, 
            "setComponent failed");

        return newName;
    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert((i >= 0 && i <= this.components.length), `Index ${i} is out of bounds.`);
        this.assertIsValidComponent(c);

        let components = [...this.components];
        components.splice(i, 0, c);
        let newName: Name = new StringArrayName(components, this.getDelimiterCharacter());
        
        //class invariants for newName checked in constructor
        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getComponent(i) == c && 
            newName.getNoComponents() == this.getNoComponents() + 1, 
            "insert failed");
        
        return newName;
    }

    public append(c: string): Name {
        this.assertIsValidComponent(c);

        let components = [...this.components];
        components.push(c);
        let newName: Name = new StringArrayName(components, this.getDelimiterCharacter());
        
        //class invariants for newName checked in constructor
        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getComponent(newName.getNoComponents() - 1) == c && 
            newName.getNoComponents() == this.getNoComponents() + 1, 
            "append failed");
        
        return newName;
    }

    public remove(i: number): Name {
        this.assertIsValidIndex(i);

        let components = [...this.components];
        components.splice(i, 1);
        let newName: Name = new StringArrayName(components, this.getDelimiterCharacter());
        
        //class invariants for newName checked in constructor
        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getNoComponents() == this.getNoComponents() - 1, 
            "remove failed");

        return newName;
    }

    public concat(other: Name): Name {
        this.assertIsNotNullOrUndefined(other);
        this.assertMatchingDelChars(other, this.getDelimiterCharacter());

        let components = [...this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        let newName = new StringArrayName(components, this.getDelimiterCharacter());
        
        //class invariants for newName checked in constructor
        this.assertClassInvariants();
        MethodFailedException.assert(
            newName.getNoComponents() == this.getNoComponents() + other.getNoComponents(), 
            "concat failed");

        return newName;
    }
    
}