interface OpenReplayAPI {
    start(): void;
    stop(): void;
    setUserID(id: string): void;
    setUserAnonymousID(id: string): void;
    setMetadata(key: string, value: string): void;
    event(key: string, payload?: any, issue?: boolean): void;
}

interface Window {
    OpenReplay: OpenReplayAPI;
}
