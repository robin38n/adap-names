import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assertCondition(bn.trim().length > 0, "Base name cannot be empty.");
        IllegalArgumentException.assertCondition(!bn.includes("/"), "Base name cannot contain '/'.");

        super(bn, pn);
    }

    public add(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        // Keine Überprüfung, ob bereits vorhanden, da childNodes: Set<Node> keine Duplikate erlaubt
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assertCondition(this.childNodes.has(cn), "Node to be removed does not exist in childNodes");
        
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}