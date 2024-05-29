const { Card } = require("../models/cards.js");

exports.createBizNumber = async () => {
  try {
    const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const card = await Card.findOne(
      { bizNumber: random },
      { bizNumber: 1, _id: 0 }
    );

    if (card) {
      // If a card with the generated business number already exists, retry with a new random number
      return createBizNumber();
    }

    return random;
  } catch (error) {
    // If an error occurs during database operation, throw the error to be caught and handled by the caller
    throw new Error("Failed to generate a unique business number");
  }
};

exports.isBizNumberExists = async (bizNumber) => {
  if (
    typeof bizNumber !== "number" ||
    isNaN(bizNumber) ||
    bizNumber < 1000 ||
    bizNumber > 9999
  ) {
    throw new Error("bizNumber must be a 4-digit number between 1000 and 9999");
  }

  try {
    const card = await Card.findOne({ bizNumber }, { bizNumber: 1, _id: 0 });
    return card;
  } catch (error) {
    // If an error occurs during database operation, throw the error to be caught and handled by the caller
    throw new Error("Failed to check if the business number exists");
  }
};
