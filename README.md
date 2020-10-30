# HystModal

Lightweight and flexible JavaScript modal library

[Documentation](https://addmorescripts.github.io/hystModal/) | [In Russian](https://addmorescripts.github.io/hystModal/index_ru.html) | [README in Russian](https://github.com/AddMoreScripts/hystModal/blob/master/README_ru.md)

## Features.

- **The size is 3 kB (gzip), doesn't need any dependencies**. HystModal is written in pure JavaScript, does not require jQuery or other libraries to work
- **Carefully designed UX for ease of use**. Prevent scrolling of the background, three ways to close the window, scroll bar tracking, centering the modal.
- **Full customizable by CSS.** Styles of the modal window and background is completely determined in CSS. Based on Flexbox, modals can have any CSS transitions.
- **Without changing the DOM of page** Modal opening is performed only by CSS. All custom event listeners on elements inside the modal will not stop working.
- **A11y and capture the focus.** Designed with accessibility in mind and WAI-ARIA recommendations. When you opened the modal focus is captures inside.
- **Works in Internet Explorer 11.** Works without problems in IE11 and all modern browsers. Don't need any polyfills or transpiler.

## Usage
1. Download and unpack the latest version of hystModal
2. Connect hystmodal.min.js and hystmodal.min.css from "dist" folder to the page:

    ```html
    <link rel="stylesheet" href="hystmodal.min.css">
    <script src="hystmodal.min.js"></script>
    ```

3. Put the following markup in your HTML document:

    ```html
    <div class="hystmodal" id="myModal" aria-hidden="true">
        <div class="hystmodal__wrap">
            <div class="hystmodal__window" role="dialog" aria-modal="true">
                <button data-hystclose class="hystmodal__close">Close</button>  
                <!-- You modal HTML markup -->
            </div>
        </div> 
    </div>
    ```
   
**.hystmodal**  - Main selector of the modal. It must have a unique id attribure. This selector don't get focus when modal is closed, due CSS rules visbility:hidden. Attribute aria-hidden is switches automatically.

**.hystmodal__wrap**  - scrolled area under the modal window. Due of settings, it can close modal window on click/tap. This selecor don't have background by default. Selector .hystmodal__shadow, which obscures the page content is added automatically directly before closing <body> tag, when the script is loaded.

**.hystmodal__window** - Modal box. WAI-ARIA recommends adding attribute aria-labelledby with descriptions of the modal for better accessibility.

**[data-hystclose]** - selector with data-hystclose attribute is closing current modal window on mouse click, if this set on in configuration. This selector may contains in any place inside .hystmodal__window

4. Place following JS code for activating functionality of modals:

    ```js
    const myModal = new HystModal({
        linkAttributeName: "data-hystmodal",
        //settings (optional). see Configuration
    });
    ```

5. Add attribute data-hystmodal on element that will be opening the modal window. Value of the attribute must be CSS selector (id or class name of the window). For example:

    ```html
    <a href="#" data-hystmodal="#myModal">Open modal with id=myModal</a>
    ```

Title of data-attribute, which opening the modals, is defined by value of the property linkAttributeName of the configurations object.

6. If necessary, change the сonfiguration.


## Configuration

|Parameter|Type|Default|Description|
|--|--|--|--|
|linkAttributeName|String|Empty string|Define data-attribute of selector, which will be opening modal window on mouse click. Value of this attribute in HTML tag must be equal of CSS selector (id or class) of the modal window selector, which need to be open. If the property is not defined, event handlers will not be activated.|
|closeOnOverlay|Boolean|true|Allow/disallow closing windows by click or tap on overlay (selector with class .hystmodal__wrap )|
|closeOnEsc|Boolean|true|Allow/disallow closing windows by pressing ESC on the keyboard|
|closeOnButton|Boolean|true|Allow/disallow closing windows by click on element with attribute data-hystclose. If there are multiple selectors with this attribute, modal window will closed by click on any of this|
|waitTransitions|Boolean|false|If true – modal window will be closed after ending of CSS-transition of elements .hystmodal__window. If false – modal window will be closed instantly. So that the opening also took place instantly – delete CSS property transition of .hystmodal__window and set the option waitTransitions:false.|
|catchFocus|Boolean|true|If true – when modal window is opened, focus will looped on active elements inside modal. When modal window closing, focus returning on previous selector.|
|fixedSelectors|string|"*[data-hystfixed]"|Contains a css selector that adds an margin-right equal to the width of the scroll bar when opening a modal window. Useful for fixed elements on a page to avoid shifting them when opening a window. Works only if the property backscroll:true |
|backscroll|boolean|true|If true - the scrolling will be blocked when the window is opened. If false, scrolling is not blocked (if the modal window is high, double scrolling may occur)|
|beforeOpen|function|Empty function|Callback function. Run before opening of the modal. A modal window object (see API) is passed to the function as argument.|
|afterClose|function|Empty function|Callback function. Run after closing of the modal. A modal window object (see API) of the closed window is passed to the function as argument.|


## Configuration example

```html
const myModal = new HystModal({
    linkAttributeName: 'data-hystmodal',
    catchFocus: true,
    waitTransitions: true,
    closeOnEsc: false,
    beforeOpen: function(modal){
        console.log('Message before opening the modal');
        console.log(modal); //modal window object
    },
    afterClose: function(modal){
        console.log('Message after modal has closed');
        console.log(modal); //modal window object
    },
});
```

## API

When creating an instance of a class HystModal by code new HystModal({ ... }), variable myModal will contain object, which contain properties and methods.


### Properties


|Title|Type|Description|
|--|--|--|
|isOpened|Boolean|Modal open indicator. True - modal window is open in this moment. False - by default. Many private methods of the library are guided by the value of this property.|
|openedWindow|DOM node|Selector of current opened modal window. If window is closed - contain selector of last opened window.|
|starter|DOM node|Selector from which the modal window was opened. Used to return focus to an element.|
|config|object|Configuration object. See Configuration.|


### Methods


|Title|Description|
|--|--|
|init()|Initializes the modal window functionality and enables event handling on the page. If the linkAttributeName property is specified, init runs automatically when an instance of the HystModal is created. You can specify the linkAttributeName:false when creating instance of the HystModal, and add property later (for example: myModal.config.linkAttributeName = 'data-othermodal'). Then you must manually call the myModal.init(). Initialization can only do once.|
|open(selector)|Open modal window. selector – a CSS selector of modal window as a string, for example: myModal.open("#modal-1"). If «selector» is not specified – will open last opened window, or there will be no action. If opening new window while the old one is not closed, the previous window is closed first, and then a new window is opened.|
|close()|Closes the currently open modal window.|
