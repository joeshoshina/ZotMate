import { Router } from "express";
import { anteaterGet } from "../lib/anteaterClient.js";

export const programsRouter = Router();

programsRouter.get("/programs/majors", async (req, res, next) => {
  try {
    const params = new URLSearchParams();
    const rawId = req.query.id;
    if (rawId !== undefined && rawId !== "") {
      const value = Array.isArray(rawId) ? rawId[0] : rawId;
      params.set("id", String(value));
    }
    const qs = params.toString();
    const path = qs ? `/programs/majors?${qs}` : "/programs/majors";
    const { status, body } = await anteaterGet(path);
    res.status(status).json(body);
  } catch (err) {
    next(err);
  }
});
