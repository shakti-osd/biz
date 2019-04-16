const express = require("express");

const StoryController = require("../controllers/stories");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, StoryController.createStory);

router.put("/:id", checkAuth, extractFile, StoryController.updateStory);

router.get("", StoryController.getStories);

router.get("/:id", StoryController.getStory);

router.delete("/:id", checkAuth, StoryController.deleteStory);

module.exports = router;
