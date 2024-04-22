import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useToken } from "../auth/useToken";
import { useUser } from "../auth/useUser";

export const UserInfoPage = () => {
  const history = useHistory();
  const initialUser = useUser(); // Fetch initial user data
  const [token] = useToken();

  // Define your options for the dropdowns
  const hairColorOptions = ["Brown", "Black", "Blonde", "Red", "Grey", "Other"];
  const favoriteFoodOptions = ["Italian", "Mexican", "Chinese"];
  const majorOptions = ["Computer Science", "Arts", "Business"];
  const sportsOptions = ["Football", "Basketball", "Tennis", "Swimming"];
  const ethnicityOptions = [
    "Caucasian",
    "African American",
    "Asian",
    "Hispanic",
    "Other",
  ];

  // Local component state for user info, allowing updates within this component
  const [userInfo, setUserInfo] = useState({
    favoriteFood: initialUser?.info?.favoriteFood || "",
    hairColor: initialUser?.info?.hairColor || "",
    major: initialUser?.info?.major || "",
    sports: initialUser?.info?.sports || "",
    ethnicity: initialUser?.info?.ethnicity || "",
  });

  const { favoriteFood, hairColor, major, sports, ethnicity } = userInfo;

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      await axios.put(
        `/api/users/${initialUser.id}`,
        {
          ...userInfo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShowSuccessMessage(true);
    } catch (error) {
      setShowErrorMessage(true);
    }
  };

  const findMatch = async () => {
    try {
      // Call to the backend to find a match
      const response = await axios.get(
        `/api/users/${initialUser.id}/find-match`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Handle the response, for example, by setting state or redirecting to the match page
      // Here we will just log the matched users for simplicity
      console.log(response.data);

      // Redirect to the FindMatchPage with the matched users data (for example purposes)
      history.push("/find-match", { matchedUsers: response.data });
    } catch (error) {
      console.error("Error finding match:", error);
      // Handle error, for example by showing a message to the user
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  const resetValues = () => {
    setUserInfo({
      favoriteFood: initialUser?.info?.favoriteFood || "",
      hairColor: initialUser?.info?.hairColor || "",
      major: initialUser?.info?.major || "",
      sports: initialUser?.info?.sports || "",
      ethnicity: initialUser?.info?.ethnicity || "",
    });
  };

  return (
    <div className="content-container">
      <h1>Info for {initialUser?.email}</h1>
      {showSuccessMessage && (
        <div className="success">Successfully saved user data!</div>
      )}
      {showErrorMessage && (
        <div className="fail">
          Uh oh... something went wrong and we couldn't save changes
        </div>
      )}
      <label>
        Favorite Food:
        <select
          name="favoriteFood"
          onChange={handleInputChange}
          value={favoriteFood.toLowerCase()}
        >
          {favoriteFoodOptions.map((food) => (
            <option key={food} value={food.toLowerCase()}>
              {food}
            </option>
          ))}
        </select>
      </label>
      <label>
        Hair Color:
        <select
          name="hairColor"
          onChange={handleInputChange}
          value={hairColor.toLowerCase()}
        >
          {hairColorOptions.map((color) => (
            <option key={color} value={color.toLowerCase()}>
              {color}
            </option>
          ))}
        </select>
      </label>
      <label>
        University Major:
        <select
          name="major"
          onChange={handleInputChange}
          value={major.toLowerCase()}
        >
          {majorOptions.map((major) => (
            <option key={major} value={major.toLowerCase()}>
              {major}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sports:
        <select
          name="sports"
          onChange={handleInputChange}
          value={sports.toLowerCase()}
        >
          {sportsOptions.map((sport) => (
            <option key={sport} value={sport.toLowerCase()}>
              {sport}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ethnicity:
        <select
          name="ethnicity"
          onChange={handleInputChange}
          value={ethnicity.toLowerCase()}
        >
          {ethnicityOptions.map((ethnicity) => (
            <option key={ethnicity} value={ethnicity.toLowerCase()}>
              {ethnicity}
            </option>
          ))}
        </select>
      </label>
      <hr />
      <button onClick={saveChanges}>Save Changes</button>
      <button onClick={resetValues}>Reset Values</button>
      <button onClick={findMatch}>Find Match</button>{" "}
      {/* Added find match button */}
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};
