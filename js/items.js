document.addEventListener("DOMContentLoaded", async function() {

    let key = '';
    let value = '';
    let currentIndex = 0;
    let items = [];
    let filtereditems = [];

    // Fetch JSON data - Ahamdreza
    async function fetchItems() {
        try {
            const response = await fetch("data/items.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            items = jsonData.items;

            // Apply filtering
            filter(items);

            // Display the first item if results exist
            if (filtereditems.length > 0) {
                displayItem(currentIndex);
                regNarrative(); // Build different narratives based on the current selection
                dateNarrative();
                mealNarrative();
                ingredNarrative();
                prepNarrative();
            } else {
                console.log("No matching items found.");
            }
        } catch (error) {
            console.error("Error loading items:", error);
        }
    }
    // end fetch

    //filtering - Ahmadreza
    function filter(arr) {
        const querystring = window.location.search;
        const urlParams = new URLSearchParams(querystring);

        // Reset filtered items
        filtereditems = [];

        // Extract the first key-value pair
        for (let [k, v] of urlParams.entries()) {
            key = k;
            value = v.replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/\b\w/g, match => match.toUpperCase());
            break; // Only process the first key-value pair
        }

        // If no valid key-value pair, return all items
        if (!key || !value) {
            filtereditems = [...items]; // Clone items to avoid reference issues
            return;
        }

        // Convert key to lowercase for case-insensitive comparison
        const lowerKey = key.toLowerCase();
        const lowerValue = value.toLowerCase();

        for (let item of arr) {
            if (
                (lowerKey === 'region' && item.info.Region ?.toLowerCase() === lowerValue) ||
                (lowerKey === 'date' && item.info.Date ?.toLowerCase().includes(lowerValue)) ||
                (lowerKey === 'meal' && item.info.Meal ?.toLowerCase() === lowerValue) ||
                (lowerKey === 'ingredient' && item.info.Ingredient ?.toLowerCase() === lowerValue) ||
                (lowerKey === 'preparation' && item.info.preparation ?.toLowerCase() === lowerValue) ||
                (lowerKey === 'itemname' && item.itemName ?.toLowerCase().includes(lowerValue))
            ) {
                filtereditems.push(item);
            }
        }
    }


    // Display item data in HTML - Zahra
    function displayItem(index) {
        if (index < 0 || index >= filtereditems.length) return;
        let item = filtereditems[index];

        document.getElementById("item-heading").innerHTML = item.itemName;
        document.getElementById("item-img").innerHTML = `<img src="${item.image}" alt="${item.itemName}">`;
        document.getElementById("reg-name").innerHTML = item.info.Region;
        document.getElementById("date-name").innerHTML = item.info.Date;
        document.getElementById("meal-name").innerHTML = item.info.Meal;
        document.getElementById("ingredient-name").innerHTML = item.info.Ingredient;
        document.getElementById("prep-name").innerHTML = item.info.preparation;
        document.getElementById("shortInfo").innerHTML = item.shortDesc;
        document.getElementById("longerInfo").innerHTML = item.longDesc;
        document.getElementById("longerInfo").style.display = "none";
        document.getElementById("shortInfo").style.display = "block";

        // Reset buttons when switching items
        document.getElementById("moreBtn").innerText = "Tell Me More"; // Ensure correct button text
        document.getElementById("moreBtn").style.display = "block"; // Ensure "Tell Me More" is visible
        document.getElementById("lessBtn").style.display = "none"; // Hide "Tell Me Less"

        isShowingFullDescription = false; // Reset description state
    };



    // Event listeners for navigation to next and previous items - Zahra
    // next item button
    document.querySelector(".next-btn").addEventListener("click", function(event) {
        event.preventDefault();
        if (currentIndex < filtereditems.length - 1) {
            currentIndex++;
            displayItem(currentIndex);
            regNarrative(); // Update narratives on the user's navigation
            dateNarrative();
            mealNarrative();
            ingredNarrative();
            prepNarrative();
        }
    });
    // previous button item
    document.querySelector(".previous-btn").addEventListener("click", function(event) {
        event.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            displayItem(currentIndex);
            regNarrative(); // Update narratives on the user's navigation
            dateNarrative();
            mealNarrative();
            ingredNarrative();
            prepNarrative();
        }
    });


    // Toggle description - Zahra
    let isShowingFullDescription = false;
    //show more information from JSON file
    document.getElementById("moreBtn").addEventListener("click", async function() {
        const item = filtereditems[currentIndex]; // Ensure you get the current item
        const descriptionElement = document.getElementById("longerInfo");
        if (item) {
            try {
                if (!isShowingFullDescription && item.longerDesc) {
                    // Load the longer description
                    const response = await fetch(item.longerDesc);
                    if (response.ok) {
                        const content = await response.text();
                        descriptionElement.innerHTML = content;
                        document.getElementById("shortInfo").style.display = "none";
                        descriptionElement.style.display = "block";
                        document.getElementById("moreBtn").innerText = "Tell Me Even More";
                        document.getElementById("lessBtn").style.display = "block";
                        isShowingFullDescription = true;
                    } else {
                        console.error(`Failed to load: ${item.longerDesc}`);
                    }
                } else if (item.fullDesc) {
                    // Load the full description of the item
                    const response = await fetch(item.fullDesc);
                    if (response.ok) {
                        const content = await response.text();
                        descriptionElement.innerHTML = content;
                        descriptionElement.style.display = "block";
                        document.getElementById("moreBtn").style.display = "none";
                    } else {
                        console.error(`Failed to load: ${item.fullDesc}`);
                    }
                }
            } catch (error) {
                console.error("Error fetching description:", error);
            }
        }
    });

    //less button 
    document.getElementById("lessBtn").addEventListener("click", function() {
        const descriptionElement = document.getElementById("longerInfo");
        const shortInfoElement = document.getElementById("shortInfo");
        isShowingFullDescription = false;
        // Return to the short description
        descriptionElement.style.display = "none";
        shortInfoElement.style.display = "block";
        document.getElementById("lessBtn").style.display = "block";
        document.getElementById("moreBtn").style.display = "block";
        document.getElementById("moreBtn").innerHTML = "Tell Me More";

    });

    //fetch data on the item page
    fetchItems();
});
// end description options

//show list of items according to the narrative filter - Ahmadreza
function regNarrative() {
    const aTag = document.querySelector("#reg-name");
    let text = aTag.textContent.trim();
    if (!text) return;
    let par = text.replace(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,
        (_, first, second) => first.toLowerCase() + second
    );
    aTag.setAttribute("href", `item.html?region=${par}`);
};

function dateNarrative() {
    const aTag = document.querySelector("#date-name");
    let text = aTag.textContent.trim();
    if (!text) return;
    let par = text.replace(/\b([A-Z][a-z]+).*\(.*/g,
        (_, first) => first.toLowerCase()
    );
    aTag.setAttribute("href", `item.html?date=${par}`);
};

function mealNarrative() {
    const aTag = document.querySelector("#meal-name");
    let text = aTag.textContent.trim();
    if (!text) return;
    let par = text.replace(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,
        (_, first, second) => first.toLowerCase() + second
    );
    aTag.setAttribute("href", `item.html?meal=${par}`);
};

function ingredNarrative() {
    const aTag = document.querySelector("#ingredient-name")
    let text = aTag.textContent.trim();
    let par = text.replace(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,
        (_, first, second) => first.toLowerCase() + second
    );
    aTag.setAttribute("href", `item.html?ingredient=${par}`);
};

function prepNarrative() {
    const aTag = document.querySelector("#prep-name")
    let text = aTag.textContent.trim();
    let par = text.replace(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,
        (_, first, second) => first.toLowerCase() + second
    );
    aTag.setAttribute("href", `item.html?preparation=${par}`);
};