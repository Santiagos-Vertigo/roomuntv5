import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';

export const UserInfoPage = () => {
    const history = useHistory();
    const initialUser = useUser(); // Fetch initial user data
    const [token] = useToken();

    // Define your options for the dropdowns
    const hairColorOptions = ['Brown', 'Black', 'Blonde', 'Red', 'Grey', 'Other'];
    const favoriteFoodOptions = ['Italian', 'Mexican', 'Chinese'];
    const majorOptions = ['Computer Science', 'Arts', 'Business'];

    // Local component state for user info, allowing updates within this component
    const [userInfo, setUserInfo] = useState({
        favoriteFood: initialUser?.info?.favoriteFood || '',
        hairColor: initialUser?.info?.hairColor || '',
        major: initialUser?.info?.major || '', // Assuming we have 'major' in the user info
    });

    const { favoriteFood, hairColor, major } = userInfo;

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
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const saveChanges = async () => {
        try {
            await axios.put(`/api/users/${initialUser.id}`, {
                ...userInfo
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Assume the server updates the user info correctly; reflect this in local state
            setShowSuccessMessage(true);
        } catch (error) {
            setShowErrorMessage(true);
        }
    };

    // Placeholder for the find match functionality
    const findMatch = () => {
        // This function will be implemented later
        console.log('Find match button clicked');
    };

    const logOut = () => {
        localStorage.removeItem('token');
        history.push('/login');
    };

    const resetValues = () => {
        setUserInfo({
            favoriteFood: initialUser?.info?.favoriteFood || '',
            hairColor: initialUser?.info?.hairColor || '',
            major: initialUser?.info?.major || '', // Resetting the major as well
        });
    };

    return (
        <div className="content-container">
            <h1>Info for {initialUser?.email}</h1>
            {showSuccessMessage && <div className="success">Successfully saved user data!</div>}
            {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
            <label>
                Favorite Food:
                <select
                    name="favoriteFood"
                    onChange={handleInputChange}
                    value={favoriteFood.toLowerCase()}
                >
                    {favoriteFoodOptions.map(food => (
                        <option key={food} value={food.toLowerCase()}>{food}</option>
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
                    {hairColorOptions.map(color => (
                        <option key={color} value={color.toLowerCase()}>{color}</option>
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
                    {majorOptions.map(major => (
                        <option key={major} value={major.toLowerCase()}>{major}</option>
                    ))}
                </select>
            </label>
            <hr />
            <button onClick={saveChanges}>Save Changes</button>
            <button onClick={resetValues}>Reset Values</button>
            <button onClick={findMatch}>Find Match</button> {/* Added find match button */}
            <button onClick={logOut}>Log Out</button>
        </div>
    );
};