/**
 * Not decorated with @Injectable() on purpose: these two are registered explicitly (multi: true)
 * in main.tsx instead of being picked up by the decorator scan, to show that both registration
 * styles compose in the same injector.
 */
export interface Greeter {
    greet(name: string): string;
}

export const GREETER = Symbol("GREETER");

export class FriendlyGreeter implements Greeter {
    greet(name: string): string {
        return `Hey there, ${name}! 👋`;
    }
}

export class FormalGreeter implements Greeter {
    greet(name: string): string {
        return `Good day, ${name}.`;
    }
}
