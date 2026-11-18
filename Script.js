/*
    File contains all required functions for the assesment
*/

// GAME_DATA from question paper 

const games = [
    {
        id: 1,
        title: "Hollow Knight",
        normalPrice: 14.99,
        salePrice: 7.49,
        store: "Steam"
    },
    {
        id: 2,
        title: "Stardew Valley",
        normalPrice: 13.99,
        salePrice: 13.99,
        store: "GOG"
    },
    {
        id: 3,
        title: "Celeste",
        normalPrice: 19.99,
        salePrice: 4.99,
        store: "Steam"
    },
    {
        id: 4,
        title: "Hades",
        normalPrice: 24.99,
        salePrice: 12.49,
        store: "Epic Games"
    },
    {
        id: 5,
        title: "Portal 2",
        normalPrice: 9.99,
        salePrice: 0.99,
        store: "Steam"
    },
    {
        id: 6,
        title: "Terraria",
        normalPrice: 9.99,
        salePrice: 9.99,
        store: "GOG"
    },
    {
        id: 7,
        title: "Disco Elysium",
        normalPrice: 39.99,
        salePrice: 9.99,
        store: "GOG"
    },
    {
        id: 8,
        title: "Cuphead",
        normalPrice: 19.99,
        salePrice: 14.99,
        store: "Steam"
    }
];

//function to filter games on sale
function filterGamesOnSale(gameList) {
    return gameList.filter(function (game) {
        return game.salePrice < game.normalPrice;
    });
}

//Calculate discount percentage
function calculateDiscountPercentage(game) {
    if (game.normalPrice <= 0) {//should be invalid
        return 0;
    }
    if (game.salePrice >= game.normalPrice){ //should be invalid
        return 0;
    }

    const saving =
        game.normalPrice - game.salePrice;

    const percentage =
        (saving / game.normalPrice) * 100;

    return Math.round(percentage);
}

//find min by SalePrice, not normal
function findCheapestGame(gameList) {
    if (gameList.length === 0) { //No games
        return null;
    }

    let cheapestGame = gameList[0];

    for (let i = 1; i < gameList.length; i++) {
        if (
            gameList[i].salePrice <
            cheapestGame.salePrice
        ) {
            cheapestGame = gameList[i];
        }
    }
    return cheapestGame;
}

//Search (case should not matter)
function searchGamesByTitle(gameList, searchText) {
    const searchValue =
        searchText
            .trim()
            .toLowerCase();

    return gameList.filter(function (game) {
        return game.title
            .toLowerCase()
            .includes(searchValue);
    });
}

// HTML elements

const gameListElement =
    document.getElementById("gameList");

const searchInput =
    document.getElementById("searchInput");

const saleOnlyCheckbox =
    document.getElementById("saleOnly");

const cheapestButton =
    document.getElementById("cheapestButton");

const resetButton =
    document.getElementById("resetButton");

const summaryElement =
    document.getElementById("summary");

const noResultsElement =
    document.getElementById("noResults");

// ID of the currently highlighted game
let highlightedGameId = null;


//Get highlighted game
function getVisibleGames() {
    // First search by title
    let visibleGames =
        searchGamesByTitle(
            games,
            searchInput.value
        );
    // Then filter by sale status if checked
    if (saleOnlyCheckbox.checked) {
        visibleGames =
            filterGamesOnSale(visibleGames);
    }

    return visibleGames;
}

//Display games
function displayGames() {
    const visibleGames =
        getVisibleGames();
    // Clear existing cards
    gameListElement.innerHTML = "";
    // Display number of games

    summaryElement.textContent =
        `${visibleGames.length} of ${games.length} games shown.`;

    // Check if there are results
    if (visibleGames.length === 0) {
        noResultsElement.style.display = "block";
        return;
    } else {
        noResultsElement.style.display = "none";
    }

    // Create a card for each game
    visibleGames.forEach(function (game) {
        const card =
            document.createElement("article");
        card.classList.add("game-card");

        // Highlight cheapest game
        if (game.id === highlightedGameId) {
            card.classList.add("cheapest");
        }

        // Game title
        const title =
            document.createElement("h2");

        title.textContent =
            game.title;

        card.appendChild(title);

        // Store
        const store =
            document.createElement("p");
        store.classList.add("store");

        store.textContent =
            `Store: ${game.store}`;

        card.appendChild(store);

        // Prices
        const priceContainer =
            document.createElement("div");

        priceContainer.classList.add(
            "price-container"
        );

        const salePrice =
            document.createElement("p");

        salePrice.classList.add(
            "sale-price"
        );

        salePrice.textContent =
            `R${game.salePrice.toFixed(2)}`;

        priceContainer.appendChild(
            salePrice
        );

        // ON SALE 
        if (
            game.salePrice <
            game.normalPrice
        ) {

            const normalPrice =
                document.createElement("p");

            normalPrice.classList.add(
                "normal-price"
            );

            normalPrice.textContent =
                `R${game.normalPrice.toFixed(2)}`;

            priceContainer.appendChild(
                normalPrice
            );
        }
        card.appendChild(
            priceContainer
        );

        // ON SALE Tag
        if (
            game.salePrice <
            game.normalPrice
        ) {
            const saleTag =
                document.createElement("span");

            saleTag.classList.add(
                "sale-tag"
            );

            saleTag.textContent =
                "ON SALE";

            card.appendChild(
                saleTag
            );

            // Calculate discount
            const discountPercentage =
                calculateDiscountPercentage(game);

            const discount =
                document.createElement("p");

            discount.classList.add(
                "discount"
            );

            discount.textContent =
                `${discountPercentage}% OFF`;

            card.appendChild(
                discount
            );
        }


        // Add card to page
        gameListElement.appendChild(
            card
        );

    });
}

// Search
searchInput.addEventListener(
    "input",
    function () {
        highlightedGameId = null;
        displayGames();
    }
);

// On sale Checkbox
saleOnlyCheckbox.addEventListener(
    "change",
    function () {
        highlightedGameId = null;
        displayGames();
    }
);

// find cheapest action
cheapestButton.addEventListener(
    "click",
    function () {
        const visibleGames =
            getVisibleGames();

        const cheapestGame =
            findCheapestGame(
                visibleGames
            );

        if (cheapestGame === null) {

            summaryElement.textContent =
                "No games available.";

            return;
        }

        highlightedGameId =
            cheapestGame.id;

        displayGames();

        summaryElement.textContent =
            `${cheapestGame.title} is the cheapest game at $${cheapestGame.salePrice.toFixed(2)}.`;
    }
);

// Reset to default view
resetButton.addEventListener(
    "click",
    function () {
        searchInput.value = "";
        saleOnlyCheckbox.checked = false;
        highlightedGameId = null;
        displayGames();
    }
);

displayGames();