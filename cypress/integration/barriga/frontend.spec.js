/// <reference types="cypress" />

import loc from '../../support/locators.js'
import '../../support/commandsContas.js'
import buildEnv from '../../support/buildEnv.js'

describe('Should test at functional level', () => {
    //Executa após a finalização dos testes
    after(() => {
        cy.clearLocalStorage()
    })

    beforeEach(() => {
        buildEnv()
        cy.login('ree.lopes@hotmail.com', 'mudar@123')
        cy.get(loc.MENU.HOME).click()
        // cy.resetApp()
    })

    it('Should Create An Account', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 }
        }).as('saveConta')

        cy.acessarMenuContas()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            ]
        }).as('contasSave')

        cy.inserirConta('Conta de teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    it('Should Update An Account', () => {
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response: { id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1 }
        }).as('contas')

        cy.acessarMenuContas()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Carteira')).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
    })

    it('Should Not Create An Account With The Same Name', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { error: 'Já existe uma conta com esse nome!' },
            status: 400
        }).as('saveContaMesmoNome')

        cy.acessarMenuContas()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.MESSAGE).should('contain', 'Request failed with status code 400')
    })

    it('Should Create A Transaction', () => {
        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123', { force: true })
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Conta para movimentacoes')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
    })

    it('Should Get Balance', () => {
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        // cy.wait(1000)
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')


        cy.wait(1000)
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')
    })

    it('Should Remove a Transaction', () => {
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    })

    // it('Should Delete An Account', () => {
    //     cy.get(loc.MENU.SETTINGS).click()
    //     cy.get(loc.MENU.CONTAS).click()
    //     cy.xpath("//table//td[contains(., 'Conta alterada')]/..//i[@class='far fa-trash-alt']").click()
    //     cy.get('.toast-message').should('contain', 'Conta excluída com sucesso!')
    // })

})