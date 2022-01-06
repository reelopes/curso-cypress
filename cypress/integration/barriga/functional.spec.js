/// <reference types="cypress" />

import loc from '../../support/locators.js'
import '../../support/commandsContas.js'

describe('Should test at functional level', () => {
    //Executa antes da execução do primeiro teste
    before(() => {
        cy.login('ree.lopes@hotmail.com', 'mudar@123')
        cy.resetApp()
    })

    it('Should Create An Account', () => {
        cy.acessarMenuContas()
        cy.inserirConta('Conta de teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    it('Should Update An Account', () => {
        cy.acessarMenuContas()
        cy.xpath(loc.CONTAS.XP_BTN_ALTERAR).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
    })

    it('Should Not Create An Account With The Same Name', () => {
        cy.acessarMenuContas()
        cy.inserirConta('Conta alterada')
        cy.get(loc.MESSAGE).should('contain', 'Request failed with status code 400')
    })
    
    it('Should Create A Transaction', () => {
        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.XP_BUSCA_ELEMENTO).should('exist')
    })

    it('Should Delete An Account', () => {
        cy.get('[data-test=menu-settings]').click()
        cy.get('[href="/contas"]').click()
        cy.xpath("//table//td[contains(., 'Conta alterada')]/..//i[@class='far fa-trash-alt']").click()
        cy.get('.toast-message').should('contain', 'Conta excluída com sucesso!')
    })

})