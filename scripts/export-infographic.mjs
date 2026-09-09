import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1.5,reducedMotion:'reduce'});
  await page.goto(`${process.env.MUFU_PREVIEW||'http://127.0.0.1:4177'}/infografia.html`);
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'.print-actions{display:none!important}.infographic{padding:50px 65px!important;background:#e4e6e1}'});
  await page.locator('.infographic').screenshot({path:'medios/mufu-infografia.png'});
  console.log('Exported medios/mufu-infografia.png from the same accessible, sourced HTML.');
}finally{await browser.close();}
