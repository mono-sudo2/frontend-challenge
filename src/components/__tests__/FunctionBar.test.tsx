import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FunctionBar } from "../FunctionBar";
import type { SortOption } from "../../types";

// Mock the SVG imports
vi.mock("../../assets/search-icon.svg", () => ({
	default: "search-icon.svg",
}));

const mockProps = {
	searchTerm: "",
	onSearchChange: vi.fn(),
	sortOption: "date-desc" as SortOption,
	onSortChange: vi.fn(),
	currentYearOnly: false,
	onCurrentYearChange: vi.fn(),
};

describe("FunctionBar Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render all form elements", () => {
		render(<FunctionBar {...mockProps} />);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toBeInTheDocument();
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
		expect(screen.getByText("Nur aktuelles Jahr")).toBeInTheDocument();
	});

	it("should display search icon", () => {
		render(<FunctionBar {...mockProps} />);

		const searchIcon = screen.getByAltText("Search");
		expect(searchIcon).toBeInTheDocument();
		expect(searchIcon).toHaveAttribute("src", "search-icon.svg");
	});

	it("should render all sort options", () => {
		render(<FunctionBar {...mockProps} />);

		const select = screen.getByRole("combobox");
		expect(select).toHaveValue("date-desc");

		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(4);

		expect(screen.getByText("Autor (A-Z)")).toBeInTheDocument();
		expect(screen.getByText("Autor (Z-A)")).toBeInTheDocument();
		expect(screen.getByText("Datum (älteste zuerst)")).toBeInTheDocument();
		expect(screen.getByText("Datum (neueste zuerst)")).toBeInTheDocument();
	});

	it("should handle search input changes", () => {
		render(<FunctionBar {...mockProps} />);

		const searchInput = screen.getByRole("textbox");
		fireEvent.change(searchInput, { target: { value: "test search" } });

		expect(mockProps.onSearchChange).toHaveBeenCalledWith("test search");
	});

	it("should handle sort option changes", () => {
		render(<FunctionBar {...mockProps} />);

		const sortSelect = screen.getByRole("combobox");
		fireEvent.change(sortSelect, { target: { value: "author-asc" } });

		expect(mockProps.onSortChange).toHaveBeenCalledWith("author-asc");
	});

	it("should handle checkbox changes", () => {
		render(<FunctionBar {...mockProps} />);

		const checkbox = screen.getByRole("checkbox");
		fireEvent.click(checkbox);

		expect(mockProps.onCurrentYearChange).toHaveBeenCalledWith(true);
	});

	it("should display current search term", () => {
		const propsWithSearch = { ...mockProps, searchTerm: "existing search" };
		render(<FunctionBar {...propsWithSearch} />);

		const searchInput = screen.getByRole("textbox");
		expect(searchInput).toHaveValue("existing search");
	});

	it("should display current sort option", () => {
		const propsWithSort = {
			...mockProps,
			sortOption: "author-desc" as SortOption,
		};
		render(<FunctionBar {...propsWithSort} />);

		const sortSelect = screen.getByRole("combobox");
		expect(sortSelect).toHaveValue("author-desc");
	});

	it("should display current checkbox state", () => {
		const propsWithCheckbox = { ...mockProps, currentYearOnly: true };
		render(<FunctionBar {...propsWithCheckbox} />);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeChecked();
	});

	it("should have proper accessibility attributes", () => {
		render(<FunctionBar {...mockProps} />);

		const searchInput = screen.getByRole("textbox");
		expect(searchInput).toHaveAttribute("name", "search");
		expect(searchInput).toHaveAttribute("type", "text");

		const sortSelect = screen.getByRole("combobox");
		expect(sortSelect).toHaveAttribute("name", "sort");

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toHaveAttribute("name", "currentYearOnly");
		expect(checkbox).toHaveAttribute("type", "checkbox");
	});

	it("should handle special characters in search", () => {
		render(<FunctionBar {...mockProps} />);

		const searchInput = screen.getByRole("textbox");
		const specialSearch = "test@#$%^&*()";
		fireEvent.change(searchInput, { target: { value: specialSearch } });

		expect(mockProps.onSearchChange).toHaveBeenCalledWith(specialSearch);
	});

	it("should maintain proper HTML structure", () => {
		const { container } = render(<FunctionBar {...mockProps} />);

		expect(container.querySelector(".function-bar")).toBeInTheDocument();
		expect(
			container.querySelector(".search-container")
		).toBeInTheDocument();
		expect(container.querySelector(".search-input")).toBeInTheDocument();
		expect(container.querySelector(".sort-select")).toBeInTheDocument();
		expect(container.querySelector(".filter-checkbox")).toBeInTheDocument();
	});

	it("should handle all sort options correctly", () => {
		const sortOptions: SortOption[] = [
			"author-asc",
			"author-desc",
			"date-asc",
			"date-desc",
		];

		sortOptions.forEach((option) => {
			const propsWithSort = { ...mockProps, sortOption: option };
			const { unmount } = render(<FunctionBar {...propsWithSort} />);

			const sortSelect = screen.getByRole("combobox");
			expect(sortSelect).toHaveValue(option);

			unmount();
		});
	});
});
