export interface CardData {
	id: number;
	author: string;
	title: string;
	dateAdded: string;
	images: {
		portrait: string[];
		landscape: string[];
	};
	likes: number;
}

export interface ApiResponse {
	message: {
		status: string;
		code: string;
		text: string;
	};
	payload: {
		data: CardData[];
	};
}

export type SortOption =
	| "author-asc"
	| "author-desc"
	| "date-asc"
	| "date-desc";
