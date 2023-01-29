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

export interface MarkdownData {
    [field: string]: string // metadata
    text: string // the text without the metadata
}
