export interface ArticleModel {
	id?: number;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	publishedDate: string; // Format ISO: 'YYYY-MM-DD'
	tags: string[];
	relatedProjectSlug?: string | null;
	thumbnailUrl?: string | null;
	active: boolean;
}
