import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	projectContainerName,
	bugContainerName,
} from "../../../../reducers/containerNames";

import {
	setWhichAccountComponentsDisplay,
	setWhichProjectOrBugComponentsDisplay,
	setWhichBugComponentsDisplay,
} from "../../../../actions";

import { toggleClassName } from "../../../../utils/elementUtils";

import "../../../../SCSS/home/projects-bugs-shared/item/itemContainerSidebarTableAndRows.scss";

export default function ItemContainerListSidebarRow(props) {
	const reduxState = useSelector((state) => state);
	const dispatch = useDispatch();

	useEffect(() => {
		if (
			reduxState[props.reduxContainerName].componentsDisplay.targetItem !== null
		) {
			toggleClassName(
				reduxState[props.reduxContainerName].componentsDisplay.targetItem.id ===
					props.item.id,
				document.getElementsByClassName(
					"js-list-sidebar__table-row-" + props.item.id
				)[0],
				"list-sidebar__table__row--selected"
			);
		}
	}, [
		reduxState[projectContainerName].componentsDisplay.targetItem,
		reduxState[bugContainerName].componentsDisplay.targetItem,
	]);

	const openItemContainer = () => {
		if (
			reduxState[props.reduxContainerName].componentsDisplay.targetItem ===
				null ||
			reduxState[props.reduxContainerName].componentsDisplay.targetItem.id !==
				props.item.id
		) {
			dispatch(setWhichAccountComponentsDisplay({}));
			dispatch(
				setWhichProjectOrBugComponentsDisplay(props.reduxContainerName, {
					listContainer: false,
					itemContainer: true,
					targetItem: props.item,
				})
			);

			// Resets bug components display when a different project is opened
			// ...to prevent erros with bug targetItem not belonging to project
			if (props.reduxContainerName === projectContainerName) {
				dispatch(setWhichBugComponentsDisplay({}));
			}
		}
	};

	return (
		<tr
			className={
				"list-sidebar__table__row list-sidebar__table__row--clickable " +
				"js-list-sidebar__table-row-" +
				props.item.id
			}
			onClick={openItemContainer}
		>
			<td className={
						"list-sidebar__table__data" + (props.reduxContainerName ===
						bugContainerName
							? " list-sidebar__table__data--red"
							: "")
					}>
			<span
					
				>
					{props.item.name}
				</span>
			</td>
		</tr>
	);
}
