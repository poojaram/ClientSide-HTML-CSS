const fs = require('fs');
const cheerio = require('cheerio') //for html testing
const inlineCss = require('inline-css'); //for css testing
const cssParser = require('css');

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

const htmlPath = __dirname + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8'); //load the HTML file once
const cssPath = __dirname + '/css/style.css';
const css = fs.readFileSync(cssPath, 'utf-8'); //load the HTML file once

//absolute path for relative loading (if needed)
const baseDir = 'file://'+__dirname+'/';

describe('Source code is valid', () => {
  test('HTML validates without errors', async () => {
    const lintOpts = {
      'attr-bans':['align', 'background', 'bgcolor', 'border', 'frameborder', 'marginwidth', 'marginheight', 'scrolling', 'style', 'width', 'height'], //adding height, allow longdesc
      'tag-bans':['style','b'], //<i> allowed for font-awesome
      'doctype-first':true,
      'doctype-html5':true,
      'html-req-lang':true,
      'attr-name-style': false, //for meta tags
      'line-end-style':false, //either way
      'indent-style':false, //can mix/match
      'indent-width':false, //don't need to beautify
      'id-class-style':false, //I like dashes in classnames
      'img-req-alt':true
    }

    await expect(htmlPath).toHaveNoHtmlLintErrorsAsync(lintOpts);
  })

  test('CSS validates without errors', async () => {
    await expect(cssPath).toHaveNoCssLintErrorsAsync();
  })
});

describe('Includes required CSS rules', () => {
  let $; //cheerio instance

  beforeAll(async () => {
    //test CSS by inlining properties and then reading them from cheerio
    let inlined = await inlineCss(html, {extraCss: css, url:baseDir, removeLinkTags:false});
    $ = cheerio.load(inlined);
    // console.log(inlined);

    //non-inlined rules by parsing AST tree
    let cssAST = cssParser.parse(css, {source: cssPath});
    cssRules = cssAST.stylesheet.rules.filter((d) => d.type === "rule");
  })

  test('1. Page uses border-box sizing', () => {
    expect($('body').css('box-sizing')).toEqual('border-box');
  })

  test('2. Page has appropriate colors, fonts, and sizes:', () => {

    let body = $('body');
    let h1 = $("h1")
    let h2 = $("h2")
    expect(body.css('color')).toEqual('#535353');
    expect(h1.css('color').toLowerCase()).toEqual('#4b2e83');
    expect(h2.css('color').toLowerCase()).toEqual('#4b2e83');

    expect(body.css('font-family')).toMatch('Open Sans');
    expect(h1.css('font-family')).toMatch('Encode Sans');
    expect(h2.css('font-family')).toMatch('Encode Sans');
    expect(h1.css('font-weight')).toEqual('900');
    expect(h2.css('font-weight')).toEqual('900');

    let encodeSansLink = $('link').filter((i,el) => $(el).attr('href').includes('Encode+Sans'));
    expect(encodeSansLink.length).toEqual(1); //html includes Encode Sans
    let openSansLink = $('link').filter((i,el) => $(el).attr('href').includes('Open+Sans'));
    expect(openSansLink.length).toEqual(1); //html includes Open Sans

    expect(h1.css('font-size')).toEqual('2.5rem');
    expect(body.css('margin')).toEqual('8px');
  })

  test('3. Navbar is correctly styled', () => {
    let nav = $('nav')
    expect(nav.css('position')).toEqual('fixed');
    expect(nav.css('top')).toEqual('0');
    expect(nav.css('left')).toEqual('0');

    expect($('h1').css('margin-top')).toEqual('3em');

    expect(nav.css('width')).toEqual('100%');
    expect(nav.css('background-color').toLowerCase()).toEqual('#4b2e83');
    expect(nav.css('padding')).toEqual('.75rem');

  })

  test('4. Navbar links are correctly styled', () => {
    let navlinks = $('nav').find('a');
    expect(navlinks.css('color')).toEqual('white');
    expect(navlinks.css('text-decoration')).toEqual('none')
  })

  test('5. Navbar list is inlined and correctly styled', () => {
    let navitems = $('nav').find('li');
    expect(navitems.css('display')).toEqual('inline')
    expect(navitems.css('margin-right')).toEqual('1rem');
    let navlist = $('nav').children('ul');
    expect(navlist.css('padding')).toEqual('0');
    expect(navlist.css('margin')).toEqual('0');
    expect(navlist.css('padding-top')).toEqual('.5rem');
  })

  test('6. Search input is correctly styled', () => {
    let searchBox = $('.searchBox');
    expect(searchBox.css('float')).toEqual('right');

    let navlist = $('nav').children('ul');
    expect(navlist.css('display')).toEqual('inline-block');

    let searchInput = searchBox.children('input');
    expect(searchInput.css('height')).toEqual('2.5rem');  
    expect(searchInput.css('font-size')).toEqual('1rem');
    expect(searchInput.css('padding')).toEqual('.5rem');
    expect(searchInput.css('vertical-align')).toEqual('bottom');    
  })

  test('7. Search button has correctly styled icon', () => {
    let faLink = $('link').filter((i,el) => $(el).attr('href').includes('font-awesome.min.css'));
    expect(faLink.length).toEqual(1); //html includes link to Font Awesome

    let searchButton = $('.searchBox').children('button');
    expect(searchButton.children().length).toEqual(1); //button contains one element
    expect(searchButton.children('.fa').length).toEqual(1); //button's content is Font Awesome icon
    expect(searchButton.text()).not.toMatch(/Search/); //button doesn't show word "Search"

    expect(searchButton.css('height')).toEqual('2.5rem');
    expect(searchButton.css('font-size')).toEqual('1.5rem');
    expect(searchButton.css('padding')).toEqual('.3rem');

    let icon = searchButton.children('.fa');
    expect(icon.attr('aria-label').toLowerCase()).toMatch(/search/); //has aria label with "search"
  })

  test('8. Includes hover effects on links', () => {
    let hoverRules = cssRules.filter((r) => r.selectors.join().includes(':hover'));
    expect(hoverRules.length).toEqual(1); //should have one hover rule
    expect(hoverRules[0].selectors.join().includes(':active')); //hover rule also applies to active
    expect(hoverRules[0].selectors.join().includes(':focus')); //hover rule also applies to focus

    let colorDeclaration = hoverRules[0].declarations.filter((d) => d.property === 'color');
    expect(colorDeclaration[0].value.toLowerCase()).toEqual('#b7a57a'); //color changes on hover

    let bottomBorderDeclarations = hoverRules[0].declarations.filter((d) => d.property.includes('border-bottom'));
    let bottomBorderValues = bottomBorderDeclarations.map((d) => d.value).join();
    expect(bottomBorderValues).toMatch(/\.6rem/); //bottom border is correct size
    expect(bottomBorderValues).toMatch(/solid/); //bottom border is solid
    expect(bottomBorderValues).toMatch(/#b7a57a/); //bottom border is correct color
  })

  test("9. Includes styled logo", () => {
    let logo = $('.logo');

    expect(logo.parent('a[href="#"]').length).toEqual(1); //logo in correct link element
    
    expect(logo.text()).toMatch(/\s+/); //includes white space (non-breaking space)

    let correctPadding = (logo.css('padding') === '0 1em') || (logo.css('padding') === '0 1em 0 1em') || 
                  ( (logo.css('padding-left') === '1em' && logo.css('padding-right') === '1em') )
    expect(correctPadding).toBe(true); //should have correct padding (multiple approaches)

    expect(logo.css('background-image')).toMatch("url('../img/ischool-symbol-white.png')"); //has background-image
    expect(logo.attr('style').includes('left')).toBe(true); //positioned to the left
    expect(logo.attr('style').includes('contain')); //contained
    expect(logo.attr('style').includes('no-repeat')); //does not repeat
  })

  test.skip('10. Includes skip link', () => {
    //optional requirement, not currently tested
  })
})
