const fs = require('fs')
const puppeteer = require('puppeteer')
const lighthouse = require('lighthouse/lighthouse-core/fraggle-rock/api.js')

const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length; 

    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    //console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
      countStableSizeIterations++;
    else 
      countStableSizeIterations = 0; //reset the counter

    if(countStableSizeIterations >= minStableSizeIterations) {
      console.log("Fully Rendered Page: " + page.url());
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }  
};

async function captureReport() {
	const browser = await puppeteer.launch({args: ['--allow-no-sandbox-job', '--allow-sandbox-debugging', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox', '--display', '--ignore-certificate-errors', '--disable-storage-reset=true']});
	//const browser = await puppeteer.launch({"headless": false, args: ['--allow-no-sandbox-job', '--allow-sandbox-debugging', '--no-sandbox', '--ignore-certificate-errors', '--disable-storage-reset=true']});
	const page = await browser.newPage();
	const baseURL = "http://localhost/";
	
	await page.setViewport({"width":1920,"height":1080});
	await page.setDefaultTimeout(10000);
	
	const navigationPromise = page.waitForNavigation({timeout: 30000, waitUntil: ['domcontentloaded']});
	await page.goto(baseURL);
    await navigationPromise;

	
	
	
	
	
		
	const flow = await lighthouse.startFlow(page, {
		name: 'demoblaze',
		configContext: {
		  settingsOverrides: {
			throttling: {
			  rttMs: 40,
			  throughputKbps: 10240,
			  cpuSlowdownMultiplier: 1,
			  requestLatencyMs: 0,
			  downloadThroughputKbps: 0,
			  uploadThroughputKbps: 0
			},
			throttlingMethod: "simulate",
			screenEmulation: {
			  mobile: false,
			  width: 1920,
			  height: 1080,
			  deviceScaleFactor: 1,
			  disabled: false,
			},
			formFactor: "desktop",
			onlyCategories: ['performance'],
		  },
		},
	});

  	//================================NAVIGATE================================
    
	
	
	//================================PAGE_ACTIONS================================

	await page.waitForSelector(aboutUs);
	await flow.startTimespan({ stepName: 'Time taken for whole TestCase to run' });
		await flow.navigate(baseURL, {
		stepName: 'open main page'
		});
		console.log('main page is opened');
		
		await page.waitForSelector([href="http://localhost/tables"]);
		await page.click([href="http://localhost/tables"]);
		await page.waitForSelector([alt="living room table8"]);
		await page.click([alt="living room table8"]);
		await page.waitForSelector([class="button green-box ic-design"]);
		await page.click([class="button green-box ic-design"]);
		await page.waitForSelector([href="http://localhost/checkout"]);
		await page.click([href="http://localhost/checkout"]);
		const FullName = "Prakhar Yadav";
		const Address = "DLF phase 3";
		const PostalCode = "123456";
		const City = "Gurugram";
		const Country = "India - IN";
		const State = "Haryana";
		const Phone = "1223344556";
		const Email = "prakhar_yadav@epam.com";
		
		const FullNameLocator = "[name="cart_name"]";
		const AddressLocator = "[name="cart_address"]";
		const PostalCodeLocator = "[name="cart_postal"]";
		const CityLocator = "[name="cart_city"]";
		const CountryLocator = "[name="cart_country"]";
		const StateLocator = "[name="cart_state"]";
		const PhoneLocator = "[name="cart_phone"]";
		const EmailLocator = "[name="cart_email"]";
		
		await page.waitForSelector(FullNameLocator);
		await page.type(FullNameLocator, FullName);
		
		await page.waitForSelector(AddressLocator);
		await page.type(AddressLocator, Address);
		
		await page.waitForSelector(PostalCodeLocator);
		await page.type(PostalCodeLocator, PostalCode);
		
		await page.waitForSelector(CityLocator);
		await page.type(CityLocator, City);
		
		//await page.waitForSelector(CountryLocator);
		//await page.type(CountryLocator, Country);
		
		//await page.waitForSelector(StateLocator);
		//await page.type(StateLocator, State);
		
		await page.waitForSelector(PhoneLocator);
		await page.type(PhoneLocator, Phone);
		
		await page.waitForSelector(EmailLocator);
		await page.type(EmailLocator, Email);
		
		await page.waitForSelector([class="button green-box ic-design"]);
		await page.click([class="button green-box ic-design"]);
		
		await page.waitForSelector(h1.entry-title);
	await flow.endTimespan();
	console.log('TestCase is completed');

	//================================REPORTING================================
	const reportPath = __dirname + '/user-flow.report.html';
	//const reportPathJson = __dirname + '/user-flow.report.json';

	const report = flow.generateReport();
	//const reportJson = JSON.stringify(flow.getFlowResult()).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
	
	fs.writeFileSync(reportPath, report);
	//fs.writeFileSync(reportPathJson, reportJson);
	
    await browser.close();
}
captureReport();