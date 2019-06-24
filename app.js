
//Model
var budgetController = (function(){

    //Some code
    return {

    };
})();

//View
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }


    //Some code
    return {
      getInput: function () {
          return {
            type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
          };
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
        var input = UICtrlr.getInput();
    }
    
    
    return {
        init: function() {
            setupEventListeners();
        }  
    };
})(budgetController, UIController);

appController.init();
