import User from "../models/User.js";

/* GET ONE USER INFO */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(id);
    res.status(200).json(currentUser);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/user.js/getUser(): ${error.message}`
    );
    res.status(404).json({ message: error.message });
  }
};
/* GET ONE USER'S FRIENDS */
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(id);

    const friends = await Promise.all(
      currentUser.friends.map((id) => User.findById(id))
    );

    res.status(200).json(friends);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/user.js/getUserFriends(): ${error.message}`
    );
    res.status(404).json({ message: error.message });
  }
};
/* ADD/REMOVE USER TO OUR FRIEND LIST */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const currentUser = await User.findById(id);
    const friend = await User.findById(friendId);

    // if one user is already our frined, we don't want to add each over again
    if (currentUser.friends.includes(friendId)) {
      currentUser.friends = currentUser.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter(
        (currentUserId) => currentUserId !== id
      );
    } else {
      // we add each over
      currentUser.friends.push(friendId);
      friend.friends.push(id);
    }

    await currentUser.save();
    await friend.save();

    const friends = await Promise.all(
      currentUser.friends.map((id) => User.findById(id))
    );

    res.status(200).json(friends);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/user.js/addRemoveFriend(): ${error.message}`
    );
    res.status(404).json({ message: error.message });
  }
};
