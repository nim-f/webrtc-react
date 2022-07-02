/// <reference types="Cypress" />
describe("Text chat", () => {
    it("shows messages from peers", () => {
        cy.visit("http://localhost:3000/");
        cy.get("input").type("Anna");
        cy.get("button").click();
        cy.get("[data-testid='chat-button']").click();
        cy.task("socket:connect");
        cy.url().then((url) => {
            const roomId = url.split("/").reverse()[0];
            cy.task("joinRoom", { roomId, peerId: "qwe", userName: "Test" });
            cy.task("emit", {
                message: "send-message",
                roomId: roomId,
                messageData: {
                    content: "test message from cypress",
                    timestamp: new Date().getTime(),
                    author: "qwe",
                },
            });
            cy.get('[data-testid="chat"]').should(
                "contain.text",
                "test message from cypress"
            );
        });

        cy.get("textarea").type("Hello, Cypress!");
        cy.get(`[data-testid="send-msg-button"]`).click();
        cy.get('[data-testid="chat"]').should(
            "contain.text",
            "Hello, Cypress!"
        );
    });
});
