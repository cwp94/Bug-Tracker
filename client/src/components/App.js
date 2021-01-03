import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	GENERAL_CONTAINER,
	ACCOUNT_CONTAINER,
} from "../actions/constants/containerNames";

import {
	retrieveEverythingForAccount,
	setWhichGeneralComponentsDisplay,
} from "../actions";

import Register from "./authentication/Register";
import Login from "./authentication/Login";
import Home from "./home/Home";

// Allows font awesome icons
import "font-awesome/css/font-awesome.min.css";
import "../SCSS/app.scss";

function App() {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	// When app is in development enviornment, creates way to access redux state
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			window.addEventListener("keydown", (e) => logReduxState(e));

			return () => {
				window.removeEventListener("resize", (e) => logReduxState(e));
			};
		}
		// eslint-disable-next-line
	}, []);

	// Declared outside of the eventListener so removing will working on cleanup
	function logReduxState(e) {
		if (e.keyCode === 192) {
			console.log(reduxState);
		}
	}

	// Re-fetches user data after a page refresh,
	// ... and makes sure the appropriate components are displayed
	useEffect(() => {
		if (reduxState[ACCOUNT_CONTAINER].auth.isAuthenticated) {
			// This also serves to logout a user if their jwToken has expired
			// ...since the server will catch the expired token and throw an
			// ...error to which the frontend will log the user out
			dispatch(retrieveEverythingForAccount());
		} else {
			// Makes sure unauthenticated users do not see home page
			if (reduxState[GENERAL_CONTAINER].componentsDisplay.home) {
				dispatch(setWhichGeneralComponentsDisplay({ login: true }));
			}
		}
		// eslint-disable-next-line
	}, []);

	// Makes sure at least on Auth Component always displays
	// ...Since login is set to display by default, this useEffect
	// ...only needs to run when authComponentsDisplay changes
	useEffect(() => {
		if (
			!reduxState[GENERAL_CONTAINER].componentsDisplay.register &&
			!reduxState[GENERAL_CONTAINER].componentsDisplay.login &&
			!reduxState[GENERAL_CONTAINER].componentsDisplay.home
		) {
			dispatch(setWhichGeneralComponentsDisplay({ login: true }));
		}
		// eslint-disable-next-line
	}, [reduxState[GENERAL_CONTAINER].componentsDisplay]);

	return (
		<div className="pageContainer">
			{reduxState[GENERAL_CONTAINER].componentsDisplay.register ? (
				<Register />
			) : null}
			{reduxState[GENERAL_CONTAINER].componentsDisplay.login ? <Login /> : null}
			{reduxState[GENERAL_CONTAINER].componentsDisplay.home ? <Home /> : null}
		</div>
	);
}

export default App;
