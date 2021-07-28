/// <reference types="cypress" />

it('An external test...', () => {

})

describe.skip('Should group tests...', () => {
    describe('Should group more specific tests', () => {
        it.skip('A specific test...', () => {

        })
    })

    describe('Should group more specific tests 2', () => {
        it('A specific test 2...', () => {
            
        })
    })
    
    it('An internal test...', () => {
    })
})