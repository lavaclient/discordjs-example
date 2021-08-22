export class Command {
    constructor(data) {
        this.data = data;
    }

    exec(ctx, options = {}) {
        void [ctx, options];
    };
}