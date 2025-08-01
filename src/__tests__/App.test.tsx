import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

vi.mock("../test-data.json", () => ({
	default: {
		payload: {
			data: [
				{
					id: 1,
					author: "John Doe",
					title: "React Best Practices",
					dateAdded: "2025-01-15T10:30:00Z",
					images: {
						portrait: ["portrait1.jpg"],
						landscape: ["landscape1.jpg"],
					},
					likes: 42,
				},
				{
					id: 2,
					author: "Jane Smith",
					title: "TypeScript Tips",
					dateAdded: "2024-06-20T14:20:00Z",
					images: {
						portrait: ["portrait2.jpg"],
						landscape: ["landscape2.jpg"],
					},
					likes: 15,
				},
				{
					id: 3,
					author: "Alice Johnson",
					title: "CSS Grid Layout",
					dateAdded: "2023-12-10T09:15:00Z",
					images: {
						portrait: ["portrait3.jpg"],
						landscape: ["landscape3.jpg"],
					},
					likes: 28,
				},
			],
		},
	},
}));

vi.mock("../assets/heart-icon.svg", () => ({
	default: "heart-icon.svg",
}));

vi.mock("../assets/search-icon.svg", () => ({
	default: "search-icon.svg",
}));

describe("App Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render the header with title", () => {
		render(<App />);

		expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
		expect(screen.getByText("dev articles")).toBeInTheDocument();
	});

	it("should load and display all cards initially", async () => {
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
			expect(screen.getByText("TypeScript Tips")).toBeInTheDocument();
			expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
		});
	});

	it("should display author names", async () => {
		render(<App />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByText("Jane Smith")).toBeInTheDocument();
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
		});
	});

	it("should display like counts", async () => {
		render(<App />);

		await waitFor(() => {
			expect(screen.getByText("42")).toBeInTheDocument();
			expect(screen.getByText("15")).toBeInTheDocument();
			expect(screen.getByText("28")).toBeInTheDocument();
		});
	});

	it("should filter cards by search term", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText(
			"Nach Autoren oder Titeln suchen..."
		);
		await user.type(searchInput, "React");

		expect(screen.getByText("React Best Practices")).toBeInTheDocument();
		expect(screen.queryByText("TypeScript Tips")).not.toBeInTheDocument();
		expect(screen.queryByText("CSS Grid Layout")).not.toBeInTheDocument();
	});

	it("should filter cards by author name", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText(
			"Nach Autoren oder Titeln suchen..."
		);
		await user.type(searchInput, "Jane");

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
		expect(screen.getByText("TypeScript Tips")).toBeInTheDocument();
		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
		expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
	});

	it("should handle case-insensitive search", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText(
			"Nach Autoren oder Titeln suchen..."
		);
		await user.type(searchInput, "react");

		expect(screen.getByText("React Best Practices")).toBeInTheDocument();
		expect(screen.queryByText("TypeScript Tips")).not.toBeInTheDocument();
	});

	it("should sort cards by author ascending", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		const sortSelect = screen.getByRole("combobox");
		await user.selectOptions(sortSelect, "author-asc");

		const cards = screen.getAllByRole("article");
		const firstCard = cards[0];
		expect(firstCard).toHaveTextContent("Alice Johnson");
	});

	it("should sort cards by author descending", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		const sortSelect = screen.getByRole("combobox");
		await user.selectOptions(sortSelect, "author-desc");

		const cards = screen.getAllByRole("article");
		const firstCard = cards[0];
		expect(firstCard).toHaveTextContent("John Doe");
	});

	it("should sort cards by date ascending", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const sortSelect = screen.getByRole("combobox");
		await user.selectOptions(sortSelect, "date-asc");

		const cards = screen.getAllByRole("article");
		const firstCard = cards[0];
		expect(firstCard).toHaveTextContent("CSS Grid Layout");
	});

	it("should sort cards by date descending", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const sortSelect = screen.getByRole("combobox");
		await user.selectOptions(sortSelect, "date-desc");

		const cards = screen.getAllByRole("article");
		const firstCard = cards[0];
		expect(firstCard).toHaveTextContent("React Best Practices");
	});

	it("should filter cards by current year only", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
		});

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);

		expect(screen.queryByText("React Best Practices")).toBeInTheDocument();
		expect(screen.queryByText("TypeScript Tips")).not.toBeInTheDocument();
		expect(screen.queryByText("CSS Grid Layout")).not.toBeInTheDocument();
	});

	it("should handle like button clicks", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(screen.queryByText("42")).toBeInTheDocument();
		});

		const likeButtons = screen.getAllByRole("button", { name: /like/i });
		await user.click(likeButtons[0]);

		expect(screen.getByText("43")).toBeInTheDocument();
	});

	it("should show no results message when no cards match filter", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText(
			"Nach Autoren oder Titeln suchen..."
		);
		await user.type(searchInput, "NonExistentArticle");

		expect(screen.getByText("Keine Karten gefunden.")).toBeInTheDocument();
	});

	it("should combine search and sort filters", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText(
			"Nach Autoren oder Titeln suchen..."
		);
		await user.type(searchInput, "Script");

		const sortSelect = screen.getByRole("combobox");
		await user.selectOptions(sortSelect, "author-asc");

		expect(screen.getByText("TypeScript Tips")).toBeInTheDocument();
		expect(
			screen.queryByText("React Best Practices")
		).not.toBeInTheDocument();
		expect(screen.queryByText("CSS Grid Layout")).not.toBeInTheDocument();
	});

	it("should combine all filters (search, sort, current year)", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText(
			"Nach Autoren oder Titeln suchen..."
		);
		await user.type(searchInput, "React");

		const sortSelect = screen.getByRole("combobox");
		await user.selectOptions(sortSelect, "date-desc");

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);

		expect(screen.queryByText("React Best Practices")).toBeInTheDocument();
		expect(screen.queryByText("TypeScript Tips")).not.toBeInTheDocument();
		expect(screen.queryByText("CSS Grid Layout")).not.toBeInTheDocument();
	});

	it("should maintain proper HTML structure", async () => {
		const { container } = render(<App />);

		await waitFor(() => {
			expect(container.querySelector(".header")).toBeInTheDocument();
			expect(container.querySelector(".container")).toBeInTheDocument();
			expect(container.querySelector(".cards-grid")).toBeInTheDocument();
		});
	});

	it("should handle empty search term correctly", async () => {
		const user = userEvent.setup();
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByText("React Best Practices")
			).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText(
			"Nach Autoren oder Titeln suchen..."
		);
		await user.type(searchInput, "React");
		await user.clear(searchInput);

		expect(screen.getByText("React Best Practices")).toBeInTheDocument();
		expect(screen.getByText("TypeScript Tips")).toBeInTheDocument();
		expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
	});
});
