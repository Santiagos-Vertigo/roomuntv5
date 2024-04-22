import { logInRoute } from "./logInRoute";
import { signUpRoute } from "./signUpRoute";
import { testRoute } from "./testRoute";
import { updateUserInfoRoute } from "./updateUserInfoRoute";
import { findMatchRoute } from "./findMatchRoute"; // Make sure this import matches the actual file name and path

export const routes = [
  logInRoute,
  signUpRoute,
  testRoute,
  updateUserInfoRoute,
  findMatchRoute, // Include the findMatchRoute in the array of routes
];

// Here, you would use these routes in your Express app or similar server setup.
// An example setup for Express would look something like this:

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Loop through all the routes and apply them to the express app
routes.forEach((route) => {
  app[route.method](route.path, route.handler);
});

// Your server setup may vary, this is just a basic example
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Note: Ensure that your MongoDB connection is established before starting the server.
