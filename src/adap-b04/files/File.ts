import { Node } from "./Node";
import { Directory } from "./Directory";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        IllegalArgumentException.assertIsNotNullOrUndefined(baseName);
        IllegalArgumentException.assertIsNotNullOrUndefined(parent);
        IllegalArgumentException.assertCondition(baseName.trim().length > 0, "Base name cannot be empty.");
        IllegalArgumentException.assertCondition(!baseName.includes("/"), "Base name cannot contain '/'.");

        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assertCondition(this.doGetFileState() !== FileState.CLOSED, "File must be closed to open");
        // do something
        this.state = FileState.OPEN;
    }



    public read(noBytes: number): Int8Array {
        // read something
        return new Int8Array();
    }

    public close(): void {
        IllegalArgumentException.assertCondition(this.doGetFileState() !== FileState.OPEN, "File must be open to close");
        // do something
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}