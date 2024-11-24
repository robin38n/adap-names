import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

describe("concat test", () => {
    it("test equality on StringName and StringArrayName", () => {
      let sn: Name = new StringArrayName(["oss", "cs", "fau", "de"], ".");
      sn.concat(new StringArrayName(["oss", "cs", "fau", "de"], "."));
      expect(sn.asDataString()).toBe("oss.cs.fau.de.oss.cs.fau.de")
    });
});

describe("Equality test", () => {
    it("test equality on StringName and StringArrayName", () => {
      let sn: Name = new StringName("fau.cs", '.');
      let san: Name = new StringArrayName(["fau", "cs"], '.'); 
      sn.append("test\\test");
      san.append("test\\test");
      expect(sn.isEqual(san)).toBe(true);
    });
});

describe("Invalid state", () => {
    it("remove til empty", () => {
      let sn: Name = new StringName("fau.cs", '.');
      let san: Name = new StringArrayName(["fau", "cs"], '.'); 
      sn.remove(0);
      sn.insert(1, "test");
      sn.remove(0);
      sn.asString("+");
    });
});
