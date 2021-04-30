import { SET_ACCOUNT_SETTING_THEMES } from "../../actions/constants/types";

// Default state for account (empty since no account is logged in by default)
const initialState = {}

/**
 * Used to set Object containing account setting themes data from the database in
 * the account container of the redux state
 * 
 * @param {Object} state - Object for account setting themes data in the redux state
 * @param {Object} action - Object containing a container name and type (used to
 * determin where and what task to do in the redux state), also contians any
 * addition data needed for the task (typically data to be updated in the
 * redux state)
 * @returns {Object} Object for account setting themes to be stored in the account
 * container of the redux state
 */
export default function accountSettingThemesReducer(state = initialState, action) {
	switch (action.type) {
		case SET_ACCOUNT_SETTING_THEMES:
			return action.accountSettingThemes;
		default:
			return state;
	}
}