/// <reference types="Cypress" />
describe("Video chat", () => {
    it("shows streams from peers", () => {
        cy.visit("http://localhost:3000/");
        cy.window().then((win) => {
            // @ts-ignore
            win.Peer.prototype.call = cy.stub().returns({
                on: (_, callback) => {
                    navigator.mediaDevices
                        .getUserMedia({ video: true, audio: true })
                        .then((stream) => {
                            callback(stream);
                        });
                },
            });
        });
        cy.get("input").type("Anna");
        cy.get("button").click();
        cy.task("socket:connect");
        cy.url().then((url) => {
            console.log({ url });
            const roomId = url.split("/").reverse()[0];
            console.log({ roomId });
            cy.task("joinRoom", { roomId, peerId: "qwe", userName: "Test" });
        });

        cy.get(`[data-testid="peer-video"]`).should("have.length", 2);
    });
});
