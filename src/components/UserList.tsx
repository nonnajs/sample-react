import {useInjection} from "@nonnajs/react";
import {UserService} from "../services/user.service";

/**
 * Demonstrates useInjection(). `UserService` is a singleton, so this resolves the same instance
 * every render - React re-rendering this component (triggered by `App`'s `refreshToken` state
 * after `AddUserForm` adds a user) is what picks up new entries, since `UserRepository` itself
 * isn't reactive.
 */
export function UserList() {
    const userService = useInjection(UserService);
    const users = userService.getUsers();

    return (
        <section>
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} &lt;{user.email}&gt;
                    </li>
                ))}
            </ul>
        </section>
    );
}
