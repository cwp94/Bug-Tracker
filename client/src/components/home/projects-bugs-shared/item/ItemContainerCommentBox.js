import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	projectContainerName,
	bugContainerName,
} from "../../../../reducers/containerNames";

import { updateProjectOrBug, clearInputErrors } from "../../../../actions";

import { toggleCharCountColor } from "../../../../utils/elementUtils";

import "../../../../SCSS/home/projects-bugs-shared/item/itemContainerCommentBox.scss";

export default function ItemContainerCommentBox(props) {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	const [commentInfo, setCommentInfo] = useState({
		description: "",
	});

	const [descriptionCharLimit] = useState(500);

	// clears prior input errors when closing the component
	useEffect(() => {
		return () => {
			dispatch(clearInputErrors());
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		toggleCharCountColor(
			"js-create-comment-char-counter",
			commentInfo.description.length,
			descriptionCharLimit
		);
		// eslint-disable-next-line
	}, [commentInfo.description]);

	const onChange = (e) => {
		// Since select option values are always strings while priority and status take integers
		if (e.target.name === "description") {
			// Doesn't allow line breaks
			setCommentInfo({
				...commentInfo,
				[e.target.name]: e.target.value.replace(/(\r\n|\n|\r)/gm, ""),
			});
		} else {
			setCommentInfo({ ...commentInfo, [e.target.name]: e.target.value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		/* dispatch(
			updateProjectOrBug(
				props.reduxContainerName,
				commentInfoDeepCopy,
				reduxState[props.reduxContainerName].componentsDisplay
			)
		); */
	};

	return (
		<form noValidate onSubmit={handleSubmit}>
			<div className="outer-dividing-container">
				<div className="item-box">
					<label htmlFor="create-comment-description">
						<h2 className="item-box__title item-box__title--no-bottom-margin">
							Comments
						</h2>
					</label>
					<span className="item-box__form-character-counter js-create-comment-char-counter">
						{commentInfo.description.length + "/" + descriptionCharLimit}
					</span>
					<textarea
						name="description"
						onChange={(e) => onChange(e)}
						value={commentInfo.description}
						id="create-comment-description"
						className="item-box__form-textarea"
					/>
					<span className="form-errors">
						{reduxState.generalContainer.inputErrors.description}
					</span>
					<div className="form-submit-centering-container">
						<button
							type="submit"
							className="form-submit-centering-container__button"
						>
							Add Comment
						</button>
					</div>
				</div>
			</div>
			<div className="bottom-form-errors-container">
				<span className="form-errors">
					{reduxState.generalContainer.inputErrors.validation}
					{reduxState.generalContainer.inputErrors.server}
				</span>
			</div>
		</form>
	);
}
