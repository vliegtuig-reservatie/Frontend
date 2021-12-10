export default interface Review {
  id: string
  stars: number
  note: string
  flight?: {
    arrivalLocation: {
      IATACode: string
    }
    departureLocation: {
      IATACode: string
    }
    arrivalTime: string
    plane: {
      agency: string
    }
  }
}
