import { describe, it, expect, beforeEach } from "vitest";
import { SOCIAL_NETWORKS } from "./types";
import {
  STORAGE_KEY,
  DEFAULT_SIGNATURE_DATA,
  loadSignatureData,
  saveSignatureData,
  resetSignatureData,
} from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trip save -> load restitue les mêmes données", () => {
    const data = loadSignatureData();
    data.fullName = "Jean Test";
    data.style.accentColor = "#123456";
    data.social.linkedin = "https://linkedin.com/in/jean";
    saveSignatureData(data);

    const reloaded = loadSignatureData();
    expect(reloaded).toEqual(data);
  });

  it("retourne les défauts quand le storage est vide", () => {
    expect(loadSignatureData()).toEqual(DEFAULT_SIGNATURE_DATA);
  });

  it("retourne les défauts sur JSON corrompu sans lever d'exception", () => {
    localStorage.setItem(STORAGE_KEY, "{ ceci n'est pas du json");
    expect(() => loadSignatureData()).not.toThrow();
    expect(loadSignatureData()).toEqual(DEFAULT_SIGNATURE_DATA);
  });

  it("complète un objet partiel (sans style) avec les défauts", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fullName: "Partiel" }));
    const loaded = loadSignatureData();
    expect(loaded.fullName).toBe("Partiel");
    expect(loaded.style).toEqual(DEFAULT_SIGNATURE_DATA.style);
    expect(loaded.jobTitle).toBe(DEFAULT_SIGNATURE_DATA.jobTitle);
  });

  it("complète un objet social incomplet avec toutes les clés réseau", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ social: { linkedin: "https://linkedin.com/in/x" } }),
    );
    const loaded = loadSignatureData();
    expect(loaded.social.linkedin).toBe("https://linkedin.com/in/x");
    for (const network of SOCIAL_NETWORKS) {
      expect(typeof loaded.social[network]).toBe("string");
    }
    expect(loaded.social.twitter).toBe("");
  });

  it("ignore les champs de type invalide et retombe sur le défaut", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fullName: 42, style: { fontSize: "grand" } }),
    );
    const loaded = loadSignatureData();
    expect(loaded.fullName).toBe(DEFAULT_SIGNATURE_DATA.fullName);
    expect(loaded.style.fontSize).toBe(DEFAULT_SIGNATURE_DATA.style.fontSize);
  });

  it("resetSignatureData efface la clé et fait retomber sur les défauts", () => {
    const data = loadSignatureData();
    data.fullName = "À effacer";
    saveSignatureData(data);
    resetSignatureData();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadSignatureData()).toEqual(DEFAULT_SIGNATURE_DATA);
  });

  it("ne partage pas la référence de l'objet défaut (mutation isolée)", () => {
    const a = loadSignatureData();
    a.social.github = "muté";
    const b = loadSignatureData();
    expect(b.social.github).toBe("");
    expect(DEFAULT_SIGNATURE_DATA.social.github).toBe("");
  });
});
