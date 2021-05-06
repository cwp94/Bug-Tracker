// Util uses container names to work with the redux state
import {
	BUG_CONTAINER,
} from "../actions/constants/containerNames";

/**
 * Gets the number of bugs within a project that have a particular status
 * 
 * @param {Object} passedReduxState - Current redux state from 
 * useSelector((state) => state) 
 * @param {number} projectId - Id of the project that the bugs belong to
 * @param {number} statusId - Id of the status option in question for finding
 * the number of bugs for
 * @returns {number} The number of bugs within a project that have a particular status
 */
export function getNumberOfBugsForStatus(
	passedReduxState,
	projectId,
	statusId
) {
	// Spread operator makes deep copy of bug list so original is not affected
	return [...passedReduxState[BUG_CONTAINER].list].filter(
		(item) => item.project_id === projectId && item.status_id === statusId
	).length;
}

/**
 * Gets a list of all bugs for a particular project
 * 
 * @param {Object} passedReduxState - Current redux state from 
 * useSelector((state) => state)
 * @param {number} projectId - Id of the project thats bugs are to be retrieved
 * @returns {Object[]} List of bugs for a particular project
 */
export function getBugsInProjectList(passedReduxState, projectId) {
	// Spread operator makes deep copy of bug list so original is not affected
	return [...passedReduxState[BUG_CONTAINER].list].filter(
		(item) => item.project_id === projectId
	);
}
