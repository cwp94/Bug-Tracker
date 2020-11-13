// Database
const express = require("express");
const pool = require("../db");
const router = express.Router();

//=============================================================
//  Retrieve priority and status tables for projects and bugs
//=============================================================
router.route("/retrieve").get(async (req, res) => {
	let inputErrors = {};

	try {
		const projectPriorityOptions = await pool.query(
			`SELECT p_priority_id AS id, option 
				FROM project_priority 
					ORDER BY order_number`
		);

		const projectPriorityEmptyId = await pool.query(
			`SELECT p_priority_id AS id 
				FROM project_priority 
					WHERE marks_empty = true`
		);

		const projectStatusOptions = await pool.query(
			`SELECT p_status_id AS id, option 
				FROM project_status 
					ORDER BY order_number`
		);

		const projectStatusEmptyId = await pool.query(
			`SELECT p_status_id AS id 
				FROM project_status 
					WHERE marks_empty = true`
		);

		const projectStatusCompletionId = await pool.query(
			`SELECT p_status_id AS id 
				FROM project_status 
					WHERE marks_completion = true`
		);

		const bugPriorityOptions = await pool.query(
			`SELECT b_priority_id AS id, option 
				FROM bug_priority 
					ORDER BY order_number`
		);

		const bugPriorityEmptyId = await pool.query(
			`SELECT b_priority_id AS id 
				FROM bug_priority 
					WHERE marks_empty = true`
		);

		const bugStatusOptions = await pool.query(
			`SELECT b_status_id AS id, option 
				FROM bug_status 
					ORDER BY order_number`
		);

		const bugStatusEmptyId = await pool.query(
			`SELECT b_status_id AS id 
				FROM bug_status 
					WHERE marks_empty = true`
		);

		const bugStatusCompletionId = await pool.query(
			`SELECT b_status_id AS id, option 
				FROM bug_status 
					WHERE marks_completion = true`
		);

		res.json({
			success: true,
			projectPriorityStatusOptions: {
				priorityOptions: projectPriorityOptions.rows,
				priorityEmptyId: projectPriorityEmptyId.rowCount < 1 ? null : projectPriorityEmptyId.rows[0].id,
				statusOptions: projectStatusOptions.rows,
				statusEmptyId: projectStatusEmptyId.rowCount < 1 ? null : projectStatusEmptyId.rows[0].id,
				statusCompletionId: projectStatusCompletionId.rowCount < 1 ? null : projectStatusCompletionId.rows[0].id,
			},
			bugPriorityStatusOptions: {
				priorityOptions: bugPriorityOptions.rows,
				priorityEmptyId: bugPriorityEmptyId.rowCount < 1 ? null : bugPriorityEmptyId.rows[0].id,
				statusOptions: bugStatusOptions.rows,
				statusEmptyId: bugStatusEmptyId.rowCount < 1 ? null : bugStatusEmptyId.rows[0].id,
				statusCompletionId: bugStatusCompletionId.rowCount < 1 ? null : bugStatusCompletionId.rows[0].id,
			},
		});
	} catch (err) {
		console.error(err.message);
		inputErrors.serverPriorityStatus = "Server error while retrieving Priority/Status options";
		return res.status(500).json({ success: false, inputErrors });
	}
});

module.exports = router;
