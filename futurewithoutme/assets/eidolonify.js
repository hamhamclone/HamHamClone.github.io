'use strict';

(function() {
    let eidolonElements = document.querySelectorAll('.eidolon');
    let index = 0;
    
    for (let eidolonElement of eidolonElements) {
        let clone = delve(eidolonElement);
        console.log(clone);
        eidolonElement.innerHTML = clone.innerHTML;
        clone.remove();
    }

    function delve(node) {
        let nodes = node.childNodes;
        let clone = node.cloneNode();
        clone.innerHTML = '';
        for (let subNode of nodes) {
            if (subNode.nodeType == Node.ELEMENT_NODE) {
                clone.appendChild(delve(subNode));
            } else if (subNode.nodeType == Node.TEXT_NODE) {
                clone.appendChild(split(subNode));
            }
        }
        return clone;
    }
    
    function split(textNode) {
        let eidolonElement = document.createElement('span');
        let text = textNode.textContent;
        let output = '';
        let words = text.split(/( )/);
        console.log(words);
        for (let i = 0; i < words.length; i+=2) {
            let word = words[i];
            if (i+1 < words.length) {
                word+=words[i+1];
            }
            let outWord = "<span class='ei' style='animation-delay: "+Math.floor(index*20+(index%2==0?-5000:-10000))+"ms'>"+word+"</span>";
            eidolonElement.class='ei';
            eidolonElement.innerHTML += outWord;
            if (word.length > 0 && word[word.length-1] == ' ') {
                eidolonElement.innerHTML += ' ';
            }
            index++;
        }
        return eidolonElement;
    }
}) ();
