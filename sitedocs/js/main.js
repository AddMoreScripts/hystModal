hljs.initHighlightingOnLoad();


// Modals
if (typeof HystModal !== "undefined") {
    var xMod = new HystModal.modal({
        linkAttributeName: 'data-hystmodal',
        catchFocus: true,
        afterClose: function(modal){
            let videoframe = modal.openedWindow.querySelector('iframe');
            if(videoframe){
                videoframe.src = videoframe.src;
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