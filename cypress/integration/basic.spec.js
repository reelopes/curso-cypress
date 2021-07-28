/// <reference types = "cypress" />

describe('Cypress basics', () => {
    it.only('Should visit a page and assert title', () => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
        //cy.pause()
        cy.title().should('be.equal', 'Campo de Treinamento')
        //cy.title().debug()
        cy.title()
            .should('be.equal', 'Campo de Treinamento')
            .and('contain', 'Campo') //ou should de novo

        let syncTitle

        // jeito 1 de pegar o title e usa-lo pra preencher campo
        cy.title().then(title => {
            console.log(title)

            cy.get('#formNome').type(title)
            syncTitle = title
        })

        // jeito 2 de pegar o title e usa-lo pra preencher campo (não da pra usar type direto por problemas de sincronismo entre o tempo de execução da funcao e a definição da variavel)
        cy.get('[data-cy=dataSobrenome]').then($el => {
            $el.val(syncTitle)
        })

        // jeito 3 de pegar o title e usa-lo pra preencher campo (mesmo acima mas com obeto cypress o que gera log)
        cy.get('#elementosForm\\:sugestoes').then($el => {
            cy.wrap($el).type(syncTitle)
        })
        
        
    })

    it('Should find and interact with an element', () => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
        
        cy.get('#buttonSimple')
        .click()
        .should('have.value', 'Obrigado!')

    })
})