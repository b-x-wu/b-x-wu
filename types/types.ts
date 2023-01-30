export interface ApiFailResponse {
    message: string
    data?: any
}

export interface Post {
    id: string
    title: string
    datePublished: Date
    description?: string
    coverImageSrc?: string
    content: string
}

export class Markdown {
    metadata: { [field: string]: string }
    content: string

    constructor(fileText: string) {
        const metadataHeaderText = fileText.match(/^---\s([\s\S]*\s)---\s([\s\S]*)$/)

        if (metadataHeaderText === null) {
            // no metadata
            this.metadata = {}
            this.content = fileText
            return
        }

        this.content = metadataHeaderText[2].trim()
        const metadataMatch = /(.*): (.*)/g
        this.metadata = {}

        let match
        while ((match = metadataMatch.exec(metadataHeaderText[1])) !== null) {
            this.metadata[match[1]] = match[2]
        }
    }

    missingMetadataFields(requiredFields: string[]): string[] {
        const metadataFields = Object.keys(this.metadata)
        return requiredFields.filter((requiredField) => !metadataFields.includes(requiredField))
    }
}