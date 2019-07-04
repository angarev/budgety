
//Model
var budgetController = (function(){

    //Create function constuctor
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function (id, description, value) {
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
    }

    var calculateTotal= function (type) {

        var sum = 0;

        data.allItems[type].map(function (element) {
            return sum += element.value
        })

        data.totals[type] = sum;

    }

    return {
        addItem: function (type, des, val ) {
            var newItem;
                    
            //Create a new ID
            if (data.allItems[type].length > 0) {    
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create a new item based on inc or exp type 
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //Pushed on data stracture
            data.allItems[type].push(newItem);

            //Return a new element
            return newItem;
        },
        deleteItem: function(type, id) {
            data.allItems[type] = data.allItems[type].filter(function(item){
                return item.id !== id;
            })
        },
        calculateBudget: function () {

            //Calculate total incomes and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            //Calculate the budget: incomes - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentages of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);                
            } else {
                data.percentage = -1;
            }

        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }

        },
        testing: function() {
            console.log(data);
        }
    };
})();

//View
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
      getInput: function () {
          return {
            type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
      },
      addListItem: function (obj, type) {

        var html, newHtml, element;

        //Create HTML string with placeholder text
        if(type === 'inc') {
            element = DOMstrings.incomeContainer;
            html = '<div id="income-%id%" class="item clearfix"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button id="inc-%ID%" class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;
            html = '<div id="expenses-%id%" class="item clearfix"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button id="exp-%ID%" class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        //Replace the placeholder text with data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%ID%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        //Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);          
      },
      clearFields: function () {
          var fields, fieldsArr;

          //Get NodeList with element 
          fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
          //Convert NodeList to array           
          fieldsArr = Array.prototype.slice.call(fields);
          //Remove all values from fields
          fieldsArr.forEach(function(current) {
              current.value = "";
          });
          //Add focus to the first clear field
          fieldsArr[0].focus();

      },
      
      deleteListItem: function (type, id) {
        if(type === 'inc') {
            element = DOMstrings.incomeContainer;
            document.querySelector(element).removeChild(
                document.getElementById('income-' + id)
                );
            
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;
            document.querySelector(element).removeChild(
                document.getElementById('expenses-' + id)
                );
        }
      },

      displayBudget: function(obj) {
          document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
          document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
          document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
          
          if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';    
          } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
          }
      },
      getDOMstrings: function () {
          return DOMstrings;
      }
    };
})();


//Controller
var appController = (function(budgetCtrl, UICtrlr){

    //1. Get the field input data
    //2. Add the item to budget controller
    //3. Add the new item to UI
    //4. Clear the fields
    //5. Calculate the budget
    //6. Display the budgte on UI
   
    
    //Create function for event listeners if we need to add more
    var setupEventListeners = function() {
        
        //Get dom strings from UI controller
        var DOM = UICtrlr.getDOMstrings();
    
        // Add EventListener to add btn when user click with mouse
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Add EventListener to add btn when user use return key
        document.addEventListener('keypress', function(event){

            //Use keyCode for new browsers and which for older
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

        // Add EventListener to delete btn
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {
        //Calculate the budget
        budgetCtrl.calculateBudget();

        //Return the budget
        var budget = budgetCtrl.getBudget();
        
        //Display the budget to UI
        UICtrlr.displayBudget(budget);
    };


    var ctrlAddItem = function () {
        var input, newItem;

        //Get the field input data
        input = UICtrlr.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // Add the item to budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrlr.addListItem(newItem, input.type);

            //Clear the fields
            UIController.clearFields();

            //Calculate and update the budget
            updateBudget();
            
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemId, splitId, type, ID;
        
        itemId= event.target.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID= parseInt(splitId[1]);
            
            //Delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            //Delete item from UI
            UIController.deleteListItem(type, ID);

            //Update budget
            updateBudget();

        }
       
    };
    
    return {
        init: function() {
            //Display the budget to UI
            UICtrlr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }  
    };
})(budgetController, UIController);

appController.init();
