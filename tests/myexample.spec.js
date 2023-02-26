const playwright = require('playwright');

let page, browser, context

const selectors = {
  username: 'input[name="username"]',
  password: 'input[name="password"]',
  loginBtn: 'input[value="Login"]',
  errorMess: '.messages',
  loginMenu: '//div[@id="MenuContent"]/a[2]'
}

const urls = {
  baseUrl: 'https://petstore.octoperf.com/actions/Catalog.action',
  signInUrl: 'https://petstore.octoperf.com/actions/Account.action?signonForm='
}

const credentials = {
  login: 'appsany',
  password: 'j2ee'
}

describe('authenticationtest:login', () => {
  beforeEach(async function() {
    browser = await playwright.firefox.launch({
      headless: false,
      slowMo: 2000
    });
      
    context = await browser.newContext()
    page = await context.newPage()
  })

  afterEach(async function() {
    //await page.screenshot({ path: `schreenshots/${this.currentTest.title.replace(/\s+/g, '_')}.png` })
    await browser.close()
  })

  
  test('has title', async () => {
    await page.goto(urls.baseUrl);
  
    // Expect a title "to contain" a substring.
    await expect(page).toMatchTitle(/JPetStore Demo/);
  });
  
  test('check sign in link', async () => {
    await page.goto(urls.baseUrl);
  
    // Click a sign in link
    await page.getByRole('link', {name: "Sign In" }).click();
  
    // Expects the URL for sign in page
    await expect(page).toMatchURL(/.*signonForm=/);
  });
  
  test('try to login with default credentions', async () => {
    await page.goto(urls.signInUrl);
  
    // Click login with no filled login/password
    await page.locator(selectors.loginBtn).click();
  
    // get menu content
    const loginmenu = await page.locator(selectors.loginMenu).textContent();
    // Check sign in 
    expect(loginmenu).toEqual('Sign In')
  });
  
  
  test('try to login with wrong credentions - check error', async () => {
    await page.goto(urls.signInUrl);
  
    // Input incorrect credentions
    await page.locator(selectors.username).fill('badusername');
    await page.locator(selectors.password).fill('badpassword');
  
    // Click login with no filled login/password
    await page.locator(selectors.loginBtn).click();
  
    //get error
    const errormessage = await page.locator(selectors.errorMess).textContent();
    // check error
    expect(errormessage).toEqual("Invalid username or password.  Signon failed.")
  
    // get menu content
    const loginmenu = await page.locator(selectors.loginMenu).textContent();
    // Check sign in 
    expect(loginmenu).toEqual('Sign In')
  });
  
  test('try to login with correct credentions', async () => {
    await page.goto(urls.signInUrl);
  
    // Input incorrect credentions
    await page.locator(selectors.username).fill(credentials.login);
    await page.locator(selectors.password).fill(credentials.password);
  
    // Click login with no filled login/password
    await page.locator(selectors.loginBtn).click();
  
    // get menu content
    const loginmenu = await page.locator(selectors.loginMenu).textContent();
    // Check sign in 
    expect(loginmenu).toEqual('Sign Out')
  });
})
