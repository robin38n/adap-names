import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        
        IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assertCondition(bn.trim().length > 0, "Base name cannot be empty.");
        IllegalArgumentException.assertCondition(!bn.includes("/"), "Base name cannot contain '/'.");

        
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(to);
        IllegalArgumentException.assertCondition(this.parentNode !== to, "Cannot move node to the same directory.");
        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;
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
        IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assertCondition(bn.trim().length > 0, "Base name cannot be empty.");
        IllegalArgumentException.assertCondition(!bn.includes("/"), "Base name cannot contain '/'.");
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

}
