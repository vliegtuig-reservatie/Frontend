export default interface Flight {
  departureTime: string
  arrivalTime: string
  departureLocation: {
    name: string
    IATACode: String
  }
  arrivalLocation: {
    name: string
    IATACode: String
  }
  stops: string[]
  plane: {
    id: string
    rowCount: number
    columncount: number
  }
  bookedSeats: [
    {
      row: number
      column: number
    },
  ]
  reviews: string[]
  rowCount: number
  columnCount: number
}
