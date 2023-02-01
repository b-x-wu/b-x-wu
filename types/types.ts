export interface ApiFailResponse {
  message: string
  data?: any
}

export interface PaginationLinks {
  prev?: string // endpoint of the previous <limit> results. will not exist if there are no previous results
  next?: string // endpoint of the next <limit> results
}

export interface ApiPaginationResponse<T> {
  links: PaginationLinks
  limit: number // the user specified limit
  size: number // the number of results (may be less than limit)
  start: number // the index of the first result
  results: T[]
}

export interface PostMetadata {
  postId: string
  title: string
  datePublished: Date
  description?: string
  coverImageSrc?: string
}

export interface Post {
  metadata: PostMetadata
  content: string
}

export class Markdown {
  metadata: Record<string, string>
  content: string

  constructor (fileText: string) {
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

  missingMetadataFields (requiredFields: string[]): string[] {
    const metadataFields = Object.keys(this.metadata)
    return requiredFields.filter((requiredField) => !metadataFields.includes(requiredField))
  }
}
