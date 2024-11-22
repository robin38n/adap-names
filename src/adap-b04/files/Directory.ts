import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        Directory.assertIsNotNullOrUndefinedStatic(bn);
        Directory.assertIsNotNullOrUndefinedStatic(pn);
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.assertIsNotNullOrUndefined(cn);
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.assertIsNotNullOrUndefined(cn);
        if (!this.childNodes.has(cn)) {
            throw new MethodFailureException("Node to be removed does not exist in childNodes");
        }
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    protected assertIsNotNullOrUndefined(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument");        
    }

    protected assertIsValidState(other: Object): void {
        let condition: boolean =! InvalidStateException.isNullOrUndefined(other);
        InvalidStateException.assertCondition(condition, "invalid state for this operation");
    }

    protected static assertIsNotNullOrUndefinedStatic(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument in constructor");
    }
}