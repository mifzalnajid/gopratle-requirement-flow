const Requirement = require("../models/Requirement");

const validCategories = ["planner", "performer", "crew"];

async function createRequirement(req, res, next) {
    try {
        const { event, category, details, contact } = req.body ?? {};

        const validEmail =
            typeof contact?.email === "string" &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);

        const validDates =
            ["single", "range"].includes(event?.dateMode) &&
            !Number.isNaN(Date.parse(event?.startDate)) &&
            !Number.isNaN(Date.parse(event?.endDate)) &&
            new Date(event.endDate) >= new Date(event.startDate);

        if (
            !event?.name?.trim() ||
            !event?.type?.trim() ||
            !event?.location?.trim() ||
            !validDates ||
            !validCategories.includes(category) ||
            !details ||
            !contact?.name?.trim() ||
            !validEmail ||
            !contact?.phone?.trim()
        ) {
            return res.status(400).json({
                error: "Please provide valid event, category, details, and contact information.",
            });
        }

        const roleType =
            details.roleType || details.performanceType || details.crewType;

        if (typeof roleType !== "string" || !roleType.trim()) {
            return res.status(400).json({
                error: "A category-specific role or service type is required.",
            });
        }

        const requirement = await Requirement.create({
            event,
            category,
            details,
            contact,
        });

        return res.status(201).json({
            message: "Requirement created",
            requirement,
        });
    } catch (error) {
        next(error);
    }
}

async function getRequirement(req, res, next) {
    try {
        const requirement = await Requirement.findById(req.params.id);

        if (!requirement) {
            return res.status(404).json({ error: "Requirement not found." });
        }

        return res.json({ requirement });
    } catch (error) {
        next(error);
    }
}

module.exports = { createRequirement, getRequirement };