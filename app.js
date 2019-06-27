
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
        }
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
        expensesContainer: '.expenses__list'
    }

    return {
      getInput: function () {
          return {
            type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
          };
      },
      addListItem: function (obj, type) {

        var html, newHtml, element;

        //Create HTML string with placeholder text
        if(type === 'inc') {
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        //Replace the placeholder text with data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        //Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


          
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
    //4. Calculate the budget
    //5. Display the budgte on UI
   
    
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
    }


    var ctrlAddItem = function () {
        var input, newItem;

        //Get the field input data
        input = UICtrlr.getInput();

        
        // Add the item to budget controller 
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        UICtrlr.addListItem(newItem, input.type);


    }
    
    
    return {
        init: function() {
            setupEventListeners();
        }  
    };
})(budgetController, UIController);

appController.init();
