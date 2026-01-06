export type FnParams<Fn extends (...args: any) => any> = Parameters<Fn>[0]
