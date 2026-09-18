import {afterEach, beforeEach, describe, it} from "node:test";
import assert from "node:assert/strict";
import {createElement, act} from "react";
import {createRoot, type Root} from "react-dom/client";
import {fireEvent} from "@testing-library/react";
import {Injector, Nonna} from "@nonnajs/di";
import {NonnaProvider} from "@nonnajs/react";

import "../src/__generated__/nonna-dependencies.generated";
import {App} from "../src/App";
import {LoggerService} from "../src/services/logger.service";
import {FormalGreeter, FriendlyGreeter, GREETER} from "../src/services/greeter";

(globalThis as unknown as {IS_REACT_ACT_ENVIRONMENT: boolean}).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement | null = null;
let root: Root | null = null;

beforeEach(() => {
    (globalThis as unknown as {IS_REACT_ACT_ENVIRONMENT: boolean}).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(async () => {
    if (root) {
        await act(async () => {
            root?.unmount();
        });
        root = null;
    }
    container?.remove();
    container = null;
});

async function renderApp(): Promise<Injector> {
    const injector = await Nonna.injector()
        .register({provide: GREETER, useClass: FriendlyGreeter, multi: true})
        .register({provide: GREETER, useClass: FormalGreeter, multi: true})
        .scan()
        .build();

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
        root?.render(createElement(NonnaProvider, {injector}, createElement(App, null)));
    });

    return injector;
}

describe("Sample React App - @nonnajs/react", () => {
    it("renders the seeded users from UserRepository via useInjection(UserService)", async () => {
        await renderApp();
        assert.ok(container?.textContent?.includes("Alice"));
        assert.ok(container?.textContent?.includes("Bob"));
    });

    it("renders both multi-provider greetings via useAllInjections(GREETER)", async () => {
        await renderApp();
        assert.ok(container?.textContent?.includes("Hey there, Nonna"));
        assert.ok(container?.textContent?.includes("Good day, Nonna"));
    });

    it("does not render the beta banner - FEATURE_FLAGS is never registered (useOptionalInjection)", async () => {
        await renderApp();
        assert.equal(container?.textContent?.includes("Beta features enabled"), false);
    });

    it("adding a user via the form updates the list, and logs through the field-injected LoggerService", async () => {
        const injector = await renderApp();

        const nameInput = container?.querySelector('input[placeholder="Name"]') as HTMLInputElement;
        const emailInput = container?.querySelector('input[placeholder="Email"]') as HTMLInputElement;
        const form = container?.querySelector("form") as HTMLFormElement;

        await act(async () => {
            fireEvent.change(nameInput, {target: {value: "Charlie"}});
            fireEvent.change(emailInput, {target: {value: "charlie@example.com"}});
            fireEvent.submit(form);
        });

        assert.ok(container?.textContent?.includes("Charlie"));

        const logger = injector.get(LoggerService);
        assert.ok(logger.logs.some((entry) => entry.includes("Charlie")));
    });
});

