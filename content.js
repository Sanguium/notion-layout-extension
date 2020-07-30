'use-strict';

function setSectionVisibility(section, visible, button) {
    if (visible) {
        // Show section
        section.style.height = null;
        section.style.display = null;
        button.classList.add('nle-enabled');
    } else {
        // Hide section
        section.style.height = 0;
        section.style.display = "none";
        button.classList.remove('nle-enabled');
    }
}

// Called every time something new loads inside Notion window
// e.g. you navigate to a different Notion page
function onPageChange() {
    console.log("Notion Layout Improver: Something changed");

    // Find the block with properties list
    processSections(".notion-scroller.vertical > div:nth-child(2)[style='width: 100%; font-size: 14px;']",
        'Toggle properties',
        'nle-properties-button',
        true,
        function (section) {
            section.classList.add('properties-container')
        });

    processSections(".notion-scroller.vertical > div.notion-page-content",
        'Toggle content',
        'nle-content-button',
        false);
}

function processSections(selector, buttonText, buttonClass, hide, extraProcess = null) {
    let sections = document.querySelectorAll(selector);

    // For each found properties list
    sections.forEach(function (section) {
        console.log(`Found sections ${selector}`);

        // If already processed this properties list do nothing
        if (section.hasAttribute("nle_already_processed")) {
            return;
        }

        console.log("Notion Layout Improver: Processing new section");
        // section.classList.add('properties-container');

        // Set up the properties toggle button
        let toggleButton = createToggleButton(buttonText, buttonClass, section, !hide);

        // Add the toggle button and hide the list
        section.parentElement.appendChild(toggleButton);
        setSectionVisibility(section, !hide, toggleButton);

        section.setAttribute("nle_already_processed", '');

        if (extraProcess) {
            extraProcess(section);
        }
    });
}

function createToggleButton(text, buttonClass, section, initialState) {
    let isVisible = initialState;
    let button = document.createElement('button');
    button.classList.add('nle-toggle-button');
    button.classList.add(buttonClass);
    button.innerHTML = `<svg viewBox=\"0 0 14 14\" class=\"typesSelect\" style=\"width: 16px; height: 16px; display: block; 
    flex-shrink: 0; backface-visibility: hidden;\"><path d=\"M7,13 C10.31348,13 13,10.31371 13,7 C13,3.68629 10.31348,1 7,1 
    C3.68652,1 1,3.68629 1,7 C1,10.31371 3.68652,13 7,13 Z M3.75098,5.32278 C3.64893,5.19142 3.74268,5 3.90869,5 L10.09131,5 
    C10.25732,5 10.35107,5.19142 10.24902,5.32278 L7.15771,9.29703 C7.07764,9.39998 6.92236,9.39998 6.84229,9.29703 L3.75098,5.32278 Z\">
    </path></svg> ${text}`;

    button.onclick = function () {
        isVisible = !isVisible;
        setSectionVisibility(section, isVisible, button);
    }

    return button;
}

// This calls onPageChange function each time Notion window changes
// e.g. you navigate to a new Notion page
const targetNode = document.body;
const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(onPageChange);
observer.observe(targetNode, config);