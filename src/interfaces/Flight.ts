export default interface Flight {
  departureTime: string
  arrivalTime: string
  departureLocation: string
  arrivalLocation: string
  stops: string[]
  plane: {
    id: string
    rowCount: number
    columncount: number
  }
  bookedSeats: string[]
  reviews: string[]
}
