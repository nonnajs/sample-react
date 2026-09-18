import "./__generated__/nonna-dependencies.generated";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Nonna} from "@nonnajs/di";
import {NonnaProvider} from "@nonnajs/react";
import {App} from "./App";
import {FormalGreeter, FriendlyGreeter, GREETER} from "./services/greeter";

async function bootstrap(): Promise<void> {
    // Configure and boot the container once, here, before the first render - never inside the
    // component tree (see @nonnajs/react's README for why NonnaProvider takes an already-built
    // Injector instead of a builder/promise).
    const injector = await Nonna.injector()
        .register({provide: GREETER, useClass: FriendlyGreeter, multi: true})
        .register({provide: GREETER, useClass: FormalGreeter, multi: true})
        .scan() // pulls in every @Injectable() class (UserRepository, UserService, LoggerService)
        .build();

    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error('Missing <div id="root"> in index.html');

    createRoot(rootElement).render(
        <StrictMode>
            <NonnaProvider injector={injector}>
                <App />
            </NonnaProvider>
        </StrictMode>,
    );
}

bootstrap().catch(console.error);
