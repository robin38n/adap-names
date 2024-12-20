import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        //IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        //IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assert(bn.trim().length > 0, "Base name cannot be empty.");
        IllegalArgumentException.assert(!bn.includes("/"), "Base name cannot contain '/'.");
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        //IllegalArgumentException.assertIsNotNullOrUndefined(target);
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        //IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assert(bn.trim().length > 0, "Base name cannot be empty.");
        IllegalArgumentException.assert(!bn.includes("/"), "Base name cannot contain '/'.");
        
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }
}