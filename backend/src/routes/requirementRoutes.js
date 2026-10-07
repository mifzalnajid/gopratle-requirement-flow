const express = require("express");
const {
    createRequirement,
    getRequirement,
} = require("../controllers/requirementController");

const router = express.Router();

router.post("/", createRequirement);
router.get("/:id", getRequirement);

module.exports = router;