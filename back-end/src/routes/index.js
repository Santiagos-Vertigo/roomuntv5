import { logInRoute } from './logInRoute';
import { signUpRoute } from './signUpRoute';
import { testRoute } from './testRoute';
import { updateUserInfoRoute } from './updateUserInfoRoute';
import { findMatchRoute } from './findMatchRoute'; // Import the findMatchRoute

export const routes = [
    logInRoute,
    signUpRoute,
    testRoute,
    updateUserInfoRoute,
    findMatchRoute, // Add the findMatchRoute to the routes array
];
