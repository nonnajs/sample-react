import {Injectable, OnDestroy} from "@nonnajs/di";

@Injectable()
export class LoggerService implements OnDestroy {
    readonly logs: string[] = [];

    log(message: string): void {
        const entry = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.logs.push(entry);
        console.info(entry);
    }

    onDestroy(): void {
        this.log("LoggerService destroyed");
    }
}
