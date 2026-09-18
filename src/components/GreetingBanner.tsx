import {useAllInjections, useOptionalInjection} from "@nonnajs/react";
import type {FeatureFlags} from "../services/feature-flags";
import {FEATURE_FLAGS} from "../services/feature-flags";
import type {Greeter} from "../services/greeter";
import {GREETER} from "../services/greeter";

/** Demonstrates useAllInjections() (multi: true) and useOptionalInjection() (never registered here). */
export function GreetingBanner() {
    const greeters = useAllInjections<Greeter>(GREETER);
    const flags = useOptionalInjection<FeatureFlags>(FEATURE_FLAGS);

    return (
        <section>
            {flags?.betaBanner && <p>🚧 Beta features enabled</p>}
            <ul>
                {greeters.map((greeter, index) => (
                    <li key={index}>{greeter.greet("Nonna")}</li>
                ))}
            </ul>
        </section>
    );
}
