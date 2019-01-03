const fs = require('fs');
const cheerio = require('cheerio') //for html testing

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

const htmlPath = __dirname + '/index.html';
const html = fs.readFileSync(htmlPath, 'utf-8'); //load the HTML file once

describe('Source code is valid', () => {
  test('HTML validates without errors', async () => {
    const lintOpts = {
      'attr-bans':['align', 'background', 'bgcolor', 'border', 'frameborder', 'marginwidth', 'marginheight', 'scrolling', 'style', 'width', 'height'], //adding height, allow longdesc
      'doctype-first':true,
      'doctype-html5':true,
      'html-req-lang':true,
      'attr-name-style': false, //for meta tags
      'line-end-style':false, //either way
      'indent-style':false, //can mix/match
      'indent-width':false, //don't need to beautify
      'id-class-style':false, //I like dashes in classnames
      'img-req-alt':false, //for this test; captured later!
    }

    await expect(htmlPath).toHaveNoHtmlLintErrorsAsync(lintOpts);
  })
});

let $; //cheerio instance
beforeAll(() => {
  $ = cheerio.load(html);
})

describe('Has appropriate headings', () => {
  test('Headings are meaningful', () => {
    expect($('h6').length).toEqual(0); //should not have an <h6>
    expect($('.time-posted').length).toEqual(3); //should have three .time-posted
  });

  test('Headings are hierarchical', () => {
    //don't have implemantation for outline algorithm
    //just check counts for now
    expect($('h1').length).toEqual(1); //has 1 <h1>
    expect($('h2').length).toEqual(3); //has 3 <h2>
    expect($('h3').length).toEqual(0); //has 0 <h3>
  });
})

describe('Include semantic sectioning elements', () => {
  test('Has header, main, and footer sections', () => {
    let bodyChildren = $('body').children();
    expect(bodyChildren.length).toEqual(3);
    expect(bodyChildren[0].tagName).toMatch('header'); //body's first child is header
    expect(bodyChildren[1].tagName).toMatch('main');  //body's second child is main
    expect(bodyChildren[2].tagName).toMatch('footer'); //body's third child is footer
  })

  test('Header has appropriate content', () => {
    expect($('body > header').text().trim()).toMatch(/My Awesome Blog\W+Where I post/);
  })

  test('Has appropriate sections', () => {
    let mainChildren = $('main').children();
    expect(mainChildren.length).toEqual(3); //main has three blog posts, three sections

    let postTitles = ["Check it out!", "How I did it", "A blog post!"];    
    mainChildren.each(function(i){
      //section or article valid, but section is better
      expect($(this)[0].tagName).toMatch(/(section)|(article)/); //main child is section or article

      //should only contain post title, not titles of other posts
      let text = $(this).text();
      expect(text).toMatch(postTitles[i]); //section text contains post title 
      expect(text).not.toMatch(new RegExp('('+postTitles[(i+1)%3]+'|'+postTitles[(i+2)%3]+')')); //section text doesn't contain other post titles
    });
  })

  test('Blog post times are annotated', () => {
    //look for <time> tags and make sure they are correct :)
    expect($('time').length).toEqual(3); //should have three <time> elements

    $('time').each(function(i){
      let timestamp = $(this).attr('datetime');
      expect(String(new Date(timestamp))).not.toMatch('Invalid Date'); //`datetime` attribute is valid time
    })
  })
})

describe('First post has accessible images', () => {
  test('Image has alternative test', () => {
    let alt = $('img').attr('alt');
    expect(alt).toBeDefined(); //has alt attribute
    expect(alt.length).toBeGreaterThan(3); //alt attribute has content
    expect(alt).not.toMatch(/an? (image|picture) of/i); //alt attribute doesn't mention image
  })

  test('Figure is captioned', () => {
    let figure = $('img').parent('figure');
    expect(figure.length).toEqual(1); //<img> is inside a <figure>
    let figcap = figure.children('figcaption');
    expect(figcap.length).toEqual(1); //<figure> contains a <figcaption>
    let cite = figcap.children('cite');
    expect(cite.length).toEqual(1); //<figcaption> contains <cite> tag
    let citation = cite.html().split('\n').join(' ').replace(/\s{2,}/,' ');
    let content = new RegExp('Bizzard, the pup, by Frank Harvey. From the <a href="https://www.flickr.com/photos/statelibraryofnsw/2959326615/">State Library of NSW</a>.')
    expect(citation).toMatch(content); //<cite> contains all the content
  })
})

describe('Second post describes code', () => {
  test('Abbreviations are annotated', () => {
    let abbr = $('abbr');
    expect(abbr.length).toBeGreaterThanOrEqual(2); //has 2 <abbr> elements
    let abbrHtml = abbr.slice(0,1);
    expect(abbrHtml.text()).toMatch('HTML'); //first abbr for HTML
    expect(abbrHtml.attr('title')).toMatch('HyperText Markup Language'); //includes title attribute
    let abbrCss = abbr.slice(1,2);
    expect(abbrCss.text()).toMatch('CSS'); //second abbr for CSS
    expect(abbrCss.attr('title')).toMatch('Cascading Style Sheets'); //includes title attribute
  })

  test('HTML code example is displayed', () => {
    //one check that it's formatted right
    expect($('code').html()).toEqual('&lt;h1&gt;Hello World&lt;/h1&gt;'); //contains <code> tag with content
  })

  test('CSS components described in descriptive list', () => {
    let dl = $('dl');
    expect(dl.length).toEqual(1); //should have a <dl>
    let tagNames = dl.children().map((i,e) => e.tagName).get().join(' ');
    expect(tagNames).toMatch('dt dd dt dd'); //should have <dt> and <dd> in order
    let dt = $('dl > dt'); //need to be immediate children
    let dd = $('dl > dd');
    expect(dt.eq(0).html()).toEqual('Selectors'); //has a <dt> for Selectors
    expect(dt.eq(1).html()).toEqual('Properties'); //has a <dt> for Properties
    expect(dd.eq(0).html()).toMatch(/Let you say which tags you want to style/i); //
    expect(dd.eq(1).html()).toMatch(/Let you say what style you want to make those tags/i);    
  })
})

describe('Footer is semantically accurate', () => {
  test('Contact info annotated', () => {
    let address = $('address');
    expect(address.length).toEqual(1); //has <address> element
    expect(address.parent('footer').length).toEqual(1); //<address> in <footer>
    expect(address.html()).toMatch(/Contact me at/); //<address> contains info
    expect(address.html()).not.toMatch(/This blog was/); //<address> doesn't include author
    expect(address.html()).not.toMatch(/2017 The Author./); //<address> doesn't include copyright
    expect(address.html()).not.toMatch(/UW Information School/); //<address> only in footer!
  })

  test('Email has a link', () => {
    let mail = $('a[href="mailto:me@here.com"]');
    expect(mail.length).toEqual(1); //has link with email formatting
    expect(mail.html()).toEqual('me@here.com') //email link on correct content
  })

  test('Telephone number has a link', () => {
    let tel = $('a[href="tel:555-123-4567"]');
    expect(tel.length).toEqual(1); //has link with telephone formatting
    expect(tel.html()).toEqual('(555) 123-4567'); //telephone link on correct content
  })
})
