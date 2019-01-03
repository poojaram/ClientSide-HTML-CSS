# Problem A

In this exercise, you'll practice working with HTML, in particularly modifying content to be more **accessible** by using semantic elements.

To complete the exercise, modify the included `index.html` file (which displays a simple blog) based on the below instructions. You will **not** need to modify the CSS (which has been included to make the page look at little nicer, _AND_ to give some visual hints when you're on the right track!).

In particular, you should make the following changes:

1. Ensure that heading elements (e.g., `<h1>`, `<h2>`) are used appropriately: they should be **meaningful** (for text that are actually headings, not just for styling) and **hierarchical** (in order, `h2` following `h1`).

    - You should use the `time-posted` CSS class defined in `css/style.css` to apply styling to the "time posted" elements, instead of inappropriately using headings.

2. Add _semantic sectioning_ elements to appropriately organize the document. These will also provide ARIA navigation landmarks. Note that adding these elements will also apply some styling (so you can visually check that it's right!)

    - The blog title and subtitle elements should children of a `<header>` element.

    - All of the blog posts should be children of a `<main>` element, with the full content of each post (including its title) in individual `<section>` elements.

3. Each blog post has an element indicating the time it was posted (e.g., "Posted today"). These times are _relative_ (e.g., "yesterday" not "June 13th"). Add [HTML Markup](https://css-tricks.com/time-element/) so that the time (e.g., the word "today") is machine readable for search engine optimization. Be sure to include attributes to give these times machine-readable dates&mdash;"today" should be today's data, "yesterday" should be yesterday's date, etc.

    _Yes, you will have to look up a new HTML tag for this exercise! Follow the links!_

4. The first blog post contains an image. Make sure the image has an `alt` tag so that is properly read by screen readers (the description is up to you). Additionally, make the paragraph below the image describing it into a proper [caption](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption).

  - The caption describes the image source. Include [markup](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite) to make this semantically explicit. Note that the _entire_ caption (including the picture name, photographer, and link) is a citation!

5. The second blog post talks about writing code, but could use some help to make it look and read correctly:

  - Add [markup](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr) to the abbreviations "HTML" and "CSS" (the first time they are used), explaining what they stand for. (This will let you "mouse over" the text to see the expansion in some browsers).

  - The post tries to show some HTML code, but it doesn't render correctly. Use [HTML Character Entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity) to render the HTML tag as text. Additionally, add [markup](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code) to indicate that this is computer _code_.

  - The CSS rule components (_"Selectors"_ and _"Properties"_) are listed with descriptions... so should more appropriately be structured as a [description list](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Define_terms_with_HTML#How_to_build_a_description_list) (`dl`). Change the `ul` to `dl`. Note that each "item" in a description list is actually two elements: a _term_ (`dt`, e.g. for "Selectors") and a _description_ (`dd`, e.g., for the description).

6. Contact information (such as in the footer at the bottom of the page) should be inside of an [`<address>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address) element. Note that addresses that are _not_ contact information for the current document or article require no special markup.

  - Additionally, make sure that the [email](https://css-tricks.com/snippets/html/mailto-links/) and [telephone](https://css-tricks.com/the-current-state-of-telephone-links/) number are both links with proper URI protocols!
