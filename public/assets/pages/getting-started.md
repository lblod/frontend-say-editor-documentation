# Getting started

Welcome to this getting started tutorial!  In this tutorial we will enable some existing plugins and we will implementa  new one.  The tutorial assumes some basic knowledge of JavaScript.

<div class="c-video-wrapper">
  <iframe src="https://player.vimeo.com/video/401924173" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
</div>

## Setting up our environment

The application we are building has a backend for minimal data storage and a frontend, written in Ember, containing the editor itself. The backend is hosted on a server. The frontend will run on your local machine and connect to the remote backend.

### Setting up the frontend

We have prepared a frontend application with a basic editor installed.  This is going to be the basis of our testing.

    git clone https://github.com/lblod/frontend-rdfa-editor-demo.git
    cd frontend-rdfa-editor-demo

You can start the application running the following npm command:

    npm run start

The command will build and start the Ember application, proxy requests to the remote backend and live-reload on changes in the source files.

### Verify the app is launched

Once the build finished, visit http://localhost:4200 and view the wonder of a blank editor.

## Add existing plugins

The editor consists of plugins that make the editor 'smart'.  Plugins understand the context you're working in and try to give smart hints to insert or update knowledge in the editor. Some plugins are domain-specific, others are more generic which make them easy to reuse.

Adding a plugin to the editor consists of 2 steps:
1. Installing the plugin
2. Enabling the plugin in the editor configuration

Let's add a plugin to insert a date, and one to manipulate a date.

### Insert a date using the date-plugin

The date-plugin allows you to insert a date with correct annotations. When you type a date in the format 'DD/MM/YYYY', e.g. 06/03/2020, a hint card will pop up, proposing to annotate the date with the appropriate RDFa tags.

In our demo application, the plugin `ember-rdfa-editor-date-plugin` is already installed. We just need to enable the plugin in the editor configuration in `frontend-rdfa-editor-demo/app/config/editor-profiles.js` by uncommenting the line containing `rdfa-editor-date-plugin`.

    // File: frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin"
      ]
    };

If you save the change you've made, you will see the app reload. You should be able to insert a date in your document now! When you type 06/03/2020 you will be greeted with a card. Click on the insert button and the following HTML will be inserted in your document.

    <span property="http://purl.org/dc/terms/created" datatype="http://www.w3.org/2001/XMLSchema#date" content="2020-03-06">
        06.03.2020
    </span>

An annotated date \o/ !

### Update a date using the date-overwrite-plugin

Inserting a date is one thing, but we should be able to update a date.  That's what the date-overwrite-plugin does. It updates the date in text as well as in the underlying RDFa annotations.

As with the date plugin, the `ember-rdfa-editor-date-overwrite-plugin` is already installed. We just need to enable the plugin in the editor configuration in `frontend-rdfa-editor-demo/app/config/editor-profiles.js` by uncommenting the line containing `rdfa-editor-date-plugin`.

    // File: frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin",
        "rdfa-editor-date-overwrite-plugin"
      ]
    };

Save your changes. The editor will reload. Insert a new date with the date-plugin. After inserting the date, click on the date that got inserted in the text. A new hint card will pop proposing to update the date. That's two enabled plugins \o/.

## Let's write our own plugin!

If we can only reuse existing plugins, then we wouldn't be fully in control.  Let's write a plugin of our own.  For our new plugin, we will support the insertion of links to Wikipedia articles.  If the user types `dbp:word`, we will show a hint card proposing to insert a hyperlink to a Wikipedia article. Once the hyperlink is inserted, another plugin will show a card with a snippet from Wikipedia when the cursor is positioned in the hyperlink.

### What do I need for a plugin?

A general plugin has two moving parts.  A service, which receives events and tells Say in which regoins to show hint cards; and a component for user interaction such as rendering a hint card and updating the document.

### Generating the stub configuration

To ease the creation of plugins, there is a [plugin generator](https://github.com/lblod/ember-rdfa-editor-plugin-generator) .  You can run this in a bare Ember Addon and get the stub for your plugin out of the box.  To easen this tutorial, we have ran the plugin generation process for you.

You can find the glorious sources of a new plugin in `node_modules/@lblod/ember-rdfa-editor-wikipedislug-plugin`, following the common naming strategy for plugins.  We have left the code in your node_modules folder as close as possible to that of the generated plugin, only a utility file for asking questions to dbpedia and some extra pointers to documentation.

### Enabling our plugin

Like the other plugins, we need to enable them even if they are installed.  Let's do that for the two plugins we will be working on.

    // File: frontend-rdfa-editor-demo/app/config/editor-profiles.js
    
    export default {
      default: [
        "rdfa-editor-date-plugin",
        "rdfa-editor-date-overwrite-plugin",
        "rdfa-editor-wikipedia-slug-plugin",
        "rdfa-editor-dbpedia-info-plugin"
      ]
    };

Good, with those enabled we will be receiving events in our plugin's service.

A stub service comes with a hello world implementation.  Go to the editor and type `hello`, you should be greeted with a hint card.

With the plugin enabled, let's dive into the service.

### Implementing the service

#### Discovering the plugin's service

Our plugin's service will receive events.  When events are received, the service can update/add/remove hint cards.  Such calls are handled using the execute hook of the service.

Our service is located in
`frontend-rdfa-editor/demo/node_modules/@lblod/rdfa-editor-wikipedia-slug-plugin/addon/services/rdfa-editor-wikipedia-slug-plugin.js`.  Well, that's a very long path.  In other plugin development, your plugin would be a separate repository and you would follow the links with as root the `rdfa-editor-wikipedia-slug-plugin` folder.  Being able to clone one repository is nice though.

As we saw earlier, a generated service comes with a default hint card.  The service contains a single method which handles all the actions.

    execute(hrId, rdfaBlocks, hintsRegistry, editor) {
      hintsRegistry.removeHintsForRdfaBlocks( rdfaBlocks, hrId, "wikipedia-slug-scope");

      for( const rdfaBlock of rdfaBlocks ){
        let idx = rdfaBlock.text.toLowerCase().indexOf('hello');
        if( idx !== -1 ) {
          // the hintsregistry needs to know the location with respect to the document
          const absoluteLocation = normalizeLocation( [idx, idx + 'hello'.length], rdfaBlock.region );

          hintsRegistry.addHint( hrId, "wikipedia-slug-scope", {
            // info for the hintsRegistry
            location: absoluteLocation,
            card: "editor-plugins/wikipedia-slug-card",
            // any content you need to render the component and handle its actions
            info: {
              hrId, hintsRegistry, editor,
              location: absoluteLocation,
            }
          });
        }
      }
    }

From a high level the execute function goes like this:

  1. remove existing hints
  2. for each context
  3. if some property holds
  4. add a hint card

Each time new contexts are received, the service removes all hints and creates new hint cards on the relevant spots.

#### Removing earlier inputs

We will remove all inputs and add all the relevant ones again.  The generated code in our sample is complete.

Note that our cards are added and removed in the "wikipedia-slug-scope".  By supplying this identifier, we ensure we don't clash with other plugins.

#### Recognizing our input

We want to show a hint card whenever the user types something like `dbp:Fox` or `dbp:Booker_T._Jones`.

First things first, let's get an idea of the form of the rdfaBlocks array.  Let's put a `console.log` at the top of our execute function to get a clue what we are working with.

    execute(hrId, rdfaBlocks, hintsRegistry, editor) {
      console.log( rdfaBlocks );
      ...
    }

Opening up the developer console in the browser, you'll bee greeted with the content as you type new content.  Each block contains a bunch of information, inlcuding the semantic context.  For this demo we will simply hook into the text content.

JavaScript has support for regular expressions.  Looking at the example inputs, a reasonable regular expression could be `/dbp:([\w_\-(%\d\d).]+\w)/`.  With this in our hands, we can update the matching function.

Comment out the existing code in the for loop so the changes we make don't cause runtime errors.

    for( const rdfaBlock of rdfaBlocks ){
      const match = rdfaBlock.text.match(/dbp:([\w_\-(%\d\d).]+\w)/);
      if( match ) {
        console.log("We have a match");
        ...

With this in place, if you type a slug, we should see that we have a match for things like `dbp:Fox` or even more complex examples.

Next up we need to extract some information from the regular expression.  Simplifying things a bit, the match object has the following structure:

  - `0:` complete matched word
  - `1`: matching piece between parens (our term)
  - `index`: starting index of the matched character

We can destructure these elements, leaving us with the following match code:

    for( const rdfaBlock of rdfaBlocks ){
      const match = rdfaBlock.text.match(/dbp:([\w_\-(%\d\d).]+\w)/);
      if( match ) {
        const { 0: fullMatch, 1: term, index: start } = match;
    
#### Calculating the highlighted region

Now that we have the right content in place, we need to highlight the correct region.

The HintsRegistry maintains the hint cards and handles async behaviour with respect to their position.  It makes an educated guess to update highlights or selected regions based on user input.  For this approach to work, we receive an `hrId` which indicates the state of our document at the time in which the execute hook was scheduled.

The hintsRegistry expects the location in which we want to position the card.  The absolute position is calculated by checking the start position of our rdfaBlock and adding the relative position of the match to it.  A helper function is offered for this calculation.

We want the highlight to reach for the full length of our match (thus including dbp).  The target location is thus calculated as:

    const location = normalizeLocation( [ start, start + fullMatch.length ], rdfaBlock.region );

Lastly, we need to add our highlight to the hintsRegistry.

#### Adding the hint card

A hint card informs the HintsRegistry wher cards should be shown.

In between our calculations and the hint card being added, user input might be happening.  The HintsRegistry will help us out here based on the hrId.

The HintsRegistry needs to know:

  - At which state we are: the `hrid`
  - The scope of our changes: `wikipedia-slug-scope`
  - Where to show the highlight: `location`,
  - Which card to render: `editor-plugins/wikipedia-slug-card`
  - Which info to pass to the card: anything in the `info` property

We will add `term` to the info passed to the component.  Why we need all these will be clear when we implement the card.  The code to add the hint thus becomes:


    hintsRegistry.addHint( hrId, "dbp-slug-scope", {
      location,
      card: "editor-plugins/wikipedia-slug-card",
      info: {
        hrId, hintsRegistry, editor, location, term
      }
    });


### Updating the card

The card consists of an html template file (components/wikipedia-slug-card.hbs) and a javascript file (components/wikipedia-slug-card.js).  The template file will be rendered.  It can receive information from the javascript file and it can execute actions defined in the javascript file.

You can find these files in:

  - `frontend-rdfa-editor/demo/node_modules/@lblod/rdfa-editor-wikipedia-slug-plugin/addon/components/wikipedia-slug-card.hbs`
  - `frontend-rdfa-editor/demo/node_modules/@lblod/rdfa-editor-wikipedia-slug-plugin/addon/components/wikipedia-slug-card.js`

#### Updating the card template

Looking at the card template, it still talks about "hello".  Let's update the card.  Some things to note:

  - You can render dynamic content between mustaches `{{ }}`
  - You can access the imported info object starting wyth `@info`
  - You can access definitions on the component under `this`
  - Arguments passed to Ember Components are prefixed with an `@`
  - You can render conditionals like `{{#if @info.term}}Yay{{else}}Nay{{/if}}`

Our card template doesn't need to much, we can updated it to

    <div class="modal-dialog__content">
      <p class="u-spacer--tiny">
        Insert link to wikipedia?
        <br>
        <strong>Do you want to insert a link to {{@info.term}}?</strong>
      </p>
    </div>
    <div class="modal-dialog__footer">
      <WuButtonGroup>
        <WuButton @label="Yes" @size="small" @isNarrow={{true}} @commandLocation="below" @onClick={{this.insert}} />
      </WuButtonGroup>
    </div>

#### Calculating the link

The insertion of the link is executed through the component javascript file.  We will insert a link with an rdf:seeAlso property attached to it.

An example of such a link could be `<a href="https://en.wikipedia.org/wiki/Vehicle" property="rdf:seeAlso">Vehicle</a>`.  We passed the term (`"Vehicle"` in this case) through the info hash.  We insert a space at the end so the cursor can easily move outside of the hint.

    const html = `<a href="https://en.wikipedia.org/wiki/${this.args.info.term}" property="rdf:seeAlso">${this.args.info.term}</a>`;

#### Inserting the link

Inserting the link is executed in three steps:

  - Remove the hints in our region
  - Select the previously highlighted area
  - Update the content of the selection

Hinst can be removed by request to the HintsRegistry.  We passed this instance, the hrId and the location of our hint to this component so we can easily remove the hint:

    const info = this.args.info;
    info.hintsRegistry.removeHintsAtLocation( info.location, info.hrId, "dbp-slug-scope");

Next up, we have to select the region of our text to operate on.  For this to happen correctly, we first update our selected region to the latest state of the editor.  Then we select the highlight of that region.

    const mappedLocation = info.hintsRegistry.updateLocationToCurrentIndex(info.hrId, info.location);
    const selection = info.editor.selectHighlight( mappedLocation );

Lastly, we call the update function of the editor with this selection.  We request the editor to insert some HTML

    info.editor.update( selection, {
      set: { innerHTML: html }
    });

That's it!  Press the button and your link should be inserted.

Visiting this file you are greeted with a stub implementation for the execute function.  The documentation above indicates what information you receive, we wil use all of these in our solution.

### Enable the hint card

If everything went to plan, you can now also enable the hint card to show some details about wikipedia links.  

Enabling the `rdfa-editor-dbpedia-info-plugin` in `app/config/editor-profiles.js`.  After doing so, move your carret into one of the dbpedia links and you will be greated by an info card.

## Extra

### Bonus

There is a service which can search for pages on dbpedia.  You can insert this into your copmonent by importing `../utils/dbpedia-query`.

Extend the card to only insert the first link that could be found.

### Extra bonus

You can use `{{#each this.results as |value|}}...{{/each}}` to loop over each of the results.  Show a button for each of these results and let the user choose the most appropriate one.

## Closing remarks

We are constantly trying to clean up these interfaces and to make the editor more stable.  If you enjoyed this tutorial, make a plugin for something you care about and maybe help us hack the core editor as you get more acquainted.  Don't hesitate to contact us if you have a plan but are not completely sure how to best tackle it.
