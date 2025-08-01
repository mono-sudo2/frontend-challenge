import React, { useState } from "react";
import type { CardData } from "../types";
import heartIcon from "../assets/heart-icon.svg";

interface CardProps {
	card: CardData;
	onLikeToggle: (id: number, newLikes: number) => void;
}

export const Card: React.FC<CardProps> = ({ card, onLikeToggle }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likes, setLikes] = useState(card.likes);

	const handleLikeClick = () => {
		const newLikes = isLiked ? likes - 1 : likes + 1;
		setIsLiked(!isLiked);
		setLikes(newLikes);
		onLikeToggle(card.id, newLikes);
	};

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

	return (
		<article className="card">
			<img
				src={card.images.landscape[0]}
				alt={card.title}
				className="card-image"
			/>
			<div className="card-content-container">
				<div className="card-content">
					<div className="card-header">
						<div className="author-avatar">
							{getInitials(card.author)}
						</div>
						<div className="author-info">
							<div className="author-name">{card.author}</div>
							<div className="card-date">
								{formatDate(card.dateAdded)}
							</div>
						</div>
					</div>

					<h3 className="card-title">{card.title}</h3>
				</div>

				<div className="card-footer">
					<button
						className={`like-button ${isLiked ? "active" : ""}`}
						onClick={handleLikeClick}
						aria-label={isLiked ? "Unlike" : "Like"}
					>
						LIKE
					</button>
					<div className="likes-container">
						<img
							src={heartIcon}
							alt="Heart"
							className="like-icon"
						/>
						<span className="likes-count">{likes}</span>
					</div>
				</div>
			</div>
		</article>
	);
};
