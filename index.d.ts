export interface ApiFailResponse {
    message: string
    data?: any
}

export interface Post {
    id: string
    title: string
    datePublished: Date
    description?: string
    text: string
}
