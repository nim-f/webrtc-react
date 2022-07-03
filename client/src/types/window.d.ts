declare global {
    interface AUTWindow {
        Peer: Peer;
    }
    interface Window {
        Cypress: Cypress.Cypress;
        Peer: Peer;
    }
}

export default global;
