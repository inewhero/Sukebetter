// ==UserScript==
// @name         Sukebetter-JS
// @homepage     https://github.com/inewhero/Sukebetter/tree/Sukebetter-JS
// @version      0.1
// @description  Open images without annoying ads
// @author       yosoro
// @match        *://javball.com/*
// @match        *://ovabee.com/*
// @match        *://cnxx.me/*
// @match        *://ai18.pics/*
// @match        *://porn4f.com/*
// @match        *://idol69.net/*
// @match        *://cnpics.org/*
// @match        *://cosplay18.pics/*
// @match        *://pig69.com/*
// @match        *://sukebei.nyaa.si/*
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    //sukebei.nyaa.si ad remove
    if (window.location.origin=='https://sukebei.nyaa.si') {
        let fcscripts = document.getElementsByTagName('script');
        for (let i = 0; i < fcscripts.length; i++) {
            if (fcscripts[i].attributes.src) {
                if (fcscripts[i].attributes.src.value.search(/min/i) == -1){
                    console.log('remove ad scripts:' + fcscripts[i].attributes.src.value);
                    fcscripts[i].remove();
                }
            } else if (fcscripts[i].text) {
                if (fcscripts[i].text.search(/adConfig/i) != -1){
                    console.log('remove ad scripts:' + fcscripts[i].text.value);
                    fcscripts[i].remove();
                }
            }
        }
        document.getElementById('e71bf691-4eb4-453f-8f11-6f40280c18f6').remove();
        console.log('* Banner ad is removed.');
        let wrapper_elements = document.getElementsByClassName('exo_wrapper');
        setTimeout(function() {
            while (wrapper_elements.length > 0){
                document.querySelector("body > style").remove();
                wrapper_elements[0].parentNode.removeChild(wrapper_elements[0]);
                console.log('* Toast ad is removed.');
            }
        }, 2000);

        //sukebei.nyaa.si thumbnails detect
        if (window.location.pathname.includes('view')) {
            let detail_elements = document.getElementById('torrent-description').innerHTML;
            let thumb_regex = /<a href="([^"]+\_s.jpg)"[^>]*>/g;
            let thumb_addr;
            while ((thumb_addr = thumb_regex.exec(detail_elements)) != null) {
                window.open(thumb_addr[1], "_blank");
            }
        }

    //picture beds ad remove
    } else {
        let realimg=document.getElementsByTagName('meta')['twitter:image:src'].content;
        console.log(realimg);
        window.open(realimg,'_self');
    }
})();
