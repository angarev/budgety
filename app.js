
//Model
var budgetController = (function(){

    //Some code
    return {

    }
})();

//View
var UIController = (function(){

    //Some code
    return {
        
    }
})();


//Controller
var appController = (function(budgetCtrl, UICtrlr){

    //1. Get the field input data
    //2. Add the item to budget controller
    //3. Add the new item to UI
    //4. Calculate the budget
    //5. Display the budgte on UI

    var ctrlAddItem = function () {
        
    }
    

    // Add EventListener to add btn when user click with mouse
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    // Add EventListener to add btn when user use return key
    document.addEventListener('keypress', function(event){

        //Use keyCode for new browsers and which for older
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });

    //Some code
    // return {
        
    // }
})(budgetController, UIController);
