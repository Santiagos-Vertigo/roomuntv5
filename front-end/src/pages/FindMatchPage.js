import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useToken } from "../auth/useToken";
// ... any other necessary imports

export const FindMatchPage = () => {
  const history = useHistory();
  const [token] = useToken();

  // Assuming a matchedUser object is returned from the backend with the following structure:
  const [matchedUser, setMatchedUser] = useState({
    email: "", // Placeholder for matched user's email
    info: {
      favoriteFood: "",
      hairColor: "",
      major: "",
      // ... any other info you want to show for the matched user
    },
  });

  // Placeholder for the function to get a new match
  const getNewMatch = async () => {
    // This would make an API call to your backend to get a new match
    // and update the matchedUser state with the new data.
    console.log("Refresh for a new match");
  };

  // Placeholder for the function to send a message to the matched user
  const sendMessage = () => {
    // This would handle sending a message to the matched user
    console.log("Message the matched user");
  };

  // Function to go back to the user info page
  const goBack = () => {
    history.push("/"); // Assuming the UserInfoPage is the home page
  };

  return (
    <div className="content-container">
      <h1>Matched with {matchedUser.email}</h1>
      <div className="user-info">
        <p>Favorite Food: {matchedUser.info.favoriteFood}</p>
        <p>Hair Color: {matchedUser.info.hairColor}</p>
        <p>University Major: {matchedUser.info.major}</p>
        {/* Add any other info you wish to display */}
      </div>
      <hr />
      <button onClick={sendMessage}>Message</button>
      <button onClick={getNewMatch}>Refresh</button>
      <button onClick={goBack}>Back</button>
    </div>
  );
};
