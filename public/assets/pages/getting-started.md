# Getting Started
Together we will enable some existing plugins and we will implement a new one. The tutorial assumes some basic knowledge of JavaScript. Some knowledge about [ember.js](https://emberjs.com/) can be useful but should not be required.

## Introduction: How Plugins Work

This video will give you a basic overview of what you will achieve by the end of this tutorial.

<div class="c-video-wrapper">
  <iframe src="https://player.vimeo.com/video/401924173" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
</div>

## Setting up our Environment

The application we are building has a back-end for minimal data storage and a front-end written in Ember that contains the editor itself. The back-end is hosted on a server. The front-end will run on your local machine and connect to the remote back-end.

### Setting up the Frontend

We have prepared a front-end application with a basic editor installed.  This is going to be the basis of our testing.

    git clone https://github.com/SchrodingersCat00/frontend-rdfa-editor-demo-v2
    cd frontend-rdfa-editor-demo-v2

If you haven't installed Ember.js yet, you can install it using the following command:

    npm install -g ember-cli

Install the required dependencies, this might take a while depending on the speed of your internet connection:

    npm install

After that you can start the application running the following npm command:

    npm run start

The command will build and start the Ember application, proxy requests to the remote back-end and live-reload on changes in the source files.

### Verify the App is Launched

Once the build has finished, visit http://localhost:4200 and view the wonder of a blank editor.

## Adding plugins: Detailed Tutorial

### Add Existing Plugins

The editor consists of plugins that make the editor 'smart'.  Plugins understand the context you're working in and try to give smart hints to insert or update knowledge in the editor. Some plugins are domain-specific, others are more generic which make them easy to reuse.

Adding a plugin to the editor consists of 2 steps:
1. Installing the plugin
2. Enabling the plugin in the editor configuration

Let's add a plugin to insert a date, and one to manipulate a date.

#### Insert a date using the date-Plugin

The date-plugin allows you to insert a date with correct annotations. When you type a date in the format 'DD/MM/YYYY', e.g. 06/03/2020, a hint card will pop up, proposing to annotate the date with the appropriate RDFa tags.

In our demo application, the plugin `ember-rdfa-editor-date-plugin` is already installed (see `package.json`). We just need to enable the plugin in the editor configuration in `app/config/editor-profiles.js` by uncommenting the line containing `rdfa-editor-date-plugin`. This will allow the plugin to receive events from the editor.

    // File: app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin",
        // "rdfa-editor-date-overwrite-plugin",
        // "rdfa-editor-dbpedia-info-plugin",
        // "rdfa-editor-wikipedia-slug-plugin"
      ]
    };

If you save the change you've made, you will see the app reload. You should be able to insert a date in your document now! When you type 06/03/2020 you will be greeted with a card. Click on the insert button and the following HTML will be inserted in your document.

    <span property="http://purl.org/dc/terms/created" datatype="http://www.w3.org/2001/XMLSchema#date" content="2020-03-06">
        06.03.2020
    </span>

An annotated date \o/ !

#### Update a date using the date-overwrite-Plugin

Inserting a date is one thing, but we should be able to update a date.  That's what the date-overwrite-plugin does. It updates the date in text as well as in the underlying RDFa annotations.

As with the date plugin, the `ember-rdfa-editor-date-overwrite-plugin` is already installed. We just need to enable the plugin in the editor configuration in `app/config/editor-profiles.js` by uncommenting the line containing `rdfa-editor-date-plugin`.

    // File: app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin",
        "rdfa-editor-date-overwrite-plugin"
        // "rdfa-editor-dbpedia-info-plugin",
        // "rdfa-editor-wikipedia-slug-plugin"
      ]
    };

Save your changes. The editor will reload. Insert a new date with the date-plugin. After inserting the date, click on the date that got inserted in the text. A new hint card will pop proposing to update the date. That's two enabled plugins \o/.

### Let's write our own plugin!

If we can only reuse existing plugins, then we wouldn't be fully in control.  Let's write a plugin of our own.  For our new plugin, we will support the insertion of links to Wikipedia articles.  If the user types `dbp:word`, we will show a hint card proposing to insert a hyperlink to a Wikipedia article. Once the hyperlink is inserted, another plugin will show a card with a snippet from Wikipedia when the cursor is positioned in the hyperlink.

#### What do I need for a plugin?

A general plugin has two moving parts.  A service, which receives events and tells Say which regions to highlight; and a UI component for user interaction.

**note:** A component is a reusable UI element, that has some behavior associated with it. In this case we are using Ember [components](https://guides.emberjs.com/release/components/introducing-components/) and [services](https://guides.emberjs.com/release/services/).

#### Generating the stub Configuration

To ease the creation of plugins, there is a [plugin generator](https://github.com/lblod/ember-rdfa-editor-plugin-generator) .  You can run this in a bare Ember Addon and get the stub for your plugin out of the box.  To easen this tutorial, we have ran the plugin generation process for you. In this case, we've decided to use an Ember [in-repo-addon](https://cli.emberjs.com/release/writing-addons/in-repo-addons/). This simply means that the plugin code is already included and is located in `lib` instead of `node_modules`.

The code for the plugin can be found in `lib/ember-rdfa-editor-wikipedia-slug-plugin`. We have left the code in this folder as close as possible to that of the generated plugin. The file tree of the plugin looks as follows:

    ├───addon
    │   ├───components
    │   ├───services
    │   └───utils
    └───app
        ├───components
        └───services

We will mostly be working in the `addon` folder. `addon/components` will contain the UI components, `addon/services` will contain the services that receive and handle the events sent by the editor and lastly, `addon/utils` contains some utility functions that will come in handy when requesting data from wikipedia later in this tutorial.

#### Enabling our Plugin

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

#### Implementing the Service

##### Discovering the plugin's Service

Our plugin's service will receive events.  When events are received, the service can update/add/remove hint cards.  Such calls are handled using the execute hook of the service.

Our service is located in
`lib/rdfa-editor-wikipedia-slug-plugin/addon/services/rdfa-editor-wikipedia-slug-plugin.js`.

As we saw earlier, a generated service comes with a default hint card.  The service contains a single method which handles all the actions.

    execute(hrId, rdfaBlocks, hintsRegistry, editor) {
        hintsRegistry.removeHintsInRdfaBlocks(rdfaBlocks, hrId, COMPONENT_ID);

        for (const rdfaBlock of rdfaBlocks) {
            let idx = rdfaBlock.text.toLowerCase().indexOf('hello');
            if (idx !== -1) {
                // the hintsregistry needs to know the location with respect to the document
                const absoluteLocation = normalizeLocation(
                    [idx, idx + 'hello'.length],
                    rdfaBlock.region
                );
                hintsRegistry.addHint(hrId, COMPONENT_ID, {
                    // info for the hintsRegistry
                    location: absoluteLocation,
                    card: COMPONENT_ID,
                    // any content you need to render the component and handle its actions
                    info: {
                        hrId, hintsRegistry, editor,
                        location: absoluteLocation
                    }
                });
            }
        }
    }

From a high level the execute function goes like this:

  1. remove existing hints
  2. do this for each context
  3. if some property holds, add a hint card

Each time new contexts are received, the service removes all hints and creates new hint cards on the relevant spots.

##### Removing earlier Inputs

We will remove all inputs and add all the relevant ones again.  The generated code in our sample is complete.

Note that our cards are added and removed in the "wikipedia-slug-scope".  By supplying this identifier, we ensure we don't clash with other plugins.

##### Recognizing our Input

Having a card greet us is fun, but it's not very useful. We will now add functionality to show a hint card whenever the user types something like `dbp:Fox` or `dbp:Booker_T._Jones`.

First things first, let's get an idea of the form of the rdfaBlocks array.  Let's put a `console.log` at the top of our execute function to get a clue what we are working with.

    execute(hrId, rdfaBlocks, hintsRegistry, editor) {
      console.log( rdfaBlocks );
      ...
    }

Opening up the developer console in the browser, you'll be greeted with the blocks as you type new content.  Each block contains a bunch of information, including the semantic context.  For this demo we will simply hook into the text content.

JavaScript has support for regular expressions.  Looking at the example inputs, a reasonable regular expression could be `/dbp:([\w_\-(%\d\d).]+\w)/`.  With this in our hands, we can update the matching function.

Comment out or remove the existing code in the for loop so the changes we make don't cause run-time errors.

    for( const rdfaBlock of rdfaBlocks ){
      const match = rdfaBlock.text.match(/dbp:([\w_\-(%\d\d).]+\w)/);
      if( match ) {
        console.log("We have a match");
      }
    }

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
        ...

##### Calculating the highlighted Region

Now that we have the right content in place, we need to highlight the correct region.

The HintsRegistry maintains the hint cards and handles async behaviour with respect to their position.  It makes an educated guess to update highlights or selected regions based on user input.  For this approach to work, we receive an HintsRegistryId `hrId` which indicates the state of our document at the time in which the execute hook was scheduled.

The hintsRegistry expects the location in which we want to position the card.  The absolute position is calculated by checking the start position of our rdfaBlock and adding the relative position of the match to it.  The helper function `normalizeLocation` is provided for this calculation.

We want the highlight to reach for the full length of our match (thus including dbp).  The target location is thus calculated as:

    const location = normalizeLocation( [ start, start + fullMatch.length ], rdfaBlock.region );

##### Adding the hint Card
Lastly, we need to add our highlight to the hintsRegistry. A hint card informs the HintsRegistry where cards should be shown.

In between our calculations and the hint card being added, user input might be happening.  The HintsRegistry will help us out here based on the hrId.

The HintsRegistry needs to know:

  - At which document state we are: the `hrid`
  - The scope of our changes: `wikipedia-slug-scope`
  - Where to show the highlight: `location`,
  - Which card to render: `rdfa-editor-wikipedia-slug-card` (located in `addon/components`)
  - Which info to pass to the card: anything in the `info` property

We will add `term` to the info passed to the component.  Why we need all these will be clear when we implement the card.  The code to add the hint thus becomes:


    hintsRegistry.addHint( hrId, "wikipedia-slug-scope", {
      location,
      card: "rdfa-editor-wikipedia-slug-card",
      info: {
        hrId, hintsRegistry, editor, location, term
      }
    });


##### Calculating the Link

The insertion of the link is executed through the component javascript file. This file can be found at `addon/components/rdfa-editor-wikipedia-slug-card.js` and looks as follows:

    export default class RdfaEditorWikipediaSlugCardComponent extends Component {

    }

This is currently only a skeleton Component class, ready to be filled with some awesome code.
We will insert a link with an `rdf:seeAlso` property attached to it. An example of such a link could be `<a href="https://en.wikipedia.org/wiki/Vehicle" property="rdf:seeAlso">Vehicle</a>`.  We passed the term (`"vehicle"` in this case) through the info hash. We will execute a query to find results. For this we will add a class method:

    async getDbpediaOptions() {
      this.loading = true;
      const solutions = await dbpediaQuery(this.args.info.term);
      this.solution = solutions.length ? solutions[0] : 0;
      this.loading = false;
    }

This method relies on two properties `solution` and `loading`, we will add them as well.

    @tracked solution = null;
    @tracked loading = false;

**note:** The tracked decorator is used to tell the framework that it needs to update the UI when the value of the variable changes.

We will also add a constructor in which this method is called:

    constructor() {
      super(...arguments);
      this.getDbpediaOptions();
    }

Next we create a method that will create the correct link:

    createLink(){
      const url = `https://en.wikipedia.org/wiki/${encodeURI(this.solution)}`;
      return `<a href="${url}" property="rdf:seeAlso">${this.solution}</a>&nbsp;`;
    }

##### Inserting the Link

We will write the functionality to actually insert a link. For this we will add a class method `insert`.

    @action
    insert() {

    }

Note that we used the `@action` decorator. TODO: explain why.

Inserting the link is executed in three steps:

  - Remove the hints in our region
  - Select the previously highlighted area
  - Update the content of the selection

Hints can be removed by request to the HintsRegistry.  We passed this instance, the hrId and the location of our hint to this component so we can easily remove the hint:

    const info = this.args.info;
    info.hintsRegistry.removeHintsAtLocation( info.location, info.hrId, "wikipedia-slug-scope");

Next up, we have to select the region of our text to operate on.

    const selection = info.editor.selectHighlight(info.location);

Lastly, we call the update function of the editor with this selection.  We request the editor to insert some HTML

    info.editor.update( selection, {
      set: { innerHTML: this.createLink() }
    });

#### Updating the Card

The card consists of an html template file (`addon/components/rdfa-editor-wikipedia-slug-card.hbs`) and a javascript file (`addon/components/rdfa-editor-wikipedia-slug-card.js`).  The template file will be rendered.  It can receive information from the javascript file and it can execute actions defined in the javascript file.

##### Updating the card Template

Looking at the card template, it still talks about "hello".  Let's update the card.  Some things to note:

  - You can render dynamic content between mustaches `{{ }}`
  - You can access the imported info object starting with `@info`
  - You can access definitions on the component under `this`
  - Arguments passed to Ember Components are prefixed with an `@`
  - You can render conditionals like `{{#if @info.term}}Yay{{else}}Nay{{/if}}`

Our card template doesn't need to much, we can update it to

    {{!-- addon/components/rdfa-editor-wikipedia-slug-card.js --}}

    <div class="modal-dialog__content">
      <p class="u-spacer--tiny">
        Wikipedia link hint
        <br>
        {{#if this.loading}}
          <br><strong>...looking up articles...</strong>
        {{else}}
          {{#if this.solution}}
            <strong>Do you want to insert a link to {{this.solution}}?</strong>
          {{else}}
            <strong>No article found for {{@info.term}}</strong>
          {{/if}}
        {{/if}}
      </p>
    </div>
    {{#if this.solution}}
      <div class="modal-dialog__footer">
        <WuButtonGroup>
          <WuButton @label="Yes" @size="small" @isNarrow={{true}} @commandLocation="below" @onClick={{this.insert}} />
        </WuButtonGroup>
      </div>
    {{/if}}


That's it!  Press the button and your link should be inserted.

Visiting this file you are greeted with a stub implementation for the execute function.  The documentation above indicates what information you receive, we will use all of these in our solution.

#### Enable the hint Card

If everything went to plan, you can now also enable the hint card to show some details about wikipedia links.

Enabling the `rdfa-editor-dbpedia-info-plugin` in `app/config/editor-profiles.js`.  After doing so, move your caret into one of the dbpedia links and you will be greeted by an info card.

### Extra

#### Bonus

There is a service which can search for pages on dbpedia.  You can insert this into your component by importing `../utils/dbpedia-query`.

Extend the card to only insert the first link that could be found.

#### Extra Bonus

You can use `{{#each this.results as |value|}}...{{/each}}` to loop over each of the results.  Show a button for each of these results and let the user choose the most appropriate one.

### Closing Remarks

We are constantly trying to clean up these interfaces and to make the editor more stable.  If you enjoyed this tutorial, make a plugin for something you care about and maybe help us hack the core editor as you get more acquainted.  Don't hesitate to contact us if you have a plan but are not completely sure how to best tackle it.
