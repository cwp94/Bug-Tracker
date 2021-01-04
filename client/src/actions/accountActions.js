import axios from "axios";
import jwt_decode from "jwt-decode";

// Redux containers
import { ACCOUNT_CONTAINER } from "./constants/containerNames";
// Redux types
import { SET_AUTHENTICATION, SET_ACCOUNT } from "./constants/types";
// Redux dispatch functions
import {
	createHeader,
	setInputErrors,
	resetRedux,
	setWhichGeneralComponentsDisplay,
	setWhichAccountComponentsDisplay,
	setPriorityStatus,
	setProjects,
	setBugs,
	setComments,
} from "./index";

/**
 * Sets the accounts authentication information inside the
 * account container of the redux state
 *
 * @param {JSON} decodedToken - JSON containing authentication info for account
 */
export const setAuthentication = (decodedToken) => (dispatch) => {
	dispatch({
		container: ACCOUNT_CONTAINER,
		type: SET_AUTHENTICATION,
		decodedToken: decodedToken,
	});
};

/**
 * Sets the account info inside the account container of the redux state
 *
 * @param {JSON} account - JSON containing the account info
 */
export const setAccount = (account) => (dispatch) => {
	dispatch({
		container: ACCOUNT_CONTAINER,
		type: SET_ACCOUNT,
		account: account,
	});
};

/**
 * Calls api/account/register route in order to register a new account in
 * the database
 *
 * @param {JSON} accountInfo - JSON containing the info to create a new account
 */
export const registerAccount = (accountInfo) => (dispatch) => {
	axios
		.post("/api/account/register", accountInfo)
		.then(() => {
			// register was successful, so switching to the login page
			dispatch(setWhichGeneralComponentsDisplay({ login: true }));
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));
		});
};

/**
 * Calls api/account/login route in order to login into an account, retrieve a
 * jwToken to store in localStorage, and retrieve all account data from the
 * database and store each data set in their corresponding redux state containers
 *
 * @param {JSON} accountInfo - JSON containing the account info for login
 */
export const loginAccount = (accountInfo) => (dispatch) => {
	axios
		.post("/api/account/login", accountInfo)
		.then((res) => {
			const {
				jwToken,
				projectPriorityStatus,
				bugPriorityStatus,
				account,
				projects,
				bugs,
				comments,
			} = res.data;

			// stored locally to later be sent in the header of most http calls
			// ...so the server can both decode it get the account_id for the call
			// ...as well as authenticate the call without being sent a password
			localStorage.setItem("jwToken", jwToken);

			// all account data was sent from login route and set here so only
			// ...one http call was needed
			const decodedToken = jwt_decode(jwToken);
			dispatch(setAuthentication(decodedToken));
			dispatch(setPriorityStatus(projectPriorityStatus, bugPriorityStatus));
			dispatch(setAccount(account));
			dispatch(setProjects(projects));
			dispatch(setBugs(bugs));
			dispatch(setComments(comments));

			// login was successful, so switching to the home page
			dispatch(setWhichGeneralComponentsDisplay({ home: true }));
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));
		});
};

/**
 * Calls api/account/retrieve route to retrieve the account info from the
 * database and store it in the account container of the redux state
 */
export const retrieveAccount = () => (dispatch) => {
	const header = createHeader();
	axios
		.post("/api/account/retrieve", null, header)
		.then((res) => {
			const { account } = res.data;
			dispatch(setAccount(account));
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				// jwToken was invalid (likely expired), so user is logged out
				dispatch(logoutAccount());
			}
		});
};

/**
 * Calls api/account/retrieve-everything route to retrieve all account data
 * from the database and store each data set in their corresponding
 * redux state containers
 */
export const retrieveEverythingForAccount = () => (dispatch) => {
	const header = createHeader();
	axios
		.post("/api/account/retrieve-everything", null, header)
		.then((res) => {
			const {
				projectPriorityStatus,
				bugPriorityStatus,
				account,
				projects,
				bugs,
				comments,
			} = res.data;

			dispatch(setPriorityStatus(projectPriorityStatus, bugPriorityStatus));
			dispatch(setAccount(account));
			dispatch(setProjects(projects));
			dispatch(setBugs(bugs));
			dispatch(setComments(comments));
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				// jwToken was invalid (likely expired), so user is logged out
				dispatch(logoutAccount());
			}
		});
};

/**
 * Calls api/account/update-info route to update the name for the account
 * in the database, then stores the updated account info in the account
 * container of the redux state
 *
 * @param {JSON} accountInfo - JSON containing the new account name
 */
export const updateAccountInfo = (accountInfo) => (dispatch) => {
	const header = createHeader();
	axios
		.post("/api/account/update-info", accountInfo, header)
		.then((res) => {
			const { account } = res.data;
			// updates the redux state with the new account name
			dispatch(setAccount(account));
			// closes the editAccountModal and re-opens the accountSidebar
			dispatch(setWhichAccountComponentsDisplay({ accountSidebar: true }));
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				// jwToken was invalid (likely expired), so user is logged out
				dispatch(logoutAccount());
			}
		});
};

/**
 * Calls api/account/update-email route to update the email for the account
 * in the database, then stores the updated account email in the account
 * container of the redux state
 *
 * @param {JSON} accountInfo - JSON containing the new account email
 */
export const updateAccountEmail = (accountInfo) => (dispatch) => {
	const header = createHeader();
	axios
		.post("/api/account/update-email", accountInfo, header)
		.then((res) => {
			const { account } = res.data;
			// updates the redux state with the new account email
			dispatch(setAccount(account));
			// closes the editAccountModal and re-opens the accountSidebar
			dispatch(setWhichAccountComponentsDisplay({ accountSidebar: true }));
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				// jwToken was invalid (likely expired), so user is logged out
				dispatch(logoutAccount());
			}
		});
};

/**
 * Calls api/account/update-password route to update the password for the
 * account in the database
 *
 * @param {JSON} accountInfo - JSON containing the new account password
 */
export const updateAccountPassword = (accountInfo) => (dispatch) => {
	const header = createHeader();
	axios
		.post("/api/account/update-password", accountInfo, header)
		.then((res) => {
			const { account } = res.data;
			// still updates the redux state despite not storing the new
			// ...password since the new account JSON will contained an
			// ...updated last_edited_timestamp
			dispatch(setAccount(account));
			// closes the editAccountModal and re-opens the accountSidebar
			dispatch(setWhichAccountComponentsDisplay({ accountSidebar: true }));
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));

			if (err.response.data.inputErrors.jwToken !== undefined) {
				// jwToken was invalid (likely expired), so user is logged out
				dispatch(logoutAccount());
			}
		});
};

/**
 * Calls api/account/delete route to delete the account in the database, then
 * logs the user out (which resets the redux state and returns them to the 
 * login page)
 * 
 * @param {JSON} accountInfo - JSON containing the new account password and delete check
 */
export const deleteAccount = (accountInfo) => (dispatch) => {
	const header = createHeader();
	axios
		.post("/api/account/delete", accountInfo, header)
		.then((res) => {
			dispatch(logoutAccount());
		})
		.catch((err) => {
			// sets input errors for what went wrong to be displayed to user
			dispatch(setInputErrors(err.response.data.inputErrors));
		});
};

/**
 * Logs an account out by removing their jwToken from the localStorage and
 * resetting the redux state (which also returns them to the login page)
 */
export const logoutAccount = () => (dispatch) => {
	localStorage.removeItem("jwToken");
	dispatch(resetRedux());
	
	console.log("Message: logged out");
};
