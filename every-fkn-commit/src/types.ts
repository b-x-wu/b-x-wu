export interface Commit {
  url: string // html_url
  sha: string
  date: Date // author date
  author?: string // author login
  message: string
}
