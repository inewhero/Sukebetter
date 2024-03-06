// ==UserScript==
// @name         Sukebetter-JS
// @homepage     https://greasyfork.org/zh-CN/scripts/488024-sukebetter-js
// @version      0.2
// @description  Open images without annoying ads
// @author       yosoro
// @grant        GM_xmlhttpRequest
// @match        *://sukebei.nyaa.si/*
// @match        *://javball.com/*
// @match        *://ovabee.com/*
// @match        *://cnxx.me/*
// @match        *://ai18.pics/*
// @match        *://porn4f.com/*
// @match        *://idol69.net/*
// @match        *://cnpics.org/*
// @match        *://cosplay18.pics/*
// @match        *://pig69.com/*
// @connect      *://javball.com/*
// @connect      *://ovabee.com/*
// @connect      *://cnxx.me/*
// @connect      *://ai18.pics/*
// @connect      *://porn4f.com/*
// @connect      *://idol69.net/*
// @connect      *://cnpics.org/*
// @connect      *://cosplay18.pics/*
// @connect      *://pig69.com/*
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
                    console.log('remove ad scripts: ' + fcscripts[i].attributes.src.value);
                    fcscripts[i].remove();
                }
            } else if (fcscripts[i].text) {
                if (fcscripts[i].text.search(/adConfig/i) != -1){
                    console.log('remove ad scripts: ' + fcscripts[i].text.value);
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
            let thumbs = [];
            let detail_elements = document.getElementById('torrent-description').innerHTML;
            let thumb_regex = /<a href="([^"]+\_s.jpg)"[^>]*>/g;
            let thumb_addr;
            while ((thumb_addr = thumb_regex.exec(detail_elements)) != null) {
                thumbs.push(thumb_addr[1]);
            }

            //picture async load
            let thumb_parent = document.querySelector('#torrent-description > hr:nth-child(4) + p');
            thumbs.forEach(url => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function(response) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(response.responseText, 'text/html');
                        let realimg = doc.getElementsByTagName('meta')['twitter:image:src'].content;
                        let real_thumb = document.createElement('img');
                        real_thumb.src = realimg;
                        console.log('fetch thumb: ' + realimg);
                        thumb_parent.innerHTML = "";
                        thumb_parent.appendChild(real_thumb);
                    },
                    onerror: function(error) {
                        console.error("GET error: ", error);
                    }
                });
            });
        }


    //picture beds ad remove
    } else {
        let realimg=document.getElementsByTagName('meta')['twitter:image:src'].content;
        window.open(realimg,'_self');
    }
})();
