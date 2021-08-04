/// <reference types="cypress" />

describe('Work with Iframe', () => {

    it('Deve preencher campo de texto', () => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
        cy.get('#frame1').then(iframe => {
            const body = iframe.contents().find('body')
            cy.wrap(body).find('#tfield').type('Funciona?')
            .should('have.value', 'Funciona?')
            
            //Limitacao do cypress: nao consegue gerenciar alerts originados de Iframes
            //Tratativa alternativa no teste seguinte
            cy.on('window:alert', msg => {
                expect(msg).to.be.equal('Alert Simples')
            })
            cy.wrap(body).find('#otherButton').click()
        })
    })
    
    it('Deve testar frame diretamente', () => {
        cy.visit('https://wcaquino.me/cypress/frame.html')
        cy.get('#otherButton').click()
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Click OK!')
        })
    })

})