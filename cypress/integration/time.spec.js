/// <reference types="cypress" />

describe('Work with alert', () => {
    //Executa antes da execução do primeiro teste
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    it('Going back to past', () => {
        cy.get('#buttonNow').click()
        cy.get('#resultado > span').should('contain', new Date().getDate())
        
        // cy.clock()
        // cy.get('#buttonNow').click()
        // cy.get('#resultado > span').should('contain', '31/12/1969')
        
        const dt = new Date(2012, 3, 10, 15, 23, 50) // yyyy, MM (inicia em 0), dd, hh, mm, ss
        cy.clock(dt.getTime())
        cy.get('#buttonNow').click()
        cy.get('#resultado > span').should('contain', '10/04/2012')
        
    })

    it('Goes to the future', () => {
        cy.get('buttonTimePassed').click()
        cy.get('#resultado > span').should('contain', '15731')
        cy.get('#resultado > span').invoke('text').should('gt', 1573179785)
    })

})
