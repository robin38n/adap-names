import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        //IllegalArgumentException.assertIsNotNullOrUndefined(baseName);
        //IllegalArgumentException.assertIsNotNullOrUndefined(parent);
        IllegalArgumentException.assert(baseName.trim().length > 0, "Base name cannot be empty.");
        IllegalArgumentException.assert(!baseName.includes("/"), "Base name cannot contain '/'.");
        
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.doGetFileState() !== FileState.CLOSED, "File must be closed to open");
        // do something
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(noBytes >= 0, "noBytes must be positive Integer");
        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch(ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        IllegalArgumentException.assert(this.doGetFileState() !== FileState.OPEN, "File must be open to close");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}