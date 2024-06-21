const express = require("express");
const {
  authUser,
  businessOnly,
  sameIdOrAdmin,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  createCard,
  getAllCards,
  getBusinessUserCard,
  getSingleCardData,
  EditCardData,
  likeCard,
  deleteCard,
  updateBizNumber,
} = require("../controllers/cardController");

const cardRouter = express.Router();

cardRouter.get("/cards", getAllCards);
cardRouter.get("/cards/my-cards", authUser, businessOnly, getBusinessUserCard);
cardRouter.get("/cards/:id", getSingleCardData);
cardRouter.post("/cards", authUser, businessOnly, createCard);
cardRouter.put("/cards/:id", authUser, sameIdOrAdmin, EditCardData);
cardRouter.patch("/cards/:id", authUser, likeCard);
cardRouter.delete("/cards/:id", authUser, sameIdOrAdmin, deleteCard);
cardRouter.patch("/cards/biz-number/:id", authUser, adminOnly, updateBizNumber);

module.exports = cardRouter;
