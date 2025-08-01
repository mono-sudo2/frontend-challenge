import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card } from "../Card";
import type { CardData } from "../../types";

// Mock the SVG imports
vi.mock("../../assets/heart-icon.svg", () => ({
	default: "heart-icon.svg",
}));

const mockCard: CardData = {
	id: 1,
	author: "John Doe",
	title: "Test Article Title",
	dateAdded: "2024-01-15T10:30:00Z",
	images: {
		portrait: ["portrait1.jpg"],
		landscape: ["landscape1.jpg"],
	},
	likes: 42,
};

const mockOnLikeToggle = vi.fn();

describe("Card Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render card with all required information", () => {
		render(<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Test Article Title")).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByAltText("Test Article Title")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /like/i })
		).toBeInTheDocument();
	});

	it("should display author initials in avatar", () => {
		render(<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />);

		expect(screen.getByText("JD")).toBeInTheDocument();
	});

	it("should handle author initials for single name", () => {
		const singleNameCard = { ...mockCard, author: "Alice" };
		render(<Card card={singleNameCard} onLikeToggle={mockOnLikeToggle} />);

		expect(screen.getByText("A")).toBeInTheDocument();
	});

	it("should handle author initials for multiple names", () => {
		const multiNameCard = { ...mockCard, author: "Alice Johnson Brown" };
		render(<Card card={multiNameCard} onLikeToggle={mockOnLikeToggle} />);

		expect(screen.getByText("AJ")).toBeInTheDocument();
	});

	it("should format date correctly", () => {
		render(<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />);

		// The date should be formatted in German locale
		const dateElement = screen.getByText(/\d{1,2}\.\s*\w+\s*\d{4}/);
		expect(dateElement).toBeInTheDocument();
	});

	it("should handle like button click and update state", () => {
		render(<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />);

		const likeButton = screen.getByRole("button", { name: /like/i });

		// Initial state
		expect(likeButton).not.toHaveClass("active");
		expect(screen.getByText("42")).toBeInTheDocument();

		// Click like button
		fireEvent.click(likeButton);

		// Should call onLikeToggle with incremented likes
		expect(mockOnLikeToggle).toHaveBeenCalledWith(1, 43);
		expect(likeButton).toHaveClass("active");
		expect(screen.getByText("43")).toBeInTheDocument();
	});

	it("should handle unlike button click and update state", () => {
		render(<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />);

		const likeButton = screen.getByRole("button", { name: /like/i });

		// First click to like
		fireEvent.click(likeButton);
		expect(mockOnLikeToggle).toHaveBeenCalledWith(1, 43);

		// Second click to unlike
		fireEvent.click(likeButton);
		expect(mockOnLikeToggle).toHaveBeenCalledWith(1, 42);
		expect(likeButton).not.toHaveClass("active");
		expect(screen.getByText("42")).toBeInTheDocument();
	});

	it("should update aria-label based on like state", () => {
		render(<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />);

		const likeButton = screen.getByRole("button", { name: /like/i });

		// Initial state - should be "Like"
		expect(likeButton).toHaveAttribute("aria-label", "Like");

		// After clicking - should be "Unlike"
		fireEvent.click(likeButton);
		expect(likeButton).toHaveAttribute("aria-label", "Unlike");

		// After clicking again - should be "Like"
		fireEvent.click(likeButton);
		expect(likeButton).toHaveAttribute("aria-label", "Like");
	});

	it("should display heart icon", () => {
		render(<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />);

		const heartIcon = screen.getByAltText("Heart");
		expect(heartIcon).toBeInTheDocument();
		expect(heartIcon).toHaveAttribute("src", "heart-icon.svg");
	});

	it("should handle zero likes", () => {
		const zeroLikesCard = { ...mockCard, likes: 0 };
		render(<Card card={zeroLikesCard} onLikeToggle={mockOnLikeToggle} />);

		expect(screen.getByText("0")).toBeInTheDocument();
	});

	it("should handle large number of likes", () => {
		const manyLikesCard = { ...mockCard, likes: 9999 };
		render(<Card card={manyLikesCard} onLikeToggle={mockOnLikeToggle} />);

		expect(screen.getByText("9999")).toBeInTheDocument();
	});

	it("should maintain proper HTML structure", () => {
		const { container } = render(
			<Card card={mockCard} onLikeToggle={mockOnLikeToggle} />
		);

		// Check for proper semantic structure
		expect(container.querySelector("article.card")).toBeInTheDocument();
		expect(container.querySelector(".card-image")).toBeInTheDocument();
		expect(
			container.querySelector(".card-content-container")
		).toBeInTheDocument();
		expect(container.querySelector(".card-header")).toBeInTheDocument();
		expect(container.querySelector(".author-avatar")).toBeInTheDocument();
		expect(container.querySelector(".author-info")).toBeInTheDocument();
		expect(container.querySelector(".card-title")).toBeInTheDocument();
		expect(container.querySelector(".card-footer")).toBeInTheDocument();
	});
});
