declare global {
    interface Window {
        Cypress: Cypress.Cypress;
        Peer: Peer;
    }
}

export default global;
