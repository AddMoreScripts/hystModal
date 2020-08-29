hljs.initHighlightingOnLoad();


// Modals
if (typeof HystModal !== "undefined") {
    var xMod = new HystModal({
        linkAttributeName: 'data-hystmodal',
        catchFocus: true,
        afterClose: function(modal){
            
            //If Youtube video inside Modal, close it on modal closing
            let videoframe = modal.openedWindow.querySelector('iframe');
            if(videoframe){
                videoframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            }
            
        }
    });

}



//Slider Chander on Tabs
function jsTabsCtrl(selector, item){
    const wrapper = document.querySelector(selector);
    const links = wrapper.querySelectorAll(item);
    const linksArray = Array.prototype.slice.call(links);
    if(!wrapper) return;
    wrapper.addEventListener('click', function(e){
        if(!e.target.closest(item)) return;
        e.preventDefault();
        let clickedNum = linksArray.indexOf(e.target.closest(item));
        linksArray[clickedNum].classList.toggle('active');
    })
};
jsTabsCtrl('.faq', '.faq__quest');