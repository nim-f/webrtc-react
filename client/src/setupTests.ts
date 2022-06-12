// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
global.setImmediate =
    global.setImmediate ||
    ((fn: (...args: any[]) => void, ...args: any) =>
        global.setTimeout(fn, 0, ...args));

const mediaDevicesMock = {
    enumerateDevices: jest.fn(),
    getUserMedia: jest.fn(Promise.resolve).mockReturnValue(
        new Promise((resolve) => {
            resolve({});
        })
    ),
};
// Object.defineProperty(window, "navigator", {
//     writable: true,
//     value: { mediaDevices: {} },
// });

// Object.defineProperty(navigator, "mediaDevices", {
//     writable: true,
//     value: mediaDevicesMock,
// });
// @ts-ignore
global.navigator.mediaDevices = mediaDevicesMock;
