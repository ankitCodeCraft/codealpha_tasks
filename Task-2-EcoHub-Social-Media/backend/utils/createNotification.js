const Notification = require("../models/Notification");

const createNotification = async (receiver, sender, type, post = null) => {
  // Don't notify yourself
  if (receiver.toString() === sender.toString()) {
    return;
  }

  await Notification.create({
    receiver,
    sender,
    type,
    post,
  });
};

module.exports = createNotification;
