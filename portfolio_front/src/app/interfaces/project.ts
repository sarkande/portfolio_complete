export interface ProjectResponse{
    id: number;
    slug: string;
    title: string;
    description: string;

    startDate: string;  // format: 'YYYY-MM-DD' attendu
    endDate: string;

    technologies: string[];
    tags: string[];
    category: string;

    thumbnailUrl: string;
    gallery: string[];

    gitUrl: string | null;
    liveUrl: string | null;

    role: string;

    isFeatured: boolean;
    active: boolean;
    old: boolean;

    content: string;  // contenu en Markdown

}
  