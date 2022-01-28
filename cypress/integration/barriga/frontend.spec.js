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
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: { id: 975263, descricao: "dcwd", envolvido: "evef", observacao: null, tipo: "REC", data_transacao: "2022-01-27T03:00:00.000Z", data_pagamento: "2022-01-27T03:00:00.000Z", valor: "100.00", status: false, conta_id: 1045268, usuario_id: 12136, transferencia_id: null, parcelamento_id: null },
        }).as('saveTransacoes')

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                { "conta": "Conta para movimentacoes", "id": 975264, "descricao": "Movimentacao para exclusao", "envolvido": "AAA", "observacao": null, "tipo": "DESP", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 1046814, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta com movimentacao", "id": 975265, "descricao": "Movimentacao de conta", "envolvido": "BBB", "observacao": null, "tipo": "DESP", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 1046815, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 975266, "descricao": "Movimentacao 1, calculo saldo", "envolvido": "CCC", "observacao": null, "tipo": "REC", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "3500.00", "status": false, "conta_id": 1046816, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 975267, "descricao": "Movimentacao 2, calculo saldo", "envolvido": "DDD", "observacao": null, "tipo": "DESP", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "-1000.00", "status": true, "conta_id": 1046816, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 975268, "descricao": "Movimentacao 3, calculo saldo", "envolvido": "EEE", "observacao": null, "tipo": "REC", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "1534.00", "status": true, "conta_id": 1046816, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para extrato", "id": 975269, "descricao": "Movimentacao para extrato", "envolvido": "FFF", "observacao": null, "tipo": "DESP", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "-220.00", "status": true, "conta_id": 1046817, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para extrato", "id": 975233, "descricao": "Desc", "envolvido": "FFF", "observacao": null, "tipo": "DESP", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "123.00", "status": true, "conta_id": 1046817, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null }
            ]
        }).as('extrato')

        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123', { force: true })
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Banco')
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