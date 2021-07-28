/// <reference types="cypress" />

describe('Esperas...', () => {
    //Executa antes da execução do primeiro teste
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })
    //Executa antes da execução de cada um dos testes
    beforeEach(() => {
        cy.reload()
    })

    it('Deve aguardar elemento estar disponivel', () => {
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo').should('exist')
        cy.get('#novoCampo').type('Funciona')
    })
    
    it('Deve fazer retries', () => {
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo')
            //.should('not.exist')
            .should('exist')
        })
        
        it('Uso do find', () => {
            cy.get('#buttonList').click()
            cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1')
            cy.get('#lista li')
            .should('contain', 'Item 2')
        })
        
        it('Uso do find com listDOM', () => {
            cy.get('#buttonListDOM').click()
            cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1')
            cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 2')
            //cy.get('#lista li')
            //    .should('contain', 'Item 2')
        })
        
        it('Uso do timeout', () => {
            
            // cy.get('#buttonListDOM').click()
            // cy.get('#lista li', {timeout: 5000})
            //     .should('contain', 'Item 2')
            
            // cy.get('#buttonListDOM').click()
            // cy.wait(5000)
            // cy.get('#lista li')
            //     .should('contain', 'Item 2')
            
            cy.get('#buttonListDOM').click()
            cy.get('#lista li')
            .should('have.length', 1)
            cy.get('#lista li')
            .should('have.length', 2)
            
            
        })
        
        it('Click retry', () => {
            cy.get('#buttonCount')
            .click()
            .click()
            .should('have.value', '111')
        })
        
        it.only('Should vs Then', () => {
            cy.get('#buttonListDOM').then($el => {
                // .should('have.length', 1)
                // console.log($el)
                expect($el).to.have.length(1)
                cy.get('#buttonList')
            })
        })

    })