import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {learningConnections} from '../../data/learning.mjs';
const pages=['index.html','atlas.html','infografias.html','coleccion.html','archivo.html','infografia.html','ficha-02.html','404.html'];
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
      await page.evaluate(()=>scrollTo(0,500));
      await expect(page.locator('.museum-header')).toBeInViewport();
      await page.evaluate(()=>scrollTo(0,0));
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),file).toEqual([]);
      await page.screenshot({path:`output/${file.replace('.html','')}-${width}.png`,fullPage:file!=='index.html'});
    }
    expect(errors).toEqual([]);
  });
}
for(const width of [375,1440]){
  test(`${width}px navigation keeps identical labels, geometry and current section across pages`,async({page})=>{
    await page.setViewportSize({width,height:900});
    let geometry;
    for(const file of [...pages,'ficha.html']){
      await page.goto(`/${file}`);await page.evaluate(()=>document.fonts.ready);
      const nav=page.locator('.museum-header nav');
      await expect(nav.locator('a')).toHaveText(['El trimestre','Atlas','53 objetos','Infografías','Archivo','Visita']);
      const boxes=await page.locator('.museum-header,.museum-header>a,.museum-header nav a,.index-toggle').evaluateAll(elements=>elements.map(el=>{
        const {x,y,width,height}=el.getBoundingClientRect();
        return [x,y,width,height].map(Math.round);
      }));
      if(!geometry)geometry=boxes;else expect(boxes,file).toEqual(geometry);
      await page.getByRole('button',{name:'Abrir índice del museo'}).click();
      await expect(page.locator('#museum-index nav b')).toHaveText(['El trimestre','Atlas','53 objetos','Infografías','Archivo','Visita']);
      const active=file.startsWith('ficha')?'coleccion.html':file==='infografia.html'?'infografias.html':file;
      for(const selector of ['.museum-header nav','#museum-index nav']){
        const current=page.locator(`${selector} [aria-current]`);
        if(file==='404.html')await expect(current).toHaveCount(0);
        else await expect(current).toHaveAttribute('href',active);
      }
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button',{name:'Abrir índice del museo'})).toBeFocused();
      await page.screenshot({path:`output/navigation-${file.replace('.html','')}-${width}.png`});
    }
    await page.emulateMedia({media:'print'});
    await expect(page.locator('.museum-header')).not.toBeVisible();
  });
}
test('collection filters, accents, empty state, shareable URL and dialog focus',async({page})=>{
  await page.goto('/coleccion.html');await expect(page.locator('.object-card:visible')).toHaveCount(53);
  await page.locator('#record-status').selectOption('bonus');await expect(page.locator('.object-card:visible')).toHaveCount(2);
  await page.reload();await expect(page.locator('.object-card:visible')).toHaveCount(2);
  await page.getByRole('button',{name:'Restablecer filtros'}).click();
  await page.locator('#search').fill('obsidiana');await expect(page.locator('.object-card:visible')).toHaveCount(1);
  const trigger=page.locator('[data-inspect]:visible');await trigger.click();await expect(page.locator('#record-dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toContainText('Obsidiana');
  const a11y=await new AxeBuilder({page}).include('dialog').withTags(['wcag2a','wcag2aa']).analyze();expect(a11y.violations).toEqual([]);
  await page.keyboard.press('Escape');await expect(page.locator('#record-dialog')).not.toBeVisible();await expect(trigger).toBeFocused();
  await page.locator('#search').fill('zzzzzzzz');await expect(page.locator('#empty-results')).toBeVisible();
  await page.locator('[data-reset]').click();await expect(page.locator('.object-card:visible')).toHaveCount(53);
  await page.locator('#search').fill('solis');await expect(page.locator('.object-card:visible')).toHaveCount(4);
});
test('shared navigation recovers from a nested missing page and reaches the visit section',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('/sala/inexistente');
  expect(response.status()).toBe(404);
  await expect(page.locator('.museum-header')).toHaveCSS('position','sticky');
  await page.locator('.museum-header nav').getByRole('link',{name:'Infografías',exact:true}).click();
  await expect(page).toHaveURL(/\/infografias.html$/);
  await page.getByRole('button',{name:'Abrir índice del museo'}).click();
  await page.locator('#museum-index nav').getByRole('link',{name:/Visita/}).click();
  await expect(page).toHaveURL(/\/index.html#visita$/);
  await expect(page.locator('#visita')).toBeInViewport();
  for(const selector of ['.museum-header nav','#museum-index nav']){
    await expect(page.locator(`${selector} [aria-current]`)).toHaveAttribute('href','index.html#visita');
  }
  await page.locator('.museum-header nav').getByRole('link',{name:'El trimestre',exact:true}).click();
  await expect(page.locator('.museum-header nav [aria-current]')).toHaveAttribute('href','index.html');
  await page.goBack();
  await expect(page.locator('.museum-header nav [aria-current]')).toHaveAttribute('href','index.html#visita');
  expect(errors).toEqual([]);
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
  await page.locator('[data-node=leia]').click();await expect(page.locator('[data-thread=tiempo]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-node=curar]').click();await expect(page.locator('[data-thread=all]')).toHaveAttribute('aria-pressed','true');
});
test('questions explain unknowns and original records are available without JavaScript',async({page,browser})=>{
  await page.goto('/archivo.html');await page.locator('#question-query').fill('pepper');
  await expect(page.locator('[data-question]:visible')).toHaveCount(3);
  await expect(page.locator('[data-question]:visible').filter({hasText:'¿Pepper es un holograma?'})).toBeVisible();
  await expect(page.locator('[data-question]:visible').filter({hasText:'¿Qué aportan Logan’s Run y Star Wars a esta conexión?'})).toBeVisible();
  await page.locator('#question-query').fill('zzzzzz');await expect(page.locator('#question-empty')).toBeVisible();
  const context=await browser.newContext({javaScriptEnabled:false});const offline=await context.newPage();
  await offline.goto('http://127.0.0.1:4177/coleccion.html');await expect(offline.locator('.object-card')).toHaveCount(53);
  await offline.locator('.object-photo').first().click();await expect(offline.locator('.pieza-l')).toHaveCount(4);await context.close();
});
test('scheduled date does not claim a physical opening',async({page})=>{
  await page.clock.install({time:new Date('2047-09-05T12:56:00Z')});await page.goto('/index.html');
  await expect(page.locator('#estado-lab')).toHaveText('Fecha cumplida');await expect(page.locator('#cuenta-lab')).toContainText('falta documentar');
});
test('opening image loads and the original film remains in the archive',async({page})=>{
  await page.goto('/index.html');
  const image=page.locator('.hero-media img');
  await expect(image).toBeVisible();
  await expect.poll(()=>image.evaluate(img=>img.naturalWidth)).toBeGreaterThan(1000);
  await expect(page.locator('#portada video')).toHaveCount(0);
  await expect(page.locator('video.aparicion__v')).toHaveCount(1);
});
test('short mobile viewport keeps navigation and the next section visible',async({page})=>{
  await page.setViewportSize({width:375,height:667});await page.goto('/index.html');
  const bottom=await page.locator('#portada').evaluate(e=>e.getBoundingClientRect().bottom);expect(bottom).toBeLessThan(667);
  await expect(page.getByRole('link',{name:'Ver infografías',exact:true})).toBeInViewport();
  await page.screenshot({path:'output/index-short-mobile.png'});
});
test('visual infographics are immediate, openable, downloadable and reachable from the home page',async({page})=>{
  await page.goto('/infografias.html');
  await expect(page.getByRole('heading',{name:/diez semanas/i})).toBeVisible();
  await expect(page.locator('.visual-poster img')).toHaveCount(2);
  await expect(page.locator('.visual-poster img').first()).toBeVisible();
  await expect(page.locator('.visual-actions a[download]')).toHaveCount(2);
  await expect(page.locator('.visual-actions a[target=_blank]')).toHaveCount(2);
  await page.goto('/index.html');
  await expect(page.getByRole('link',{name:'Ver infografías'})).toHaveAttribute('href','infografias.html');
  await expect(page.locator('.museum-header nav a[href="infografias.html"]')).toBeVisible();
});

test('museum index and image zoom work by keyboard and touch-sized controls',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('/index.html');
  const menu=page.getByRole('button',{name:'Abrir índice del museo'});
  await menu.click();await expect(page.locator('#museum-index')).toBeVisible();
  await expect(page.locator('#museum-index nav a')).toHaveCount(6);
  const menuA11y=await new AxeBuilder({page}).include('#museum-index').withTags(['wcag2a','wcag2aa']).analyze();expect(menuA11y.violations).toEqual([]);
  await page.screenshot({path:'output/index-menu-mobile.png'});
  await page.keyboard.press('Escape');await expect(menu).toBeFocused();
  await page.goto('/infografias.html');
  const poster=page.locator('.visual-poster figure a').first();
  await poster.click();await expect(page.locator('#image-viewer')).toBeVisible();
  await expect.poll(()=>page.locator('#viewer-image').evaluate(img=>img.naturalWidth)).toBe(1122);
  await page.getByRole('button',{name:'Acercar imagen'}).click();await expect(page.locator('#viewer-scale')).toHaveText('150 %');
  await expect(page.locator('#viewer-download')).toHaveAttribute('href',/infografia-trimestre-borrador.png$/);
  await page.getByRole('button',{name:'Ajustar imagen',exact:true}).click();await expect(page.locator('#viewer-scale')).toHaveText('100 %');
  const viewerA11y=await new AxeBuilder({page}).include('#image-viewer').withTags(['wcag2a','wcag2aa']).analyze();expect(viewerA11y.violations).toEqual([]);
  await page.screenshot({path:'output/viewer-mobile.png'});
  await page.keyboard.press('Escape');await expect(poster).toBeFocused();
});

test('the three typography roles render with local fonts on every surface',async({page})=>{
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');await cdp.send('CSS.enable');
  for(const file of [...pages,'ficha.html']){
    await page.goto(`/${file}`);await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('body')).toHaveCSS('font-family',/Spectral/);
    await expect(page.locator('body')).toHaveCSS('font-weight','400');
    await expect(page.locator('.museum-header nav a').first()).toHaveCSS('font-family',/Archivo Narrow/);
    const title=page.locator('h1:not(.h-xl)');
    if(await title.count())await expect(title).toHaveCSS('font-family',/Instrument Serif/);
    const reading=page.locator('.intro-title>p,.lede,.hero-deck').first();
    if(await reading.count()){
      await expect(reading).toHaveCSS('font-family',/Spectral/);
      await expect(reading).toHaveCSS('font-weight','400');
    }
    const {root}=await cdp.send('DOM.getDocument');
    for(const selector of ['.museum-header nav a','.site-brand','h1:not(.h-xl)','.intro-title>p,.lede,.hero-deck']){
      const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});
      if(!nodeId)continue;
      const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
      expect(fonts.length,`${file}: ${selector}`).toBeGreaterThan(0);
      // The preserved template title includes one square placeholder outside the Latin font.
      const allowedFallback=file==='ficha.html'&&selector==='h1:not(.h-xl)'?1:0;
      const fallbackGlyphs=fonts.filter(f=>!f.isCustomFont).reduce((sum,f)=>sum+f.glyphCount,0);
      expect(fallbackGlyphs,`${file}: ${JSON.stringify(fonts)}`).toBeLessThanOrEqual(allowedFallback);
    }
  }
  await page.goto('/infografias.html');
  await page.setViewportSize({width:375,height:900});
  await expect(page.locator('.museum-header nav a').first()).toHaveCSS('font-size','15px');
  await page.setViewportSize({width:1440,height:900});
  await expect(page.locator('.museum-header nav a').first()).toHaveCSS('font-size','15px');
});

test('cross-class map keeps shared authorship, source links, filters and print access',async({page,browser})=>{
  await page.goto('/atlas.html#trimestre-compartido');
  await expect(page.locator('.weave-contributors>li')).toHaveCount(6);
  for(const name of ['Erika Schnitter y Alejandro Pachón','Román Flórez','Viridiana Zavala','Luis Miguel Caamaño','Karla Paniagua','Los 12 estudiantes']){
    await expect(page.locator('.weave-person p').filter({hasText:name})).toBeVisible();
  }
  await expect(page.locator('[data-learning-connection]:visible')).toHaveCount(9);
  for(const theme of ['memoria','imagen','poder','tiempo']){
    const button=page.locator(`[data-weave-filter="${theme}"]`);
    await button.focus();await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('[data-contributor=cohorte]')).toBeVisible();
    await expect(page.locator('[data-learning-connection]:visible')).toHaveCount(learningConnections.filter(c=>c.threads.includes(theme)).length);
  }
  await page.emulateMedia({media:'print'});
  await expect(page.locator('[data-learning-connection]:visible')).toHaveCount(9);
  await expect(page.locator('.weave-controls')).not.toBeVisible();
  await page.emulateMedia({media:'screen'});
  await page.locator('[data-weave-filter=all]').click();
  for(const width of [375,1440]){
    await page.setViewportSize({width,height:900});
    await page.locator('#trimestre-compartido').screenshot({path:`output/shared-trimester-${width}.png`});
  }
  await page.locator('[data-contributor=viridiana] nav a').click();
  await expect(page).toHaveURL(/index.html#modulo-original-02$/);
  await expect(page.locator('#modulo-original-02')).toBeInViewport();
  const context=await browser.newContext({javaScriptEnabled:false});const staticPage=await context.newPage();
  await staticPage.goto('http://127.0.0.1:4177/atlas.html#trimestre-compartido');
  await expect(staticPage.locator('.weave-controls')).not.toBeVisible();
  await expect(staticPage.locator('[data-learning-connection]')).toHaveCount(9);
  await expect(staticPage.locator('[data-contributor=karla]')).toBeVisible();
  await context.close();
});
