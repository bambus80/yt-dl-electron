import { app } from "electron";
import { readFileSync } from "fs";
import path from "path";

const library = path.join(app.getPath("userData"), "library");
const dbFile = path.join(library, "db.json");

export const getLibrary = () => {
  try {
    return JSON.parse(readFileSync(dbFile, "utf8"));
  } catch {
    return { library: [] };
  }
};

export const addToLibrary = () => {
  throw new Error("TODO");
};

export const getVideoURL = () => {
  throw new Error("TODO");
};
