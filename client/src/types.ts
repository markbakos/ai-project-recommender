
export type Project = {
    name: string
    description: string
    url: string
    stars: number
    language: string
    topics: string[]
    last_updated: Date
}

export type Feedback = {
    project_url: string
    feedback: string
}

export type RecommendationPreferences = {
    tags: string
    min_stars: number
    max_stars: number
}