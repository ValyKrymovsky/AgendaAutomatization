export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chrome" | "firefox" | "webkit",
            ENV: "DEV" | "PRE" | "TEST",
            BASEURL: string,
            HEAD: "false" | "true",
            PASSWORD: string,
            EMAIL: string
        }
    }
}