export function command(data) {
    return (target) => {
        return class extends target {
            constructor(...args) {
                super(data, ...args);
            }
        }
    }
}

export class Command {
    constructor(data) {
        this.data = data;
    }

    exec(ctx, options = {}) {
        void [ctx, options];
    };
}