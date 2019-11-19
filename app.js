//BUDGET CONTROLLER
var budgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	var calculateTotal = function(type) {
		var sum = 0;

		data.allItems[type].forEach(function(item) {
			sum += item.value;
		});

		data.totals[type] = sum;
	};

	return {
		addItem: function(type, des, value) {
			var newItem, ID;
			ID = 0;

			//Create new Id
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			//Create new item based on 'inc' and 'exp' type
			if (type === "exp") {
				newItem = new Expense(ID, des, value);
			} else if (type === "inc") {
				newItem = new Income(ID, des, value);
			}

			//Push into data structure
			data.allItems[type].push(newItem);

			//Return new element
			return newItem;
		},

		deleteItem: function(type, id) {
			data.allItems[type] = data.allItems[type].filter(function(current) {
				if (current.id !== id) {
					return current;
				}
			});
		},

		calculateBudget: function() {
			//Calculate total income and expenses
			calculateTotal("inc");
			calculateTotal("exp");
			//Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			//Calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		calculatePercentages: function() {
			data.allItems.exp.forEach(function(curr) {
				curr.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPercentages = data.allItems.exp.map(function(item) {
				return item.getPercentage();
			});
			return allPercentages;
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function() {
			// console.log(data);
		}
	};
})();

//UI CONTROLLER
var UIController = (function() {
	var DOMstrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputValue: ".add__value",
		inputBtn: ".add__btn",
		incomeContainer: ".income__list",
		expensesContainer: ".expenses__list",
		budgetValue: ".budget__value",
		budgetIncValue: ".budget__income--value",
		budgetExpValue: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage",
		container: ".container",
		expensesPercLabel: ".item__percentage",
		dateLabel: ".budget__title--month"
	};

	var formatNumber = function(num, type) {
		var numSplit, int, dec;
		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split(".", num);
		int = numSplit[0];
		dec = numSplit[1];

		if (int.length > 3) {
			int =
				int.substr(0, int.length - 3) +
				"," +
				int.substr(int.length - 3, int.length);
		}

		type === "exp" ? (sign = "-") : (sign = "+");

		return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
	};

	var nodeListForEach = function(list, callback) {
		for (var index = 0; index < list.length; index++) {
			callback(list[index], index);
		}
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			var html, incomeList, expensesList, element;
			if (type === "inc") {
				//Create HTML string
				html = `<div class="item clearfix" id="inc-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">${formatNumber(
															obj.value,
															type
														)}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;
				element = document.querySelector(DOMstrings.incomeContainer);
			} else if (type === "exp") {
				html = `<div class="item clearfix" id="exp-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumber(
													obj.value,
													type
												)}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
				element = document.querySelector(DOMstrings.expensesContainer);
			}

			//Insert into DOM
			element.insertAdjacentHTML("beforeend", html);
		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(
				`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`
			);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current) {
				current.value = "";
			});

			fieldsArr[0].focus();
		},

		deleteListItem: function(selectorId) {
			var el = document.getElementById(selectorId);
			el.parentNode.removeChild(el);
		},

		displayBudget: function(obj) {
			var type;
			var { budget, totalInc, totalExp, percentage } = obj;

			budget > 0 ? (type = "inc") : (type = "exp");

			if (budget > 0) {
				budget = formatNumber(budget, type);
			}

			if (totalInc > 0) {
				totalInc = formatNumber(totalInc, "inc");
			}

			if (totalExp > 0) {
				totalExp = formatNumber(totalExp, "exp");
			}

			document.querySelector(DOMstrings.budgetValue).textContent = budget;
			document.querySelector(DOMstrings.budgetIncValue).textContent = totalInc;
			document.querySelector(DOMstrings.budgetExpValue).textContent = totalExp;
			document.querySelector(DOMstrings.percentageLabel).textContent =
				percentage === -1 ? "---" : `${percentage}%`;
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			nodeListForEach(fields, function(current, index) {
				current.textContent =
					percentages[index] > 0 ? `${percentages[index]}%` : `---`;
			});
		},

		displayDate: function() {
			var now, month, year, monthNames;
			monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			];

			now = new Date();
			month = now.getMonth();
			year = now.getFullYear();

			document.querySelector(
				DOMstrings.dateLabel
			).textContent = `${monthNames[month]}, ${year}`;
		},

		changeType: function() {
			var fields = document.querySelectorAll(
				`${DOMstrings.inputType},
				${DOMstrings.inputDescription},
				${DOMstrings.inputValue}`
			);

			nodeListForEach(fields, function(current) {
				current.classList.toggle("red-focus");
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
		},

		getDOMStrings: function() {
			return DOMstrings;
		}
	};
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtr, UICtr) {
	//Setup Event Listenets
	var setupEventListeners = function() {
		//Get the name of the UI elements
		var DOM = UICtr.getDOMStrings();
		//Get values from input fields when the user hit return key ot click on the "Add" button
		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
		document.addEventListener("keypress", function(e) {
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});

		//Event delegation to delete button for each new item
		document
			.querySelector(DOM.container)
			.addEventListener("click", ctrlDeleteItem);

		document
			.querySelector(DOM.inputType)
			.addEventListener("change", UICtr.changeType);
	};

	var updateBudget = function() {
		//1. Calculate the budget
		budgetCtr.calculateBudget();
		//2. Return textEmphasisColor:  budget
		var budget = budgetCtr.getBudget();
		//3. Add the budget to UIController
		UICtr.displayBudget(budget);
	};

	var updatePercentages = function() {
		//1. Calculate the percentages
		budgetCtr.calculatePercentages();
		//2. Read percentages from budget controller
		var percentages = budgetCtr.getPercentages();
		//3. Update the UI with the new percentages
		UICtr.displayPercentages(percentages);
	};

	var ctrlAddItem = function() {
		var input, newItem;

		//1. Get the fields input data
		input = UICtr.getInput();

		if (input.description === "" || isNaN(input.value) || input.value <= 0) {
			return false;
		}

		//2. Add the item to the budgetController
		newItem = budgetCtr.addItem(input.type, input.description, input.value);
		budgetCtr.testing();

		//3. Add the item to UIController
		UICtr.addListItem(newItem, input.type);

		//4.Clear the fields
		UICtr.clearFields();

		//5. Calculate and update the budget
		updateBudget();

		//6. Calculate and update the percentages
		updatePercentages();
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split("-");
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//1. Delete the item from data structure
			budgetCtr.deleteItem(type, ID);

			//2. Delete the item from the UI
			UICtr.deleteListItem(itemID);

			//3. Update and show the new budget
			updateBudget();

			//4. Calculate and update the percentages
			updatePercentages();
		}
	};

	return {
		init: function() {
			UICtr.displayDate();
			UICtr.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();
