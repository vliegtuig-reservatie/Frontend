export default interface Review {
  id: string
  stars: number
  note: string
  flight?: {
    id: string
  }
}
