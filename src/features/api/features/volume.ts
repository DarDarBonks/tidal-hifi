import { BrowserWindow } from "electron";
import { Router } from "express";
import { mediaInfo } from "../../../scripts/mediaInfo";
import { Logger } from "../../../features/logger";
import { globalEvents } from "../../../constants/globalEvents";
import { handleWindowEventWithValue } from "../helpers/handleWindowEvent";

export const addVolumeControl = (expressApp: Router, mainWindow: BrowserWindow) => {
  const windowEvent = handleWindowEventWithValue(mainWindow);

  /**
   * @swagger
   * /volume:
   *   get:
   *     summary: Get current volume level
   *     tags: [player]
   *     responses:
   *       200:
   *         description: Current volume level (0-100)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 volume:
   *                   type: integer
   *                   minimum: 0
   *                   maximum: 100
   */
  expressApp.get("/volume", (_req, res) => {
    Logger.log("volume initialized");
    res.json({ volume: mediaInfo.volume || 0 });
  });

  /**
   * @swagger
   * /volume:
   *   post:
   *     summary: Set volume level
   *     tags: [player]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               volume:
   *                 type: integer
   *                 minimum: 0
   *                 maximum: 100
   *     responses:
   *       200:
   *         description: Volume set successfully
   *       400:
   *         description: Invalid volume level
   */
  expressApp.post("/volume", (req, res) => {
    const { volume } = req.body;

    if (typeof volume !== "number" || volume < 0 || volume > 100) {
      res.sendStatus(400).json({ error: "Volume must be a number between 0 and 100" });
    }

    windowEvent(res, globalEvents.setVolume, volume);
  });
};
