import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const pages=['index.html','atlas.html','coleccion.html','archivo.html','infografia.html','ficha-02.html'];
for(const width of [375,768,1440,1920]){
  test(`${width}px pages render with local assets, no horizontal overflow or accessibility violations`,async({page})=>{
    await page.setViewportSize({width,height:1000});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
    for(const file of pages){
      const response=await page.goto(`/${file}`);expect(response.status()).toBe(200);
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(async img=>{img.loading='eager';try{await img.decode();}catch{}}));});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file).toBe(true);
      const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>i.src));expect(broken,file).toEqual([]);
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),file).toEqual([]);
      await page.screenshot({path:`output/${file.replace('.html','')}-${width}.png`,fullPage:file!=='index.html'});
    }
    expect(errors).toEqual([]);
  });
}
test('collection filters, accents, empty state, shareable URL and dialog focus',async({page})=>{
  await page.goto('/coleccion.html');await expect(page.locator('.object-card:visible')).toHaveCount(53);
  await page.locator('#record-status').selectOption('bonus');await expect(page.locator('.object-card:visible')).toHaveCount(2);
  await page.reload();await expect(page.locator('.object-card:visible')).toHaveCount(2);
  await page.getByRole('button',{name:'Restablecer filtros'}).click();
  await page.locator('#search').fill('obsidiana');await expect(page.locator('.object-card:visible')).toHaveCount(1);
  const trigger=page.locator('[data-inspect]:visible');await trigger.click();await expect(page.locator('dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toContainText('Obsidiana');
  const a11y=await new AxeBuilder({page}).include('dialog').withTags(['wcag2a','wcag2aa']).analyze();expect(a11y.violations).toEqual([]);
  await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();await expect(trigger).toBeFocused();
  await page.locator('#search').fill('zzzzzzzz');await expect(page.locator('#empty-results')).toBeVisible();
  await page.locator('[data-reset]').click();await expect(page.locator('.object-card:visible')).toHaveCount(53);
  await page.locator('#search').fill('solis');await expect(page.locator('.object-card:visible')).toHaveCount(4);
});
test('atlas filters, connection selection and light experiment remain functional on mobile',async({page})=>{
  await page.setViewportSize({width:375,height:900});await page.goto('/atlas.html?hilo=tiempo#n-voyager');
  await expect(page.locator('#node-title')).toHaveText('El Disco de Oro');
  await expect(page.locator('[data-thread=tiempo]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.network-lines path')).toHaveCount(4);
  expect(await page.locator('.network-lines').evaluate(s=>s.getBoundingClientRect().height)).toBeGreaterThan(300);
  await page.locator('[data-node=apertura]').click();await expect(page.locator('#node-title')).toHaveText('La cita');
  await page.locator('[data-thread=all]').click();await expect(page.locator('.network-lines path')).toHaveCount(21);
  await page.locator('#light').fill('0');await expect(page.locator('#light-value')).toHaveText('0 %');
  await expect(page.locator('#light-image')).toHaveCSS('opacity','0');
  await page.locator('#light').fill('100');await expect(page.locator('#light-image')).toHaveCSS('opacity','1');
  await page.goto('/atlas.html?hilo=tiempo');
  await expect(page.locator('[data-thread=tiempo]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-node][aria-pressed=true]')).not.toHaveClass(/not-in-thread/);
  await page.locator('[data-node=leia]').click();await expect(page.locator('[data-thread=all]')).toHaveAttribute('aria-pressed','true');
});
test('questions explain unknowns and original records are available without JavaScript',async({page,browser})=>{
  await page.goto('/archivo.html');await page.locator('#question-query').fill('pepper');
  await expect(page.locator('[data-question]:visible')).toHaveCount(1);
  await page.locator('#question-query').fill('zzzzzz');await expect(page.locator('#question-empty')).toBeVisible();
  const context=await browser.newContext({javaScriptEnabled:false});const offline=await context.newPage();
  await offline.goto('http://127.0.0.1:4177/coleccion.html');await expect(offline.locator('.object-card')).toHaveCount(53);
  await offline.locator('.object-photo').first().click();await expect(offline.locator('.pieza-l')).toHaveCount(4);await context.close();
});
test('scheduled date does not claim a physical opening',async({page})=>{
  await page.clock.install({time:new Date('2047-09-05T12:56:00Z')});await page.goto('/index.html');
  await expect(page.locator('#estado-lab')).toHaveText('Fecha cumplida');await expect(page.locator('#cuenta-lab')).toContainText('falta documentar');
});
test('opening film has visible original pixels and play/pause control',async({page})=>{
  await page.goto('/index.html');await page.locator('#hero-play').click();
  await expect(page.locator('#hero-play')).toHaveAttribute('aria-pressed','true');
  await expect.poll(()=>page.locator('#hero-film').evaluate(v=>v.currentTime)).toBeGreaterThan(0.1);
  const visible=await page.locator('#hero-film').evaluate(v=>{const c=document.createElement('canvas');c.width=160;c.height=90;const ctx=c.getContext('2d');ctx.drawImage(v,0,0,160,90);const d=ctx.getImageData(0,0,160,90).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]+d[i+1]+d[i+2]>60)n++;return n;});
  expect(visible).toBeGreaterThan(50);
  await page.locator('#hero-play').click();await expect(page.locator('#hero-play')).toHaveAttribute('aria-pressed','false');
});
test('short mobile viewport keeps navigation and the next section visible',async({page})=>{
  await page.setViewportSize({width:375,height:667});await page.goto('/index.html');
  const bottom=await page.locator('#portada').evaluate(e=>e.getBoundingClientRect().bottom);expect(bottom).toBeLessThan(667);
  await expect(page.locator('#hero-play')).toBeInViewport();
  await page.screenshot({path:'output/index-short-mobile.png'});
});
