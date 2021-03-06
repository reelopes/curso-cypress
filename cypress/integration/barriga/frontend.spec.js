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
            response: 'fixture:movimentacaoSalva'
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

        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 975266,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2022-01-27T03:00:00.000Z",
                "data_pagamento": "2022-01-27T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 1046816,
                "usuario_id": 1,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        }).as('transacoes')

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 975266,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2022-01-27T03:00:00.000Z",
                "data_pagamento": "2022-01-27T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 1046816,
                "usuario_id": 1,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [{
                conta_id: 999,
                conta: 'Carteira',
                saldo: '4034.00'
            },
            {
                conta_id: 9909,
                conta: 'Banco',
                saldo: '10000000.00'
            }]
        }).as('saldoFinal')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '4.034,00')
    })

    it('Should Remove a Transaction', () => {
        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            response: {},
            status: 204
        }).as('del')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    })

    it('Should Validate Data Sent to Create An Account', () => {

        const reqStub = cy.stub()

        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            // modo 2 de validar
            // onRequest: req => {
            //     console.log(req);
            //     expect(req.request.body.nome).to.be.empty
            //     expect(req.request.headers).to.have.property('Authorization')
            // }
            onRequest: reqStub
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

        cy.inserirConta('{CONTROL}')
        // modo 1 de validar
        // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
        // modo 3 de validar
        cy.wait('@saveConta').then(() => {
            console.log(reqStub.args[0][0]);
            expect(reqStub.args[0][0].request.body.nome).to.be.empty
            expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        })
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })

    it('Should Test Colors', () => {
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                { "conta": "Conta para movimentacoes", "id": 975264, "descricao": "Receita Paga", "envolvido": "AAA", "observacao": null, "tipo": "REC", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 1046814, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta com movimentacao", "id": 975265, "descricao": "Receita Pendente", "envolvido": "BBB", "observacao": null, "tipo": "REC", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "-1500.00", "status": false, "conta_id": 1046815, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 975266, "descricao": "Despesa Paga", "envolvido": "CCC", "observacao": null, "tipo": "DESP", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "3500.00", "status": true, "conta_id": 1046816, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 975267, "descricao": "Despesa Pendente", "envolvido": "DDD", "observacao": null, "tipo": "DESP", "data_transacao": "2022-01-27T03:00:00.000Z", "data_pagamento": "2022-01-27T03:00:00.000Z", "valor": "-1000.00", "status": false, "conta_id": 1046816, "usuario_id": 12136, "transferencia_id": null, "parcelamento_id": null },
            ]
        }).as('extrato')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita Paga')).should('have.class', "receitaPaga")
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita Pendente')).should('have.class', "receitaPendente")
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa Paga')).should('have.class', "despesaPaga")
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa Pendente')).should('have.class', "despesaPendente")
    })

    it('Should Test The Responsiveness', () => {
        cy.get(loc.MENU.HOME).should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get(loc.MENU.HOME).should('exist')
            .and('be.not.visible')
        cy.viewport('iphone-5')
        cy.get(loc.MENU.HOME).should('exist')
            .and('be.not.visible')
        cy.viewport('ipad-2')
        cy.get(loc.MENU.HOME).should('exist')
            .and('be.visible')
    })
})