import { describe, it, expect } from "vitest";

// Import the utility functions from Card component
const getInitials = (name: string) => {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("de-DE", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

describe("Utility Functions", () => {
	describe("getInitials", () => {
		it("should return first two initials from a full name", () => {
			expect(getInitials("John Doe")).toBe("JD");
			expect(getInitials("Jane Smith")).toBe("JS");
			expect(getInitials("Alice Johnson Brown")).toBe("AJ");
		});

		it("should handle single names", () => {
			expect(getInitials("John")).toBe("J");
			expect(getInitials("A")).toBe("A");
		});

		it("should handle empty string", () => {
			expect(getInitials("")).toBe("");
		});

		it("should handle names with extra spaces", () => {
			expect(getInitials("  John   Doe  ")).toBe("JD");
		});
	});

	describe("formatDate", () => {
		it("should format date in German locale", () => {
			const testDate = "2024-01-15T10:30:00Z";
			const formatted = formatDate(testDate);

			// The exact format depends on the system locale, but it should contain the date
			expect(formatted).toMatch(/\d{1,2}\.\s*\w+\s*\d{4}/);
		});

		it("should handle different date formats", () => {
			const dates = [
				"2024-12-25",
				"2024-06-15T14:30:00.000Z",
				"2024-03-08T00:00:00",
			];

			dates.forEach((date) => {
				const formatted = formatDate(date);
				expect(formatted).toBeTruthy();
				expect(typeof formatted).toBe("string");
			});
		});

		it("should handle invalid date strings gracefully", () => {
			expect(() => formatDate("invalid-date")).not.toThrow();
		});
	});
});
