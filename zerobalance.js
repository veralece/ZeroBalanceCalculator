$(function () {
    let state = {
        incomeTotal: 0,
        expenseTotal: 0,
        fundTotal: 0,
        savingTotal: 0,
        finalBalance: 0,
    }

    //function that generates a unique ID, this is not my code
    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }

    //Dry func that handles submit for the forms
    function handleSubmit(e) {
        e.preventDefault();
        financeCategory = $(this).attr('id');
        newFinanceItem(financeCategory);
    }

    //function that takes form's info, validates it, then calls functions to display input and update totals, then finally resets the form
    function newFinanceItem(financeCategory) {
        let name = $(`#${financeCategory}Name`);
        let amount = $(`#${financeCategory}Amount`);
        let currentAmount = Number(amount.val());

        if (!/\w+/.test(name.val())) {
            alert("You must enter a valid name! (Letters & Numbers)");
            return;
        }

        if (!(currentAmount === 0) && !currentAmount) {
            alert("You must enter a numerical value.");
            return;
        }

        if (currentAmount < 1) {
            alert(`Your ${financeCategory} amount cannot be less than 1!`);
            return;
        }

        createFinanceElement(name.val(), currentAmount, financeCategory);
        updateTotal(currentAmount, financeCategory, "add");

        name.val("");
        amount.val("");
    }

    //function to handle the deletion of the HTML element, as well as update the total afterwards
    function deleteFinanceItem(id, amount, financeCategory) {
        updateTotal(amount, financeCategory, "subtract");
        $(`#${id}`).remove();
    }

    //function that creates an HTML element based on form input and displays it back to user
    function createFinanceElement(name, amount, financeCategory) {
        let financeElement = document.createElement("section");
        let deleteButton = document.createElement("button");
        let descriptionElement = document.createElement("p");
        let display = $(`#${financeCategory}Display`);

        financeElement.id = uuidv4();
        descriptionElement.innerText = `${name}: $${amount}`;
        deleteButton.innerText = "Delete";

        let handleDeleteClick = (e) => {
            e.preventDefault();
            deleteFinanceItem(financeElement.id, amount, financeCategory);
        };


        financeElement.appendChild(descriptionElement);
        financeElement.appendChild(deleteButton);
        display.append(financeElement);
        $(`#${financeElement.id}`).addClass("shadow-item container-bordered financial-item");
        $(`#${financeElement.id} button`).click(handleDeleteClick);
    }

    //updates the total when a form is submitted or when a financial item is deleted.
    function updateTotal(amount, financeCategory, operation) {
        let total = $(`#${financeCategory}Total`);
        let finalBalance = $("#finalBalance");

        switch (operation) {
            case "add":
                state[`${financeCategory}Total`] += amount;
                break;
            case "subtract":
                state[`${financeCategory}Total`] -= amount;
                break;
            default:
                break;
        }

        let { incomeTotal, expenseTotal, fundTotal, savingTotal } = state;
        state.finalBalance = incomeTotal - expenseTotal - fundTotal - savingTotal;
        total.text(state[`${financeCategory}Total`]);
        finalBalance.text(state.finalBalance > -1 ? `$${state.finalBalance}` : `-$${Math.abs(state.finalBalance)}`);
    }
    $('.finance-form').submit(handleSubmit);
});