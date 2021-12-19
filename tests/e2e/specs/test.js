// https://docs.cypress.io/api/introduction/api.html
import cy from "cypress"

describe('/', () => {
  it('Visits the dashboard and checks if it contains Flights', () => {
    cy.visit('/')
    cy.contains('h1', 'Flights')
  })
})
