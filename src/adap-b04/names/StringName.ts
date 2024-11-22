import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super();
        throw new Error("needs implementation");
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);

        let components = this.splitToArray();
        return components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        let components = this.splitToArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        let components = this.splitToArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        let components = this.splitToArray();
        components.push(c);
        this.name = components.join(this.delimiter);
        this.noComponents ++;
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        let components = this.splitToArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents --;
    }

    private splitToArray(): string[] {
        const components: string[] = [];
        let currentComponent = "";
        let isEscaped = false;

        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];

            if (isEscaped) {
                currentComponent += char;
                isEscaped = false;
            } else if (char === ESCAPE_CHARACTER) {
                isEscaped = true;
                currentComponent += char;
            } else if (char === this.getDelimiterCharacter()) {
                components.push(currentComponent);
                currentComponent = "";
            } else {
                currentComponent += char;
            }
        }

        components.push(currentComponent);
        return components;
    }

}