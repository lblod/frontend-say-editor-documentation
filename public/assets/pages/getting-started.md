# Getting started

Welcome to this getting started tutorial!  In this tutorial we will implement a new plugin, giving a rough idea on how to extend the editor. The tutorial assumes some basic knowledge of JavaScript.

## Setting up our environment

The application we are building has a backend for minimal data storage and a frontend, written in Ember, containing the editor itself. The backend is hosted on a server. The frontend will run on your local machine and connect to the remote backend.

### Setting up the frontend

We have prepared a frontend application with a basic editor installed.  The node modules are pre-included in the repository to easen setup and consistency.

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

If we can only reuse existing plugins, then we wouldn't be fully in control.  Let's write a plugin of our own.  For our new plugin, we will support the insertion of links to Wikipedia articles.  If the user types `dbp:word`, we will show a hint card proposing to insert a hyperlink to a Wikipedia article.

There are three parts interacting when writing a plugin:

  - The editor: processes input
  - A service: is informed about new events, and decides where to provide hints
  - A hint card: is shown to the user, and allows manipulation of a region of text in the editor

### Creating our own plugin

A plugin can be generated from a blueprint.  For this tutorial, we have already setup an initial plugin containing some helper functions to interact with dbpedia, a service that extracts semantic information from Wikipedia articles. The plugin is included in the `node_modules/@lblod/ember-rdfa-editor-wikipedia-slug-plugin` folder.

First, as with the other plugins, we have to enable the plugin in the editor configuration:

    // File: frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin",
        "rdfa-editor-date-overwrite-plugin",
        "rdfa-editor-wikipedia-slug-plugin"
      ]
    };


In our plugin we will have to edit three files.
  - `addon/services/rdfa-editor-wikipedia-slug-plugin.js`: Service which identifies relevant text and provides highlights in the text
  - `addon/templates/components/editor-plugins/wikipedia-slug-card.hbs`: Visual representation of our hint card show at the side
  - `addon/components/editor-plugins/wikipedia-slug-card.js`: JavaScript logic of the hint card component

### Service

This is the file `addon/services/rdfa-editor-your-name-plugin.js`. Here we will have to modify 2 methods:
- `detectRelevantContext`: this method receives a context and returns a `Boolean` indicating if the context is relevant to our plugin or not, the context is a complex object representing a section of the document, you can read more about it here. For this use case we will use its `text` property where we can use RegEx to see if it matches the structure `dbp:word`.
- `generateHintsForContext`: this method receives a context that we already know that's relevant and creates a hint for it, we can completely customize the hint and card generation process but we will follow the one that's already there, for that we will need to create a card with a text and a location, the location is the characters that we will highlight, and the text is some text we will pass down to the card, in this case we will get the location of the characters that form the string `dbp:word` and will pass down `word` as a string.

### Plugin Component

This is related to the file `addon/components/editor-plugins/your-name-card.js`. In this file we will provide you with one function `getDbpediaOptions` that gets the term and set the variable this.options containing an array with all the relevant options found on dppedia in order to link to wikipedia. We will also link this function to the `willRender` hook of the component, which is an Ember thick to ensure the function will run before showing the card.
For this file you will have to create new function called `generateLink` and modify the `insert` action.
- `generateLink`: this method is very basic, it will just generate the link html getting the first option from the this.options array. The link will be like `https://en.wikipedia.org/wiki/Word`, also we will have to use the js `encodeURI` method in order to escape the string.
- `insert`: this method is triggered by clicking the "add" button of the template. It selects the highlighted string that we get from the hint (we get the location on the component) and replaces it by the link generated on the previous method. For this we can use the `selectHighlight` and the `update` methods on the editor

### Template

This is related to the file `addon/templates/components/editor-plugins/your-name-card.js` this is the simplest step, we just have to replace the text in the card by a question asking the user if he wants to replace the text by a link to the word we got in the options, for this we will use the ember get helper that has the following structure `{{get array index}}`.
