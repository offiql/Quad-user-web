export const getAccessToken = () => {
  try {
    // Retrieve the Redux state from localStorage
    const persistedState = localStorage.getItem("persist:root"); // Replace 'root' with the correct key if different
    if (!persistedState) return null;

    // Parse the state
    const parsedState = JSON.parse(persistedState);

    // Extract the auth state and parse it
    const authState = parsedState.auth ? JSON.parse(parsedState.auth) : null;

    // Return the access_token if it exists
    return authState?.access_token || null;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

export const getRefreshToken = () => {
  try {
    // Retrieve the Redux state from localStorage
    const persistedState = localStorage.getItem("persist:root"); // Replace 'root' with the correct key if different
    if (!persistedState) return null;

    // Parse the state
    const parsedState = JSON.parse(persistedState);

    // Extract the auth state and parse it
    const authState = parsedState.auth ? JSON.parse(parsedState.auth) : null;

    // Return the access_token if it exists
    return authState?.refresh_token || null;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

export const getUserData = () => {
  try {
    // Retrieve the Redux state from localStorage
    const persistedState = localStorage.getItem("persist:root"); // Replace 'root' with the correct key if different
    if (!persistedState) return null;

    // Parse the state
    const parsedState = JSON.parse(persistedState);

    // Extract the auth state and parse it
    const authState = parsedState.auth ? JSON.parse(parsedState.auth) : null;

    // Return the access_token if it exists
    return authState?.userData || null;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};
export const getpatientData = () => {
  try {
    // Retrieve the Redux state from localStorage
    const persistedState = localStorage.getItem("persist:root"); // Replace 'root' with the correct key if different
    if (!persistedState) return null;

    // Parse the state
    const parsedState = JSON.parse(persistedState);

    // Extract the auth state and parse it
    const authState = parsedState.auth ? JSON.parse(parsedState.auth) : null;

    // Return the access_token if it exists
    return authState?.patient || null;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};
export const updateUserData = (updatedUserData:any) => {
  try {
    const persistedState = localStorage.getItem("persist:root");
    if (!persistedState) return;

    const parsedState = JSON.parse(persistedState);

    if (parsedState.auth) {
      const authState = JSON.parse(parsedState.auth);
      authState.userData = updatedUserData;
      parsedState.auth = JSON.stringify(authState);
      localStorage.setItem("persist:root", JSON.stringify(parsedState));
    }
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};
