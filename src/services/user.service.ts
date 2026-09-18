import {Inject, Injectable} from "@nonnajs/di";
import {LoggerService} from "./logger.service";
import type {User} from "./user.repository";
import {UserRepository} from "./user.repository";

@Injectable()
export class UserService {
    // Field injection (property injection) - new in @nonnajs/di. Unlike a constructor parameter,
    // a field always needs an explicit token; there's no AOT inference for it.
    @Inject(LoggerService)
    private readonly logger!: LoggerService;

    // Constructor injection - inferred automatically by @nonnajs/compiler (see "compile-deps").
    constructor(private readonly repository: UserRepository) {}

    getUsers(): User[] {
        return this.repository.findAll();
    }

    addUser(name: string, email: string): User {
        const user = this.repository.create(name, email);
        this.logger.log(`Created user "${user.name}" <${user.email}>`);
        return user;
    }
}
