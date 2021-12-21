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
    firstclassRowCount: number
    firstclassColumncount: number
    businessRowCount: number
    businessColumncount: number
    economyRowCount: number
    economyColumncount: number
  }
  bookedSeats: [
    {
      row: number
      column: number
      class: string
    },
  ]
  reviews: string[]
  rowCount: number
  columnCount: number
  businessRowCount: number
  businessColumncount: number
  firstclassRowCount: number
  firstclassColumncount: number
  economyRowCount: number
  economyColumncount: number
}
