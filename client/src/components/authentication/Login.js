import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// Component uses container names to work with the redux state
import { GENERAL_CONTAINER } from "../../actions/constants/containerNames";
import {
	loginAccount,
	clearBackendErrors,
	setWhichGeneralComponentsDisplay,
} from "../../actions";

/**
 * React functional component used for logging into the app. Component 
 * displays a form that prompts the user for an email and password to an 
 * account. Invalid login info and/or server issues will display error 
 * messages to explain what went wrong. Component also displays a background
 * image, as well as a link to switch to the Register funcitonal component.
 * 
 * Component should be used inside an element with the app-component className.
 * This is a stand alone component, meaning it was not intended to be 
 * active/visible while a sibling component/element is also active/visible.
 * 
 * @component
 */
export default function Login() {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	const [accountInfo, setAccountInfo] = useState({
		email: "",
		password: "",
	});

	// Clears current backend errors when closing the component. Otherwise the
	// ...backend errors may presist and appear when component is re-openned.
	useEffect(() => {
		return () => {
			dispatch(clearBackendErrors());
		};
		// eslint-disable-next-line
	}, []);

	const onChange = (e) => {
		setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(loginAccount(accountInfo));
	};

	const openRegister = () => {
		dispatch(setWhichGeneralComponentsDisplay({ register: true }));
	};

	return (
		<div className="register-login-components">
			{/*Same background image as Register component*/}
			<div className="background" />
			<div className="border-container">
				<h1 className="title">Login</h1>
				<form className="form" noValidate onSubmit={handleSubmit}>
					<label htmlFor="login-email" className="form__label">
						Email
					</label>
					<input
						autoFocus
						type="email"
						name="email"
						onChange={(e) => onChange(e)}
						value={accountInfo.email}
						id="login-email"
						className="form__input-text"
					/>
					<span className="backend-errors">
						{reduxState[GENERAL_CONTAINER].backendErrors.validationAccountEmail}
					</span>
					<label htmlFor="login-password" className="form__label">
						Password
					</label>
					<input
						type="password"
						name="password"
						onChange={(e) => onChange(e)}
						value={accountInfo.password}
						id="login-password"
						className="form__input-text"
					/>
					<span className="backend-errors">
						{
							reduxState[GENERAL_CONTAINER].backendErrors
								.validationAccountPassword
						}
					</span>
					<button type="submit" className="form__submit">
						LOGIN
					</button>
					<span className="backend-errors">
						{reduxState[GENERAL_CONTAINER].backendErrors.validationAccount}
						{reduxState[GENERAL_CONTAINER].backendErrors.serverAccount}
						{reduxState[GENERAL_CONTAINER].backendErrors.serverConnection}
					</span>
				</form>
				<div className="bottom-question">
					<span>Not a Member? </span>
					<span className="bottom-question__link" onClick={openRegister}>
						Register
					</span>
				</div>
			</div>
		</div>
	);
}
