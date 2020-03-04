# Getting started
    
Welcome to this getting started tutorial! We will walk you through the editor possibilities 
with the help of a demo application. 

## Setting up the stack

To run that stack you will need to have npm, docker and ember installed.

Backend

    git clone https://github.com/lblod/app-rdfa-editor-demo.git
    cd app-rdfa-editor-demo
    docker-compose up

Frontend (the node modules are pre-included in the repository in case of slow internet)

    git clone https://github.com/lblod/frontend-rdfa-editor-demo.git
    cd frontend-rdfa-editor-demo
    ember serve --proxy http://host


## Adding an existing plugins : date and date-overwrite

You can reuse existing plugins to enhance your editor. We will go over two examples of plugin integration here.
They both have been installed in the frontend.

### ember-rdfa-editor-date-plugin

This plugin allows you to insert a date in the editor. When you type 'DD/MM/YYYY' a card should pop up, 
asking you if you want to insert it as a date with the appropriate rdfa tags.

To allow our plugin in the frontend

    frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-plugin"
      ],
      all: [
        "rdfa-editor-date-plugin"
      ],
      none: []
    };

Now you should be able to insert a date in your document ! When you click on the insert button on the card, the 
following HTML will be inserted in your document.


### ember-rdfa-editor-date-overwrite-plugin

This plugin allows you to change a date in your document, RDFa content included.

To allow our plugin in the frontend

    frontend-rdfa-editor-demo/app/config/editor-profiles.js

    export default {
      default: [
        "rdfa-editor-date-overwrite-plugin"
      ],
      all: [
        "rdfa-editor-date-overwrite-plugin"
      ],
      none: []
    };

If you now click on the date in the editor, a card will pop up, allowing you to change the date.

### Customizing our plugin by creating new ones

In this tutorial we are going to create a plugin that generates automatic links to wikipedia when we type `dbp:word`. When the plugin gets generated we will have to focus on 3 main files:
- `addon/services/rdfa-editor-your-name-plugin.js`
- `addon/components/editor-plugins/your-name-card.js`
- `addon/templates/components/editor-plugins/your-name-card.js`

The first one is the service where we will identify the relevant text on the editor and generate cards for it. In this case our relevant text is everything of the type `dbp:word` and the card will ask the user if he wants to replace it for the wikipedia link.

#### Service

This is the file `addon/services/rdfa-editor-your-name-plugin.js`. Here we will have to modify 2 methods:
- `detectRelevantContext`: this method receives a context and returns a `Boolean` indicating if the context is relevant to our plugin or not, the context is a complex object representing a section of the document, you can read more about it here. For this use case we will use its `text` property where we can use RegEx to see if it matches the structure `dbp:word`.
- `generateHintsForContext`: this method receives a context that we already know that's relevant and creates a hint for it, we can completely customize the hint and card generation process but we will follow the one that's already there, for that we will need to create a card with a text and a location, the location is the characters that we will highlight, and the text is some text we will pass down to the card, in this case we will get the location of the characters that form the string `dbp:word` and will pass down `word` as a string.

#### Plugin Component

This is related to the file `addon/components/editor-plugins/your-name-card.js`. In this file we will provide you with one function `getDbpediaOptions` that gets the term and set the variable this.options containing an array with all the relevant options found on dppedia in order to link to wikipedia. We will also link this function to the `willRender` hook of the component, which is an Ember thick to ensure the function will run before showing the card.
For this file you will have to create new function called `generateLink` and modify the `insert` action.
- `generateLink`: this method is very basic, it will just generate the link html getting the first option from the this.options array. The link will be like `https://en.wikipedia.org/wiki/Word`, also we will have to use the js `encodeURI` method in order to escape the string.
- `insert`: this method is triggered by clicking the "add" button of the template. It selects the highlighted string that we get from the hint (we get the location on the component) and replaces it by the link generated on the previous method. For this we can use the `selectHighlight` and the `update` methods on the editor

#### Template

This is related to the file `addon/templates/components/editor-plugins/your-name-card.js` this is the simplest step, we just have to replace the text in the card by a question asking the user if he wants to replace the text by a link to the word we got in the options, for this we will use the ember get helper that has the following structure `{{get array index}}`.
