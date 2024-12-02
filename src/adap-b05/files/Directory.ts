import { ExceptionType } from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Node } from "./Node";
import { RootNode } from "./RootNode";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assertCondition(!bn.includes("/"), "Base name cannot contain '/'.");
        super(bn, pn);
    }

    public add(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assertCondition(this.childNodes.has(cn), "Node to be removed does not exist in childNodes");
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        let localNodes = new Set<Node>();
        let recursiveNodes = new Set<Node>();
        
        for (const n of this.childNodes) {
            const base = n.getBaseName();
            if (base.length == 0 && !(n.isRoot())) {
                throw new ServiceFailureException(
                    "node basename cannot be empty, service terminated",
                     new InvalidStateException("buggy file")
                    );
            }
            if (base === bn) {
                localNodes.add(n);
            }

            if (n.isDirectory()) { 
                recursiveNodes = new Set<Node>([...recursiveNodes, ...(n as Directory).findNodes(bn)]);
            }

        }

        return new Set<Node>([...localNodes, ...recursiveNodes]);
    }

    public isDirectory(): boolean {
        return true;
    }

    public isRoot(): boolean {
        return false;
    }

}