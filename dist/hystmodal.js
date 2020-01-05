/*  
    HystModal - Lightweight and flexible JavaScript modal library
    https://github.com/AddMoreScripts/hystModal
    version 0.1
*/


;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.HystModal = factory();
    }
}(this, function () {
    "use strict"



    //Polyfils for matches and closest
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
    }
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (css) {
            let node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }



    function modal(props) {
        if (!props) {
            props = {};
        }
        this.config = {
            backscroll: (typeof props.backscroll !== "undefined") ? props.backscroll : true,
            linkAttributeName: (typeof props.linkAttributeName !== "undefined") ? props.linkAttributeName : false,
            closeOnOverlay: (typeof props.closeOnOverlay !== "undefined") ? props.closeOnOverlay : true,
            closeOnEsc: (typeof props.closeOnEsc !== "undefined") ? props.closeOnEsc : true,
            closeOnButton: (typeof props.closeOnButton !== "undefined") ? props.closeOnButton : true,
            waitTransitions: (typeof props.waitTransitions !== "undefined") ? props.waitTransitions : false,
            catchFocus: (typeof props.catchFocus !== "undefined") ? props.catchFocus : true,
            beforeOpen: (typeof props.beforeOpen === "function") ? props.beforeOpen.bind(self) : function () { },
            afterClose: (typeof props.afterClose === "function") ? props.afterClose.bind(self) : function () { },
        }
        if (typeof (props) == "string") {
            this.config.linkAttributeName = props;
        }
        if (this.config.linkAttributeName) {
            this.init();
        }
        
    }
    


    modal.prototype.init = function () {
        if(this._focusElements){
            console.log('Warning: HystModal cannot be initialized twice');
            return;
        }
        this.isOpened = false;
        this.openedWindow = false;
        this.starter = false,
        this._closeAfterTransition = this._closeAfterTransition.bind(this),
        this._nextWindows = false;
        this._scrollPosition = 0;
        this._reopenTrigger = false;
        this._overlayChecker = false,
        this._isMoved = false;
        this._shadow = document.createElement('div');
        this._focusElements = [
            'a[href]',
            'area[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ];
        this._shadow.classList.add('hystmodal__shadow');
        document.body.appendChild(this._shadow);
        this.eventsFeeler();
        
    }



    modal.prototype.open = function (selector) {
        if (selector) {
            if (typeof (selector) === "string") {
                this._nextWindows = document.querySelector(selector);
            } else {
                this._nextWindows = selector;
            }
        }
        if (!this._nextWindows) {
            console.log("Warinig: hustModal selector is not found");
            return;
        }
        if (this.isOpened) {
            this._reopenTrigger = true;
            this.close();
            return;
        }
        this.openedWindow = this._nextWindows;
        this.config.beforeOpen(this);
        this._bodyScrollControl();
        this._shadow.classList.add("hystmodal__shadow--show");
        this.openedWindow.classList.add("hystmodal--active");
        this.openedWindow.style.visibility = "visible";
        this.openedWindow.setAttribute('aria-hidden', 'false');
        if (this.config.catchFocus) this.focusContol();
        this.isOpened = true;
    }



    modal.prototype.close = function () {
        if (!this.isOpened) {
            //console.log("Error: hystModal window is not open");
            return;
        }
        if (this.config.waitTransitions) {
            const modalBlock = this.openedWindow.querySelector('.hystmodal__window');
            modalBlock.addEventListener("transitionend", this._closeAfterTransition);
            this._isMoved = true;
            this.openedWindow.classList.remove("hystmodal--active");
            this._shadow.classList.remove("hystmodal__shadow--show");
        } else {
            this.openedWindow.style.transition = "none";
            this._shadow.style.transition = "none";
            this.openedWindow.classList.remove("hystmodal--active");
            this._shadow.classList.remove("hystmodal__shadow--show");
            this._closeAfterTransition();
        }
        this.openedWindow.setAttribute('aria-hidden', 'true');
        this.openedWindow.style.transition = "";
        this._shadow.style.transition = "";
    }



    modal.prototype._closeAfterTransition = function (e) {
        if (this.config.catchFocus) this.focusContol();
        this._bodyScrollControl();
        this.isOpened = false;
        this.openedWindow.scrollTop = 0;
        this.openedWindow.style.visibility = "";
        this._isMoved = false;
        this.config.afterClose(this);
        if(e) e.currentTarget.removeEventListener("transitionend", this._closeAfterTransition);
        if (this._reopenTrigger) {
            this._reopenTrigger = false;
            this.open();
        }
    }



    modal.prototype.eventsFeeler = function () {

        document.addEventListener("click", function (e) {
            const clickedlink = e.target.closest("[" + this.config.linkAttributeName + "]");
            if (!this._isMoved && clickedlink) {
                e.preventDefault();
                this.starter = clickedlink;
                const targetSelector = this.starter.getAttribute(this.config.linkAttributeName);
                this._nextWindows = document.querySelector(targetSelector);
                this.open();
                return;
            }
            if (this.config.closeOnButton && e.target.closest('[data-hystclose]')) {
                this.close();
            }
        }.bind(this));

        if (this.config.closeOnOverlay) {

            document.addEventListener('mousedown', function (e) {
                if (!this._isMoved && (e.target instanceof Element) && !e.target.matches('.hystmodal__wrap')) return;
                this._overlayChecker = true;
            }.bind(this));

            document.addEventListener('mouseup', function (e) {
                if (!this._isMoved && (e.target instanceof Element) && this._overlayChecker && e.target.classList.contains('hystmodal__wrap')) {
                    e.preventDefault();
                    !this._overlayChecker;
                    this.close();
                    return;
                }
                this._overlayChecker = false;
            }.bind(this));

        }

        window.addEventListener("keydown", function (e) {
            if (!this._isMoved && this.config.closeOnEsc && e.which == 27 && this.isOpened) {
                e.preventDefault();
                this.close();
            }
            if (!this._isMoved && this.config.catchFocus && e.which == 9 && this.isOpened) {
                this.focusCatcher(e);
            }
        }.bind(this));

    }



    modal.prototype._bodyScrollControl = function () {
        if(!this.config.backscroll) return;
        if (this.isOpened === true) {
            document.documentElement.classList.remove("hystmodal__opened");
            document.documentElement.style.marginRight = "";
            window.scrollTo(0, this._scrollPosition);
            document.documentElement.style.top = "";
            return;
        }
        this._scrollPosition = window.pageYOffset;
        let marginSize = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.top = -this._scrollPosition + "px";
        if (marginSize) {
            document.documentElement.style.marginRight = marginSize + "px";
        }
        document.documentElement.classList.add("hystmodal__opened");
    }



    modal.prototype.focusContol = function () {
        const nodes = this.openedWindow.querySelectorAll(this._focusElements);
        if (this.isOpened && this.starter) {
            this.starter.focus();
        } else {
            if (nodes.length) nodes[0].focus();
        }
    }



    modal.prototype.focusCatcher = function (e) {
        const nodes = this.openedWindow.querySelectorAll(this._focusElements);
        const nodesArray = Array.prototype.slice.call(nodes);
        if (!this.openedWindow.contains(document.activeElement)) {
            nodesArray[0].focus();
            e.preventDefault();
        } else {
            const focusedItemIndex = nodesArray.indexOf(document.activeElement)
            if (e.shiftKey && focusedItemIndex === 0) {
                focusableNodes[nodesArray.length - 1].focus();
            }
            if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
                nodesArray[0].focus();
                e.preventDefault();
            }
        }
    }



    return {
        modal: modal,
    }
    //export end
}));













