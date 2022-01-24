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

    it.only('Should Update An Account', () => {
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


        // cy.request({
        //     method: 'PUT',
        //     url: '/contas/40977',
        //     headers: {
        //         Authorization: `JWT ${token} `
        //     },
        //     body: {
        //         nome: 'conta alterada via rest'
        //     }
        // }).as('response')

        // cy.get('@response').its('status').should('be.equal', 201)
    })

    it('Should Not Create An Account With The Same Name', () => {
    })

    it('Should Create A Transaction', () => {
    })

    it('Should Get Balance', () => {
    })

    it('Should Remove a Transaction', () => {
    })

})