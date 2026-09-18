# `@nonnajs/sample-react`

Sample Vite + React application demonstrating [`@nonnajs/react`](../../react) - `<NonnaProvider>` plus `useInjection()`/`useOptionalInjection()`/`useAllInjections()`/`useInjector()` over [`@nonnajs/di`](../../di).

## Dependency Injection At A Glance

`main.tsx` builds the injector once, before the first render, and wraps the tree in `<NonnaProvider>`:

```tsx
const injector = await Nonna.injector()
    .register({provide: GREETER, useClass: FriendlyGreeter, multi: true})
    .register({provide: GREETER, useClass: FormalGreeter, multi: true})
    .scan()
    .build();

createRoot(document.getElementById("root")!).render(
    <NonnaProvider injector={injector}>
        <App />
    </NonnaProvider>,
);
```

Any component below it resolves services with `useInjection()` - no prop-drilling, and it's the
same singleton every render:

```tsx
export function UserList() {
    const userService = useInjection(UserService);
    const users = userService.getUsers();
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.name} &lt;{user.email}&gt;
                </li>
            ))}
        </ul>
    );
}
```

`UserService` itself mixes constructor injection (`UserRepository`, inferred by `@nonnajs/compiler`)
with field injection (`@Inject(LoggerService)`):

```ts
@Injectable()
export class UserService {
    @Inject(LoggerService)
    private readonly logger!: LoggerService;

    constructor(private readonly repository: UserRepository) {}

    addUser(name: string, email: string): User {
        const user = this.repository.create(name, email);
        this.logger.log(`Created user "${user.name}" <${user.email}>`);
        return user;
    }
}
```

## Features Demonstrated

-   **`<NonnaProvider>`**: wraps the app once, in `main.tsx`, around an already-`await Nonna.injector()...build()`ed `Injector` - no async loading state inside the component tree.
-   **`useInjection(UserService)`**: `UserList` and `AddUserForm` both resolve the same singleton independently - no prop-drilling.
-   **`useAllInjections(GREETER)`**: `GreetingBanner` resolves two `multi: true` providers (`FriendlyGreeter`, `FormalGreeter`), registered explicitly in `main.tsx` rather than via `@Injectable()` - showing both registration styles composing in the same injector.
-   **`useOptionalInjection(FEATURE_FLAGS)`**: `GreetingBanner` also resolves a token that's never registered anywhere in this sample, to show the graceful `undefined` fallback instead of a thrown `ProviderNotFoundError`.
-   **`useInjector()`**: `DebugPanel` reads the raw `Injector` and calls `injector.inspect(UserService)` for a small debug view.
-   **Field injection**: `UserService.logger` is populated via `@Inject(LoggerService)` on a class field, not a constructor parameter.
-   **AOT Dependency Compilation**: `@nonnajs/compiler` infers `UserService`'s constructor dependency (`UserRepository`) automatically at build/test time (`pnpm compile-deps`).
-   **`OnDestroy`**: `LoggerService` logs its own teardown - wire `await injector.destroy()` into your app's own unmount/HMR-dispose path if you need this in a real app.

## A Note On Bundling `@nonnajs/di` For The Browser

`@nonnajs/di`'s default request-scope storage (`AsyncLocalStorage`) and `injector.loadBeans()` are Node-only features - this sample uses neither (no `runInScope()`/request-scoped providers, `.scan()` instead of `loadBeans()`). But `@nonnajs/di`'s published bundle still statically imports the underlying Node builtins (`async_hooks`, `fs/promises`, `path`, `url`), which a real browser bundler like Rollup can't resolve on its own. `vite.config.ts` adds [`@nonnajs/vite-plugin`](../../vite-plugin)'s `nonna()` plugin, which aliases those four specifiers to small browser-safe shims - see that package's README for exactly what each one stands in for and why it's safe here. If you need real request scoping in a browser app, supply your own `ContextStorage` via `Nonna.injector().withContextStorage(...)` instead of relying on the shimmed default.

## Running the Sample

```sh
# Compile dependencies once (also runs automatically before dev/build/test)
pnpm compile-deps

# Start the Vite dev server
pnpm dev

# Type-check + production build
pnpm build

# Run the test suite (renders the app with @testing-library/react + jsdom)
pnpm test
```
