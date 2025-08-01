import { useState, useEffect, useMemo } from "react";
import type { CardData, SortOption } from "./types";
import { Card } from "./components/Card";
import { FunctionBar } from "./components/FunctionBar";
import testData from "./test-data.json";

function App() {
	const [cards, setCards] = useState<CardData[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortOption, setSortOption] = useState<SortOption>("date-desc");
	const [currentYearOnly, setCurrentYearOnly] = useState(false);

	useEffect(() => {
		const data = testData.payload.data;
		setCards(data);
	}, []);

	const filteredAndSortedCards = useMemo(() => {
		let filtered = cards;

		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(card) =>
					card.author.toLowerCase().includes(searchLower) ||
					card.title.toLowerCase().includes(searchLower)
			);
		}

		if (currentYearOnly) {
			const currentYear = new Date().getFullYear();
			filtered = filtered.filter((card) => {
				const cardYear = new Date(card.dateAdded).getFullYear();
				return cardYear === currentYear;
			});
		}

		const sorted = [...filtered].sort((a, b) => {
			switch (sortOption) {
				case "author-asc":
					return a.author.localeCompare(b.author);
				case "author-desc":
					return b.author.localeCompare(a.author);
				case "date-asc":
					return (
						new Date(a.dateAdded).getTime() -
						new Date(b.dateAdded).getTime()
					);
				case "date-desc":
					return (
						new Date(b.dateAdded).getTime() -
						new Date(a.dateAdded).getTime()
					);
				default:
					return 0;
			}
		});

		return sorted;
	}, [cards, searchTerm, sortOption, currentYearOnly]);

	const handleLikeToggle = (id: number, newLikes: number) => {
		setCards((prevCards) =>
			prevCards.map((card) =>
				card.id === id ? { ...card, likes: newLikes } : card
			)
		);
	};

	return (
		<div>
			<header className="header">
				<h1>dev articles</h1>
			</header>

			<div className="container">
				<FunctionBar
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					sortOption={sortOption}
					onSortChange={setSortOption}
					currentYearOnly={currentYearOnly}
					onCurrentYearChange={setCurrentYearOnly}
				/>
			</div>

			<div className="container">
				<div className="cards-grid">
					{filteredAndSortedCards.map((card) => (
						<Card
							key={card.id}
							card={card}
							onLikeToggle={handleLikeToggle}
						/>
					))}
				</div>

				{filteredAndSortedCards.length === 0 && (
					<div
						style={{
							textAlign: "center",
							padding: "40px",
							color: "#666",
						}}
					>
						Keine Karten gefunden.
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
