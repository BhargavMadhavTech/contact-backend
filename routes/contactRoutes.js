const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getContacts,
  createContacts,
  getSingleContact,
  updateContact,
  updateContactPartially,
  deleteContact,
} = require("../controllers/contactController");
const router = express.Router();

router.use(validateToken);
router.route("/").get(getContacts).post(createContacts);
router
  .route("/:id")
  .get(getSingleContact)
  .put(updateContact)
  .patch(updateContactPartially)
  .delete(deleteContact);

module.exports = router;
