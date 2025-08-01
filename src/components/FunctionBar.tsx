import React from "react";
import type { SortOption } from "../types";
import searchIcon from "../assets/search-icon.svg";

interface FunctionBarProps {
	searchTerm: string;
	onSearchChange: (term: string) => void;
	sortOption: SortOption;
	onSortChange: (option: SortOption) => void;
	currentYearOnly: boolean;
	onCurrentYearChange: (checked: boolean) => void;
}

export const FunctionBar: React.FC<FunctionBarProps> = ({
	searchTerm,
	onSearchChange,
	sortOption,
	onSortChange,
	currentYearOnly,
	onCurrentYearChange,
}) => {
	return (
		<div className="function-bar">
			<div className="search-container">
				<img src={searchIcon} alt="Search" className="search-icon" />
				<input
					type="text"
					className="search-input"
					name="search"
					placeholder="Nach Autoren oder Titeln suchen..."
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>

			<select
				className="sort-select"
				name="sort"
				value={sortOption}
				onChange={(e) => onSortChange(e.target.value as SortOption)}
			>
				<option value="author-asc">Autor (A-Z)</option>
				<option value="author-desc">Autor (Z-A)</option>
				<option value="date-asc">Datum (älteste zuerst)</option>
				<option value="date-desc">Datum (neueste zuerst)</option>
			</select>

			<label className="filter-checkbox">
				<input
					type="checkbox"
					name="currentYearOnly"
					checked={currentYearOnly}
					onChange={(e) => onCurrentYearChange(e.target.checked)}
				/>
				<span>Nur aktuelles Jahr</span>
			</label>
		</div>
	);
};
