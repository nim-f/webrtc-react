/// <reference types="Cypress" />

describe("Video chat", () => {
    const peerId = "qwe";
    const userName = "Cypress";
    it("displays my own video stream", () => {
        cy.visit("http://localhost:3000");
        cy.get("input").type("Anna");
        cy.get("button").click();

        cy.get('[data-testid="peer-video"]').should("have.length", 1);
    });

    it("displays other peer's video stream", () => {
        cy.visit("http://localhost:3000");
        cy.get("input").type("Anna");
        cy.get("button").click();
        cy.window().then((win) => {
            // @ts-ignore
            win.Peer?.prototype.call = cy.stub().returns({
                on: (_, callback) => {
                    navigator.mediaDevices
                        .getUserMedia({ video: true, audio: true })
                        .then((stream) => {
                            callback(stream);
                        });
                },
            });
        });
        cy.task("connect");
        cy.url().then((url) => {
            const roomId = url.split("/").reverse()[0];
            cy.task("joinRoom", { roomId, peerId, userName });
        });
        cy.get('[data-testid="peer-video"]').should("have.length", 2);
    });
});
