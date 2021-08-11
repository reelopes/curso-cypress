/// <reference types="cypress" />

describe('Work with basic elements', () => {
    //Executa antes da execução do primeiro teste
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })
    //Executa antes da execução de cada um dos testes
    beforeEach(() => {
        cy.reload()
    })
    
    it('Text', () => {
        cy.get('body').should('contain', 'Cuidado')
        cy.get('span').should('contain', 'Cuidado')
        cy.get('.facilAchar').should('have.text', 'Cuidado onde clica, muitas armadilhas...')
    })
    

})