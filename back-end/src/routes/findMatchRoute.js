import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { getDbConnection } from "../db";

export const findMatchRoute = {
  path: "/api/users/:userId/find-match",
  method: "get",
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    if (!authorization) {
      return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err)
        return res.status(401).json({ message: "Unable to verify token" });

      const { id } = decoded;

      if (id !== userId)
        return res
          .status(403)
          .json({ message: "Not allowed to access this data" });

      const db = getDbConnection("react-auth-db");

      try {
        const user = await db
          .collection("users")
          .findOne({ _id: ObjectID(id) });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Implement your matching algorithm here
        // For example, find users with similar interests or characteristics
        const matches = await db
          .collection("users")
          .find({
            "info.favoriteFood": user.info.favoriteFood,
            "info.hairColor": user.info.hairColor,
            "info.major": user.info.major, // You might want to match based on major as well
            _id: { $ne: ObjectID(id) }, // Exclude the current user from the search
          })
          .toArray();

        // You might want to add additional filtering or sorting logic here
        // For example, you could sort matches based on how closely they match the user's interests

        if (matches.length === 0) {
          return res.status(200).json({ message: "No matches found" });
        }

        // Return some of the matched users' data
        // Do not return sensitive information like password hashes
        const matchedUsersData = matches.map((match) => ({
          email: match.email,
          info: match.info,
        }));

        res.status(200).json(matchedUsersData);
      } catch (error) {
        res.status(500).json({ message: "Error finding match", error });
      }
    });
  },
};
