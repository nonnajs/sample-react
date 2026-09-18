import type {FormEvent} from "react";
import {useState} from "react";
import {useInjection} from "@nonnajs/react";
import {UserService} from "../services/user.service";

export interface AddUserFormProps {
    onUserAdded: () => void;
}

/** Also resolves UserService via useInjection() - the same singleton UserList reads, no prop-drilling needed. */
export function AddUserForm({onUserAdded}: AddUserFormProps) {
    const userService = useInjection(UserService);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (!name || !email) return;
        userService.addUser(name, email);
        setName("");
        setEmail("");
        onUserAdded();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add user</h2>
            <input placeholder="Name" value={name} onChange={event => setName(event.target.value)} />
            <input placeholder="Email" value={email} onChange={event => setEmail(event.target.value)} />
            <button type="submit">Add</button>
        </form>
    );
}
