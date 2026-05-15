import { Router } from "express";
import { anteaterGet } from "../lib/anteaterClient.js";

const ALLOWED_KEYS = new Set([
  "department",
  "courseNumber",
  "courseNumeric",
  "titleContains",
  "courseLevel",
  "minUnits",
  "maxUnits",
  "descriptionContains",
  "geCategory",
  "take",
  "skip",
]);

export const coursesRouter = Router();

coursesRouter.get("/courses/:id", async (req, res, next) => {
  try {
    const raw = req.params.id;
    if (!raw || raw.includes("..") || raw.includes("/")) {
      res.status(400).json({ ok: false, message: "Invalid course id" });
      return;
    }
    const path = `/courses/${encodeURIComponent(raw)}`;
    const { status, body } = await anteaterGet(path);
    res.status(status).json(body);
  } catch (err) {
    next(err);
  }
});

coursesRouter.get("/courses", async (req, res, next) => {
  try {
    const params = new URLSearchParams();
    for (const [key, raw] of Object.entries(req.query)) {
      if (!ALLOWED_KEYS.has(key) || raw === undefined) continue;
      const value = Array.isArray(raw) ? raw[0] : raw;
      if (value === "" || value == null) continue;
      params.set(key, String(value));
    }

    const qs = params.toString();
    const path = qs ? `/courses?${qs}` : "/courses";
    const { status, body } = await anteaterGet(path);
    res.status(status).json(body);
  } catch (err) {
    next(err);
  }
});
