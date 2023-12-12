const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

/**
 * @description Get All contacts
 * @routes GET api/contacts
 * @access private
 */
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

/**
 * @description Create contact
 * @routes POST api/contacts
 * @access private
 */
const createContacts = asyncHandler(async (req, res) => {
  console.log("createContacts req", req.body);
  const { name, email, phoneNo } = req.body;
  if (!name || !email || !phoneNo) {
    res.status(400);
    throw Error("Name, email and phoneNo is mandetory");
  }
  const contact = await Contact.create({
    user_id: req.user.id,
    name,
    email,
    phoneNo,
  });
  res.status(200).json(contact);
});

/**
 * @description Create contact
 * @routes GET api/contacts/:id
 * @access private
 */
const getSingleContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req?.params?.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

/**
 * @description Update contact
 * @routes PUT api/contacts/:id
 * @access private
 */
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req?.params?.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id?.toString() === req?.user?.id?.toString()) {
    res.status(403);
    throw new Error("you don't have access to update this contact.");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req?.params?.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

/**
 * @description Update contact partially
 * @routes PATCH api/contacts/:id
 * @access private
 */
const updateContactPartially = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req?.params?.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id?.toString() === req?.user?.id?.toString()) {
    res.status(403);
    throw new Error("you don't have access to update this contact.");
  }

  const updatedContactInfo = {
    name: req?.body?.name ?? contact.name,
    email: req?.body?.email ?? contact.email,
    phoneNo: req?.body?.phoneNo ?? contact.phoneNo,
  };
  const updatedContact = await Contact.findByIdAndUpdate(
    req?.params?.id,
    updatedContactInfo,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

/**
 * @description Delete contact
 * @routes DELETE api/contacts/:id
 * @access private
 */
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req?.params?.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id?.toString() === req?.user?.id?.toString()) {
    res.status(403);
    throw new Error("you don't have access to delete this contact.");
  }

  await contact.deleteOne();
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContacts,
  getSingleContact,
  updateContact,
  updateContactPartially,
  deleteContact,
};
