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

If we can only reuse existing plugins, then we wouldn't be fully in control.  Let's write a plugin of our own.  For our new plugin, we will support the insertion of links to Wikipedia articles.  If the user types `dbp:word`, we will show a hint card proposing to insert a hyperlink to a Wikipedia article. Once the hyperlink is inserted, another plugin will show a card with a snippet from Wikipedia when the cursor is positioned in the hyperlink.

### Creating our own plugin

If you want to create a new plugin, you can generate a skeleton using [https://github.com/lblod/ember-rdfa-editor-plugin-generator](the plugin generator). For this tutorial, we have already prepared two plugins:
- wikipedia-slug-plugin: a plugin that will propose to insert a hyperlink to Wikipedia
- dbpedia-info-plugin: a plugin that will show an info card when clicking a Wikipedia link


The plugins are already installed and included in the `node_modules/@lblod` folder. But the code still contains some TODOs. It's up to you to complete the implementation and make the hint cards work correctly.

First, as with the other plugins, we have to enable the new plugins in the editor configuration:

    // File: frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin",
        "rdfa-editor-date-overwrite-plugin",
        "rdfa-editor-wikipedia-slug-plugin",
        "rdfa-editor-dbpedia-info-plugin"
      ]
    };


Next, we're going to have a look at the source code of the plugins. Keep in mind that there are three parts interacting when writing a plugin:

  - The editor: processes input
  - A service: is informed about new events, and decides where to provide hints
  - A hint card: is shown to the user, and allows manipulation of a region of text in the editor

For the tutorial the following files are relevant:

#### Service

The service, located in `addon/services/rdfa-editor-<your-plugin-name>.js`, is the core of the plugin. The service is in charge of preparing hint cards for text regions it understands based on the editor's intput. For that purpose it typically follows three steps:
1. removing old hints
2. finding relevant contexts where the plugin could apply
3. creating hints to show for these contexts

#### Hint card template

The hint card template, located in `addon/templates/components/editor-plugins/your-name-card.js`, is the visualization of the hint card shown to the user. The hint card allows the user to execute actions on the editor's content. The template will show up in a card at the upper right corner of the editor.

#### Hint card component

The hint card component, located in `addon/components/editor-plugins/your-name-card.js`, is the JavaScript file related to the hint card template. It implements the interactions between the hint card and the editor (e.g. inserting a hyperlink).

#### Complete the plugin's impletation (aka resolve the TODOs)

As the session is quite short we already provided the service, the template and parts of the card of the rdfa-editor-wikipedia-slug-plugin.

- `addon/services/rdfa-editor-wikipedia-slug-plugin.js`: the service which is identifies relevant text and provides highlights in the text. Thanks to the RegEx we search for text matching `dbp:word` in the document, and we create a new hint for each matching result. We can pass useful information to the hint, like here the `word` we are looking for in dbpedia.

- `addon/templates/components/editor-plugins/wikipedia-slug-card.hbs`: the template of our hint cardn showing at the side. It allows us to interact with the user, asking if they really want to insert a link to dbpedia for the word they were looking for.

- `addon/components/editor-plugins/wikipedia-slug-card.js`: JavaScript logic of the hint card component

In this file we will provide you with one function `getDbpediaOptions` that gets the researched word and queries dbpedia to get matching options. It will run everytime the card gets rendered (see `willRender`).

--> To make our card insert a link to wikipedia in the editor you will have to fill the method `generateLink` and modify the `insert` action.

- `generateLink`: this method should generate the link to the word we want to insert in our document. It will look like `https://en.wikipedia.org/wiki/Word`.We will need the `encodeURI` method in order to escape the string.
- `insert`: this method is triggered by clicking the "add" button of the template. It selects the researched word that we get from the hint and replaces it by the link generated on the previous method. For this we can use the `selectHighlight` and the `update` methods on the editor.




