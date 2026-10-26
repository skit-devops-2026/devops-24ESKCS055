import Debate from "../models/Debate.js";
import Response from "../models/Response.js";

/**
 * Retrieves all debates sorted with current topic first, followed by archived topics in reverse chronological order.
 * Fetches all responses in a single batched query to avoid N+1 database operations.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllDebates = async (req, res) => {
  try {
    const debates = await Debate.find().sort({ createdAt: -1 }).lean();

    // Fetch all responses in one batched query to avoid N+1 queries
    const debateIds = debates.map((d) => d._id);
    const allResponses = await Response.find({ debate: { $in: debateIds } })
      .sort({ createdAt: -1 })
      .lean();

    // Group responses in-memory by debate ID
    const responsesByDebate = new Map();
    for (const resp of allResponses) {
      const key = resp.debate.toString();
      if (!responsesByDebate.has(key)) {
        responsesByDebate.set(key, []);
      }
      responsesByDebate.get(key).push({
        id: resp._id.toString(),
        _id: resp._id.toString(),
        debateId: key,
        userId: resp.user.toString(),
        username: resp.username,
        stance: resp.stance,
        text: resp.text,
        createdAt: resp.createdAt,
        updatedAt: resp.updatedAt,
      });
    }

    const formatted = debates.map((deb) => {
      const key = deb._id.toString();
      const responses = responsesByDebate.get(key) || [];
      const forCount = responses.filter((r) => r.stance === "for").length;
      const againstCount = responses.filter((r) => r.stance === "against").length;
      const neutralCount = responses.filter((r) => r.stance === "neutral").length;

      return {
        id: key,
        _id: key,
        title: deb.title,
        description: deb.description,
        category: deb.category,
        status: deb.status,
        postedAt: deb.postedAt || deb.createdAt,
        createdAt: deb.createdAt,
        updatedAt: deb.updatedAt,
        responses,
        counts: {
          for: forCount,
          against: againstCount,
          neutral: neutralCount,
          total: responses.length,
        },
      };
    });

    // Ensure status: "current" appears at top
    formatted.sort((a, b) => {
      if (a.status === "current" && b.status !== "current") return -1;
      if (b.status === "current" && a.status !== "current") return 1;
      return new Date(b.postedAt) - new Date(a.postedAt);
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve debates" });
  }
};

/**
 * Retrieves the singular active debate topic.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getCurrentDebate = async (req, res) => {
  try {
    const debate = await Debate.findOne({ status: "current" }).lean();
    if (!debate) return res.json(null);

    const responses = await Response.find({ debate: debate._id }).lean();
    const formattedResponses = responses.map((r) => ({
      id: r._id.toString(),
      _id: r._id.toString(),
      debateId: debate._id.toString(),
      userId: r.user.toString(),
      username: r.username,
      stance: r.stance,
      text: r.text,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.json({
      id: debate._id.toString(),
      _id: debate._id.toString(),
      title: debate.title,
      description: debate.description,
      category: debate.category,
      status: debate.status,
      postedAt: debate.postedAt || debate.createdAt,
      createdAt: debate.createdAt,
      responses: formattedResponses,
      counts: {
        for: formattedResponses.filter((r) => r.stance === "for").length,
        against: formattedResponses.filter((r) => r.stance === "against").length,
        neutral: formattedResponses.filter((r) => r.stance === "neutral").length,
        total: formattedResponses.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch current debate" });
  }
};

/**
 * Publishes a new debate, automatically archiving existing current debates.
 * Requires administrator authentication.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createDebate = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const cleanTitle = title?.trim();
    const cleanDesc = description?.trim();
    const cleanCat = category?.trim() || "Society & Culture";

    if (!cleanTitle) {
      return res.status(400).json({ message: "Debate title is required" });
    }
    if (!cleanDesc) {
      return res.status(400).json({ message: "Debate description is required" });
    }

    // Archive all current debates
    await Debate.updateMany({ status: "current" }, { status: "archived" });

    const newDebate = await Debate.create({
      title: cleanTitle,
      description: cleanDesc,
      category: cleanCat,
      status: "current",
      postedAt: new Date(),
    });

    const key = newDebate._id.toString();
    res.status(201).json({
      id: key,
      _id: key,
      title: newDebate.title,
      description: newDebate.description,
      category: newDebate.category,
      status: newDebate.status,
      postedAt: newDebate.postedAt,
      createdAt: newDebate.createdAt,
      responses: [],
      counts: { for: 0, against: 0, neutral: 0, total: 0 },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to publish new debate" });
  }
};
