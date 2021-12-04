export default interface Booking {
  row: number
  column: number
  flight: {
    id: string
    arrivalTime: string
    departureTime: string
    arrivalLocation: {
      name: string
      IATACode: string
    }
    departureLocation: {
      name: string
      IATACode: string
    }
    plane: {
      agency: string
    }
  }
}
