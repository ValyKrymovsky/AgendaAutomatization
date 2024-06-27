import { BrowserContext, LaunchOptions, Page, chromium, firefox } from "playwright/test";

const options: LaunchOptions = 
{
    headless: true,
    //args: ['--start-maximized']
} 

export const InvokeBrowser = () => 
{
    const browserType = process.env.BROWSER;
    switch (browserType)
    {
        case "chrome":
            return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        default:
            throw new Error("Set the proper browser!")
    }
}
