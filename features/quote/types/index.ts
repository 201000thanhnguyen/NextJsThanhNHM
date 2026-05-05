export type Quote = {
  id: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
}

export type QuoteCreateInput = {
  content: string
  author: string
}

export type QuoteUpdateInput = Partial<QuoteCreateInput>

