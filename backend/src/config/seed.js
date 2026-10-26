import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Debate from "../models/Debate.js";
import Stance from "../models/Stance.js";
import Response from "../models/Response.js";

/**
 * Initializes database with default seed content if the database is unpopulated.
 * Ensures initial admin, demo user, current debate, and archived debates exist.
 */
export const seedDatabase = async () => {
  try {
    const debateCount = await Debate.countDocuments();
    if (debateCount > 0) {
      return; // Database already contains content
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Create or find default demo user
    let demoUser = await User.findOne({ username: "user" });
    if (!demoUser) {
      demoUser = await User.create({
        fullName: "Elena Vane",
        username: "user",
        email: "elena@sayso.org",
        password: hashedPassword,
        role: "user",
        bio: "Civic debates and urban infrastructure enthusiast.",
      });
    }

    // Additional commentator profiles for varied discussion
    const extraUsers = [
      { fullName: "Marcus Kane", username: "marcus_k", email: "marcus@sayso.org" },
      { fullName: "Clara Vance", username: "clara_transit", email: "clara@sayso.org" },
      { fullName: "Dave Miller", username: "dave_mercantile", email: "dave@sayso.org" },
      { fullName: "Rachel Sterling", username: "rachel_econ", email: "rachel@sayso.org" },
      { fullName: "Tarun Patel", username: "tarun_p", email: "tarun@sayso.org" },
    ];

    const createdUsers = [demoUser];
    for (const u of extraUsers) {
      let created = await User.findOne({ username: u.username });
      if (!created) {
        created = await User.create({
          fullName: u.fullName,
          username: u.username,
          email: u.email,
          password: hashedPassword,
          role: "user",
        });
      }
      createdUsers.push(created);
    }

    // 1. Current debate topic
    const currentDebate = await Debate.create({
      title: "Should cities ban personal motor vehicles from their central districts?",
      description:
        "Urban congestion, air pollution, and pedestrian safety have driven multiple metropolitan areas to pilot vehicle-free zones. Proponents highlight cleaner air, revitalized street life, and faster public transit. Critics warn of economic friction for small retail businesses, accessibility challenges for elderly or disabled residents, and displacement of traffic to outer residential borders.",
      category: "Society & Culture",
      status: "current",
      postedAt: new Date(Date.now() - 24 * 3600 * 1000),
    });

    // 2. Archived debate topics
    await Debate.insertMany([
      {
        title: "Should governments mandate AI transparency and watermarking for all public models?",
        description:
          "As generative AI becomes ubiquitous in media and administration, transparency legislation has been proposed to require visible provenance and training watermarks. Advocates argue this safeguards democratic discourse against synthetic disinformation. Detractors claim watermarks can be trivially stripped and heavy compliance slows down open-source innovation.",
        category: "Technology & AI",
        status: "archived",
        postedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
      },
      {
        title: "Should higher education institutions eliminate standardized testing in admissions?",
        description:
          "Decades of standardized test usage in university admissions face growing scrutiny regarding demographic parity and predictive validity. Supporters of test-optional models emphasize holistic candidate review, whereas defenders maintain that standardized metrics remain the only objective safeguard against high school grade inflation.",
        category: "Education",
        status: "archived",
        postedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000),
      },
      {
        title: "Is carbon pricing the most effective policy tool to combat climate change?",
        description:
          "Economists widely promote carbon taxes and cap-and-trade systems to internalize environmental externalities. Opponents argue that carbon taxation creates regressive cost burdens on low-income households and that direct green infrastructure subsidies yield faster technological transitions.",
        category: "Environment",
        status: "archived",
        postedAt: new Date(Date.now() - 22 * 24 * 3600 * 1000),
      },
      {
        title: "Should remote workers be subject to localized salary adjustments?",
        description:
          "Global distributed teams have sparked intense debate over whether compensation should reflect the employee's local cost of living or solely the market value of their output regardless of geographical location.",
        category: "Economy & Business",
        status: "archived",
        postedAt: new Date(Date.now() - 29 * 24 * 3600 * 1000),
      },
    ]);

    // 3. Seed responses for current debate
    const sampleResponses = [
      {
        user: createdUsers[1],
        stance: "for",
        text: "Pontevedra in Spain pedestrianized its center in 1999: pedestrian fatalities dropped to zero, local commercial revenues increased by 30%, and CO2 emissions plummeted. Central districts are meant for human civic exchange, not two-ton private metal boxes.",
      },
      {
        user: createdUsers[2],
        stance: "for",
        text: "Public buses and emergency vehicles move exponentially faster when personal cars are removed. Dedicated transit rights-of-way make cities equitable for non-drivers who comprise the majority of urban commuters.",
      },
      {
        user: createdUsers[3],
        stance: "against",
        text: "A blanket ban punishes independent artisans, elderly residents with reduced mobility, and parents transporting young children. Outer ring roads inevitably bear the brunt with horrific bottleneck congestion.",
      },
      {
        user: createdUsers[4],
        stance: "against",
        text: "Without first building massive park-and-ride facilities on suburban peripheries, a sudden car ban damages core retail vitality and pushes shoppers to suburban big-box malls.",
      },
      {
        user: createdUsers[5],
        stance: "neutral",
        text: "The viable path is not an ideological total ban, but congestion pricing paired with targeted commercial delivery windows and electric shuttle networks for disabled citizens.",
      },
    ];

    for (const r of sampleResponses) {
      await Stance.create({
        debate: currentDebate._id,
        user: r.user._id,
        stance: r.stance,
      });

      await Response.create({
        debate: currentDebate._id,
        user: r.user._id,
        username: r.user.username,
        stance: r.stance,
        text: r.text,
      });
    }
  } catch (error) {
    // Non-fatal if seeding encounters duplicate keys
  }
};
