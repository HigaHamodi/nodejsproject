const { userJwt } = require("../config/jwtConfig.js");
const { Card } = require("../models/cards.js");
const { cardValidator } = require("../middleware/validationMiddleware.js");
const {
  createBizNumber,
  isBizNumberExists,
} = require("../helpers/createBizNumber.js");

// Get all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get business user's cards
exports.getBusinessUserCard = async (req, res) => {
  try {
    const { userId } = userJwt(req, res);
    const cards = await Card.find({ user_id: userId });
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single card data
exports.getSingleCardData = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id });
    if (!card) {
      return res.status(404).json({ message: "Card Not Found" });
    }
    return res.status(200).json(card);
  } catch (error) {
    return res.status(404).json({ message: "Card Not Found" });
  }
};

// Create a card
exports.createCard = async (req, res) => {
  try {
    const userData = userJwt(req, res);
    if (!userData) return; // Exit early if user is not authorized

    const cardData = req.body;
    cardData.user_id = userData.userId;
    cardData.bizNumber = await createBizNumber();

    const validate = cardValidator.validate(cardData, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (validate.error) {
      const error = validate.error.details[0].message;
      return res.status(400).json({ message: error });
    }

    const card = new Card(cardData);
    const savedCard = await card.save();
    return res
      .status(201)
      .json({ message: "Card successfully created.", card: savedCard });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit card data
exports.EditCardData = async (req, res) => {
  try {
    const { userId } = userJwt(req, res);
    const { id } = req.params;
    const updateData = req.body;
    const validate = cardValidator.validate(updateData, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (validate.error) {
      const error = validate.error.details[0].message;
      return res.status(400).json({ message: error });
    }

    const card = await Card.findOne({ _id: id, user_id: userId });
    if (!card) {
      return res.status(404).json({ message: "Card Not Found" });
    }

    const updatedCard = await Card.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Card Data Updated Successfully", card: updatedCard });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Like or unlike a card
exports.likeCard = async (req, res) => {
  try {
    const { userId } = userJwt(req, res);
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card Not Found" });
    }
    const index = card.likes.indexOf(userId);
    const message =
      index === -1 ? "Card Liked Successfully" : "Card Unliked Successfully";

    if (index === -1) {
      card.likes.push(userId);
    } else {
      card.likes.splice(index, 1);
    }

    await card.save();
    return res.status(201).json({ message, likes: card.likes });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a card
exports.deleteCard = async (req, res) => {
  try {
    const { userId, isAdmin } = userJwt(req, res);
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card || (card.user_id != userId && !isAdmin)) {
      return res.status(404).json({ message: "Cannot Delete This Card" });
    }
    await Card.findByIdAndDelete(id);
    return res.status(200).json({ message: "Card Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update bizNumber
exports.updateBizNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { bizNumber } = req.body;
    const parsedBizNumber = parseInt(bizNumber, 10);

    if (isNaN(parsedBizNumber)) {
      return res
        .status(400)
        .json({ message: "BizNumber Must Be a Valid Number" });
    }

    const exists = await isBizNumberExists(parsedBizNumber);
    if (exists) {
      return res.status(406).json({ message: "bizNumber already exists" });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { bizNumber: parsedBizNumber },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).json({ message: "Card Not Found" });
    }

    return res
      .status(200)
      .json({ message: "bizNumber Successfully Updated", card: updatedCard });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
