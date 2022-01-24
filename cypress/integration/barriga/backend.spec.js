/// <reference types="cypress" />

describe('Should test at API level', () => {
    let token

    before(() => {
        cy.getToken('r@r', 'r').then(tkn => {
            token = tkn
        })
    })

    beforeEach(() => {
        cy.resetRest(token)
    })

    it('Should create an account', () => {
        cy.request({
            method: 'POST',
            url: '/contas',
            headers: {
                Authorization: `JWT ${token} `
            },
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
    })

    it('Should Update An Account', () => {
        cy.request({
            method: 'GET',
            url: '/contas',
            headers: {
                Authorization: `JWT ${token} `
            },
            qs: { nome: 'Conta para alterar' }
        }).then(res => {
            cy.request({
                method: 'PUT',
                url: `/contas/${res.body[0].id}`,
                headers: {
                    Authorization: `JWT ${token} `
                },
                body: {
                    nome: 'conta alterada via rest'
                }
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 200)
        })
    })

    it.only('Should Not Create An Account With The Same Name', () => {
        cy.request({
            method: 'POST',
            url: '/contas',
            headers: {
                Authorization: `JWT ${token} `
            },
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    })

    it('Should Create A Transaction', () => {
    })

    it('Should Get Balance', () => {
    })

    it('Should Remove a Transaction', () => {
    })

})