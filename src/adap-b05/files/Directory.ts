import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        let localNodes = new Set<Node>();
        let recursiveNodes = new Set<Node>();
        
        for (const n of this.childNodes) {
            if (n.getBaseName() === bn) {
                localNodes.add(n);
            }

            if (n instanceof Directory) { 
                recursiveNodes = new Set<Node>([...recursiveNodes, ...(n as Directory).findNodes(bn)]);
            }

        }

        return new Set<Node>([...localNodes, ...recursiveNodes]);
    }

}