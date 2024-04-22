import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { getDbConnection } from "../db";

export const findMatchRoute = {
  path: "/api/users/:userId/find-match",
  method: "get",
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    // Check if the authorization header is present
    if (!authorization) {
      return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = authorization.split(" ")[1];

    // Verify the token to ensure that the request is authenticated
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unable to verify token" });
      }

      const { id } = decoded;

      // Check if the userId from the token matches the userId in the request parameters
      if (id !== userId) {
        return res
          .status(403)
          .json({ message: "Not allowed to access this data" });
      }

      // Connect to the database
      const db = getDbConnection("react-auth-db");

      try {
        // Find the current user by ID
        const user = await db
          .collection("users")
          .findOne({ _id: ObjectID(id) });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Implement the matching algorithm here
        // Example: find users with the same favorite food, hair color, and major
        const matches = await db
          .collection("users")
          .find({
            "info.favoriteFood": user.info.favoriteFood,
            "info.hairColor": user.info.hairColor,
            "info.major": user.info.major,
            _id: { $ne: ObjectID(id) }, // Exclude the current user
          })
          .toArray();

        // Additional filtering or sorting logic can be added here

        // Handle the case where no matches are found
        if (matches.length === 0) {
          return res.status(200).json({ message: "No matches found" });
        }

        // Map the matches to remove sensitive data before returning them
        const matchedUsersData = matches.map((match) => ({
          email: match.email,
          info: match.info,
          // Add any additional user info you wish to return
        }));

        // Return the matched users' data
        res.status(200).json(matchedUsersData);
      } catch (error) {
        // Handle any errors that occur during the matching process
        res.status(500).json({ message: "Error finding match", error });
      }
    });
  },
};
