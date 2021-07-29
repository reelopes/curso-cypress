/// <reference types="cypress" />

describe('Should test at API level', () => {
    let token

    before(() => {
        cy.getToken('r@r', 'r').then(tkn => {
            token = tkn
        }).then(() => {
            cy.request({
                method:'GET',
                url: 'https://barrigarest.wcaquino.me/reset',
                headers: {
                    Authorization: `JWT ${token} `
                }
            })
        })
    })

    beforeEach(() => {

    })

    it('Should create an account', () => {
            cy.request({
                method:'POST',
                url: 'https://barrigarest.wcaquino.me/contas',
                headers: {
                    Authorization: `JWT ${token} `
                    // Authorization: 'JWT ' + token
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

})