import {useState} from "react";
import {AddUserForm} from "./components/AddUserForm";
import {DebugPanel} from "./components/DebugPanel";
import {GreetingBanner} from "./components/GreetingBanner";
import {UserList} from "./components/UserList";

export function App() {
    // Bumped by AddUserForm after it adds a user - UserRepository is a singleton and isn't
    // itself reactive, so re-rendering App (and therefore its un-memoized children) is what
    // makes UserList pick up the new entry.
    const [refreshToken, setRefreshToken] = useState(0);

    return (
        <main style={{fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "2rem auto", padding: "0 1rem"}}>
            <h1>Nonna + React</h1>
            <p>
                <code>@nonnajs/react</code> sample - a `&lt;NonnaProvider&gt;` wrapping this tree, and every component
                below resolving its own dependencies via hooks, with no prop-drilling.
            </p>
            <GreetingBanner />
            <UserList key={refreshToken} />
            <AddUserForm onUserAdded={() => setRefreshToken(token => token + 1)} />
            <DebugPanel />
        </main>
    );
}
