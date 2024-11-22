import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        Node.assertIsNotNullOrUndefinedStatic(bn);
        Node.assertArgumentConditionStatic(bn.trim().length > 0, "Base name cannot be empty.");
        Node.assertIsNotNullOrUndefinedStatic(pn);
        
        this.doSetBaseName(bn);
        this.parentNode = pn;
    }

    public move(to: Directory): void {
        this.assertIsNotNullOrUndefined(to);
        this.parentNode.remove(this);
        to.add(this);
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsNotNullOrUndefined(bn);
        this.assertArgumentCondition(bn.trim().length > 0, "New base name cannot be empty.");
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Node {
        return this.parentNode;
    }

    protected assertIsNotNullOrUndefined(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument");        
    }

    protected assertIsValidState(other: Object): void {
        let condition: boolean =! InvalidStateException.isNullOrUndefined(other);
        InvalidStateException.assertCondition(condition, "invalid state for this operation");
    }

    protected assertStateCondition(cond: boolean, exMsg: string): void {
        if (!cond) throw new InvalidStateException(exMsg);
    }

    protected assertArgumentCondition(cond: boolean, exMsg: string): void {
        if (!cond) throw new IllegalArgumentException(exMsg);
    }

    protected static assertArgumentConditionStatic(cond: boolean, exMsg: string): void {
        if (!cond) throw new IllegalArgumentException(exMsg);
    }

    protected static assertIsNotNullOrUndefinedStatic(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument in constructor");
    }
}
