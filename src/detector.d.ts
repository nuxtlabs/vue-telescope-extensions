declare const browser: any;
declare const isBrowser: boolean;
declare const isFirefox: boolean;
declare let vueInfo: any;
declare let resolveDetecting: {
    (): void;
    (value?: unknown): void;
};
declare const detecting: Promise<unknown>;
declare function handleMessage(): Promise<unknown>;
declare function detectVue(win: {
    postMessage: (arg0: {
        __vue_telemetry__: boolean;
        domain: string;
        hasVue: boolean;
    }) => void;
}): void;
declare function installScript(fn: {
    (win: {
        postMessage: (arg0: {
            __vue_telemetry__: boolean;
            domain: string;
            hasVue: boolean;
        }) => void;
    }): void;
    toString?: any;
}): void;
