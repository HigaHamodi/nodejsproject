const bcrypt = require("bcrypt");
const initialData = require("../data/initialData.json");
const { User } = require("../models/user");
const { Card } = require("../models/cards");

async function createInitialData() {
  try {
    const usersExist = await User.countDocuments();
    const cardsExist = await Card.countDocuments();

    if (!usersExist && !cardsExist) {
      // Hash passwords for initial users
      let hashedUsers;
      try {
        hashedUsers = await Promise.all(
          initialData.initialUserData.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
          })
        );
      } catch (hashError) {
        console.error("Error hashing user passwords:", hashError);
        return; // Exit function if an error occurs
      }

      // Insert hashed users into User collection
      let insertedUsers = await User.insertMany(hashedUsers);
      console.log("Users Initial Data Inserted!");

      // Filter out business user IDs
      let businessUserIds = insertedUsers
        .filter((user) => user.IsBusiness)
        .map((user) => user._id);

      // Generate initial card data with random user IDs
      let insertedCards = initialData.initialCardData.map((card) => {
        return {
          ...card,
          user_id:
            businessUserIds[Math.floor(Math.random() * businessUserIds.length)],
        };
      });

      // Insert initial card data into Card collection
      await Card.insertMany(insertedCards);
      console.log("Cards Initial Data Inserted!");
    }
  } catch (error) {
    console.error(("Initial Data Error:", error));
  }
}

module.exports = createInitialData;
