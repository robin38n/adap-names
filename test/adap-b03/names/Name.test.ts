import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test insert array", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});


describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("AsString tests", () => {
  it("test masked delimiter in StringName and StringArrayName", () => {
    
    let sn: Name = new StringName("cs.fau\\.oss.de", '.');
    let san: Name = new StringArrayName(["cs", "fau\\.oss", "de"], '.'); 
    sn.append("test\\\\t");
    san.append("test\\\\t");
    expect(sn.asString()).toBe(san.asString());
    expect(sn.asString('-')).toBe(san.asString('-'));
  });
});

describe("AsDataString test1", () => {
  it("test masked delimiter in StringName and StringArrayName", () => {
    
    
    let sn: Name = new StringName("cs.fau\\.oss.de", '.');
    let san: Name = new StringArrayName(["cs", "fau\\.oss", "de"], '.'); 
    sn.append("test\\test");
    san.append("test\\test");
    sn.append("test\\\\t");
    san.append("test\\\\t");
    expect(sn.asDataString()).toBe(san.asDataString());
  });
});

describe("getComponent test", () => {
  it("test getComp in StringName and StringArrayName", () => {
    let sn: Name = new StringName("fau.oss\\.cs.de", '.');
    let san: Name = new StringArrayName(["fau", "oss\\.cs", "de"], '.');
    
    expect(sn.getNoComponents()).toBe(san.getNoComponents());

    // Überprüfe jede Komponente
    for (let i = 0; i < sn.getNoComponents(); i++) {
      expect(sn.getComponent(i)).toBe(san.getComponent(i));
    }
  });
});

describe("Equality test", () => {
  it("test equality on StringName and StringArrayName", () => {
    let sn: Name = new StringName("cs.fau\\.oss.de", '.');
    let san: Name = new StringArrayName(["cs", "fau\\.oss", "de"], '.'); 
    sn.append("test\\test");
    san.append("test\\test");
    expect(sn.isEqual(san)).toBe(true);
  });

  it("test equality of clone", () => {
    
    let original = new StringName("fau.oss\\.cs.de", '.');
    let cloned = original.clone();
    let n = new StringArrayName(["a", "b"], '$');
    let cn = n.clone();
    n.remove(0);
    cn.remove(0);
    expect(cn.isEqual(n)).toBe(true);
    
    cloned.append("a");
    original.append("a");
    expect(cloned.isEqual(original)).toBe(true);
  });
});


