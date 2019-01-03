# Problem D

In this exercise, you'll practice working with CSS properties and layouts.

To complete the exercise, add rules to the included `css/style.css` file in order to style the included `index.html` page so that it has a stylish navigation bar:

![Example of completed exercise](img/sample-solution.gif)

Instructions for achieving this appearance are detailed below. Note that you will need to edit both the CSS **and** the HTML for some effects.

**A note on testing**: while there are multiple approaches to achieving the desired effect, the unit tests are written to check for a particular (usually "best practice") implementation. This limitation is due to the need for automated testing, rather than any fault in other approaches.


1. The first thing you should do is set your page's [`box-sizing`](https://info343.github.io/css-layouts.html#box-sizing) to be `border-box`. This will help with calculating measurements of the rest of the changes.

2. Add rules to give the page's content appropriate colors, fonts, and sizes:

    - The body text should be colored `#535353`, while the headings (`<h1>` and `<h2>`) should use [UW purple](https://www.washington.edu/brand/graphic-elements/primary-color-palette/) (look it up!).
  
    - The body and headers should utilize the [UW Fonts](https://www.washington.edu/brand/graphic-elements/font-download/): the headings should use the font for "Primary Headlines", and the body text should use the font for "Body". Notice that the headings are in "black" (a font weight of `900`).

        You should access these fonts via a `<link>` in the HTML to the [Google Fonts](https://fonts.google.com/) collection (be sure and get the correct weight of "black" for headings!).

        Yes, it is common to have to look up branding guidelines and adapt those to a web site!

    - Additionally, make the top-level heading have a `font-size` of 2.5x the _root element's size_.

    - The CSS is _normalized_ for multiple browsers, so it has no default spacing. Give the `body` content a margin of `8px` (so it has some spacing on the sides).

3. The navigation bar (the `<nav>` element) should be `fixed` to the top of the screen. Be sure to specify it's absolute location! 

    - To make sure the content sits below the fixed navbar, give the top-level heading a top margin of `3em`.

    - The navbar should take up `100%` of the page.

    - The navbar should also have a background color of UW Purple.
    
    - Add `.75rem` of space between all four sides of the navbar and its content (so the links aren't flush with the window).

4. Now that you've colored the navbar, style the links so they show up. The links in the navbar (the links, not the items) should be colored `white` and _not_ be [underlined](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration).

5. Change the display of each list item so they are `inline`. This will make it into an inline list!
 
    - Also add `1rem` of space to the right of each item (outside of its content) in the list to move them apart.

    - The list container (the `ul`) should have `0` extra spacing (for margin _and_ padding), except for `.5rem` of padding at the top.

6. The "search box" and its button should `float` to the right of the page. (Notice that there is a `<div>` that groups these items together for styling&mdash;apply your rule to that class!)

    - You'll need to make the the list of links (but not the list items themselves!) an `inline-block` element so that the search bar and links appear on the same line.

    - The `input` box should have a height of `2.5rem`, a `font-size` of `1rem`, `.5rem` of space between the text and (all of) the box edges, and be [`bottom` aligned](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align) (to line up with the button).

7. The search button should show a magnifying glass icon instead of the word "Search". You should replace the text with a [Font Awesome icon](https://fontawesome.com/v4.7.0/icons/).

    - You will need to include the Font Awesome library (via CDN) in your `index.html` file.

    - Add the element for the icon in place of the word "Search". You should also [flip the fa icon](https://fontawesome.com/v4.7.0/examples/) so it faces the right way.

    - The search button (which now contains the icon) should have a height of `2.5rem`, a font-size of `1.5rem` and `.3rem` of padding all around.

    - Remember that purely-visual elements also need to be perceivable to screen readers! Give the icon an `aria-label` attribute so that it will be properly read.

8. Add an effect to the links so that when the user hovers over them (or otherwise gives them `focus` or makes them `active`), they change color to `#b7a57a` and gain a thick (`.6rem`) bottom border in the same color.

    - You'll need to add some space (`.8rem`) between the link content and its border to make the "underline" line up with the bottom of the nav bar. (Note that with this measure it may not quite line up on some browsers).

9. No navbar is complete without a logo, so add the iSchool logo (provided as `img/ischool-symbol-white.png`) to the side of the word "Informatics" in the first link. But since adding this as an `<img>` tag will make things difficult to style, you should instead include the logo as part of a _background image_.

    - First, add a `<span>` element (an empty inline element) directly before the word "Informatics" inside the first list item. This `<span>` will need to just have an empty space as content, use a [non-breaking space HTML entity](https://www.w3schools.com/html/html_entities.asp). You can additionally give it an `aria-hidden` to ensure it isn't accidentally read by a screen reader!

        - Give the span a CSS class of `logo` to be able to style it (and for testing).

    - Give the span `1em` to the left and right of its "content" to give it some extra width. (Note that you _cannot_ specify the width directly because it's an `inline` element, and making it `inline-block` would mess with the overall inline-ness of the list)!

    - Finally, give the span a background-image of `img/ischool-symbol-white.png`. Be sure and specify the `position` of the image (it should be left-aligned), the `size` of the background (it should be _contained_ in the element), and whether it should repeat (it should not).

10. _Optional_ as a final step, make the page more accessible by adding a [**skip link**](http://webaim.org/techniques/skipnav/) to the page. By putting a `"Skip to Content"` link at the very top of the page, screen readers and other keyboard based navigators will be able to jump past the navbar without needing to read/tab through all that extra content.

    - First, add an element (e.g., a `<div>`) at the very top of the `<nav>` that will contain the skip link. The element should contain an `<a>` tag that is a "bookmark link" to the `<main>` content of the page.
    
        Note that this link should _not_ be part of the list of navigation links.

    - While a visible skip link does indicate a commitment to accessibility, it would fit your layout better if it were [made invisible except to screen readers](http://webaim.org/techniques/css/invisiblecontent/). You can do this by giving the element an absolute position off screen, and making the element very very tiny (by not 0px, because then it won't be read)!

    - But you do want the element to appear for sighted, keyboard users when they select it. Add a rule so that when the skip link has `focus` or is `active`, it is positioned at the top of the nav bar, sized based on its content (`auto`), and allowed to `overflow`.

        Also make the focused element's color `white` and remove its border so it looks a bit nicer.

        You can test this out by using the `tab` key to cycle through the links, and `enter` to follow one.
