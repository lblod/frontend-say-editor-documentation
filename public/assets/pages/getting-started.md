# Getting started
    
Welcome to this getting started tutorial!  In this tutorial we will implement a new plugin, giving a rough idea on how to extend the editor.


This tutorial assumes that you:

- know of JavaScript
- have installed ember-cli (`npm install -g ember-cli`)
- have docker and docker-compose installed

## Setting up our environment

The application we are building has a backend for minimal data storage and a frontend containing the editor itself.

### Setting up the frontend

We have prepared a frontend application with a basic editor installed.  The node modules are pre-included in the repository to easen setup and consistency.

    git clone https://github.com/lblod/frontend-rdfa-editor-demo.git
    cd frontend-rdfa-editor-demo
    
Ember comes with a command which watches the javascript sources and offers a live-reload. We provide a remote backend that can
be reached by proxying to the following address. Start it like so:

    npm run start --proxy=http://demo-backend.say-editor.com

### Verify the app is launched

Visit http://localhost:4200 and view the wonder of a blank editor.

## Add existing plugins

The editor consists of plugins.  Some plugins are domain-specific, others are easy to reuse.  Let's enable a plugin to insert a date, and one to manipulate a date.

### ember-rdfa-editor-date-plugin

The date-plugin allows you to insert a date with correct annotations. When you type 'DD/MM/YYYY' a card will pop up, 
asking you if you want to insert it as a date with the appropriate RDFa tags.

NOTE: We already ran `ember install ember-rdfa-editor-date-plugin` so you only have to enable the plugin.

Enable this plugin by adding it to the editor-profiles.

    frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin"
      ]
    };

Now you should be able to insert a date in your document! When you type 20/20/2020 you will be greeted with a card, click on the insert button and the following HTML will be inserted in your document.

    TODO: show the inserted html snippet

An annotated date, nice.

### ember-rdfa-editor-date-overwrite-plugin

Inserting dates is something, but we should be able to update the dates.  That's what the date-overwrite-plugin does, RDFa content included.

NOTE: We already ran `ember install ember-rdfa-editor-date-overwrite-plugin` so you only have to enable it.

To enable this plugin in the frontend, we add it to the editor-profiles.

    frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin",
        "rdfa-editor-date-overwrite-plugin"
      ]
    };

If you now click on the date in the editor, a card will pop up, allowing you to change the date.  That's two enabled plugins \o/.

## Let's write our own!

If we can only reuse existing plugins, then we wouldn't be fully in control.  Let's write a plugin of our own.  For our new plugin, we will allow the insertion of links to Wikipedia articles.  We will show a hint card when typing `dbp:word`.

There are three parts interacting when writing a plugin:

  - The editor: processes input
  - A service: is informed about new events, and decides where to provide hints
  - A card: is shown to the user, and allows manipulation of a region

### Creating our own plugin

A plugin can be generated from a blueprint.  We have already ran the blueprint and we've added a few files to interact with dbpedia, a service that extracts semantic information from Wikipedia articles.

In our plugin we will have to edit four files.  The mentioned `addons` folder can be found as a subfolder of `/node_modules/@lblod/ember-rdfa-editor-wikipedia-slug-plugin/`
  - `addon/services/rdfa-editor-wikipedia-slug-plugin.js`: Service which identifies relevant text and provides highlights
  - `addon/templates/components/editor-plugins/wikipedia-slug-card.hbs`: Visual representation of our hint card
  - `addon/components/editor-plugins/wikipedia-slug-card.js`: JavaScript logic foc our hint card
  - `/app/config/editor-profiles.js`: Contains all enabled plugin services for our editor (we need to add ours, this is not relative to the addon)

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
