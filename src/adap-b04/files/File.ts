import { Node } from "./Node";
import { Directory } from "./Directory";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        this.assertStateCondition(this.doGetFileState() !== FileState.CLOSED, "File must be closed to open");
        // do something
        this.state = FileState.OPEN;
    }

    public close(): void {
        this.assertStateCondition(this.doGetFileState() !== FileState.OPEN, "File must be open to close");
        // do something
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}