import { chromium } from "playwright";
const browser=await chromium.launch({headless:true,channel:"chrome",args:["--disable-gpu"]});const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(10000);
page.on("pageerror",e=>console.error("PAGEERROR",e.message));page.on("console",m=>console.log("BROWSER",m.type(),m.text()));
await page.goto("http://127.0.0.1:4173",{waitUntil:"networkidle"});
await page.fill("#pin","123456");await page.fill("#pin-confirm","123456");await page.click("#lock-form button");
await page.waitForTimeout(1000);console.log(JSON.stringify({toast:await page.locator("#toast").textContent(),appClass:await page.locator("#app").getAttribute("class")}));
await page.waitForSelector("#home-view.active");await page.click("#new-btn");await page.click('[data-type="hypertension"]');
await page.fill('[data-key="patient_name"]',"测试居民");await page.fill('[data-key="archive_no"]',"00001234");await page.getByText("家庭",{exact:true}).click();
await page.screenshot({path:"test-mobile.png",fullPage:true});
console.log(JSON.stringify({title:await page.title(),view:await page.locator("#form-view").isVisible(),offlineReady:await page.evaluate(()=>"serviceWorker" in navigator)}));
await browser.close();

