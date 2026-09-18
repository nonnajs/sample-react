import {useInjector} from "@nonnajs/react";
import {UserService} from "../services/user.service";

/** Demonstrates the useInjector() escape hatch - the raw Injector, for introspection/debug tooling. */
export function DebugPanel() {
    const injector = useInjector();
    const inspection = injector.inspect(UserService);

    if (!inspection) return null;

    return (
        <details>
            <summary>Debug: UserService registration</summary>
            <pre>
                {JSON.stringify(
                    {scope: inspection.scope, kind: inspection.kind, instantiated: inspection.instantiated},
                    null,
                    2,
                )}
            </pre>
        </details>
    );
}
