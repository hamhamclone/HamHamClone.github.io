'use strict';

(function() {
    let eidolonEX = document.querySelectorAll('.eidolon');
    let eidolonElements = document.querySelectorAll('.eidolon > *');
    console.log(eidolonEX);
    let index = 0;
    for (let eidolonElement of eidolonElements) {
        let text = eidolonElement.innerHTML;
        eidolonElement.innerHTML = '';
        console.log(text);
        let output = '';
        let words = text.split(/(\W+)/);
        let whitespace = text.split(/\S+/);
        for (let i = 0; i < words.length; i+=2) {
            let word = words[i];
            if (i+1 < words.length) {
                word+=words[i+1];
            }
            let outWord = "<span class='ei' style='animation-delay: "+Math.floor(index*20+(index%2==0?-3500:-7000))+"ms'>"+word+"</span>";
            eidolonElement.class='ei';
            eidolonElement.innerHTML += outWord;
            if (word.length > 0 && word[word.length-1] == ' ') {
                eidolonElement.innerHTML += ' ';
            }
            index++;
        }
    }
}) ();
