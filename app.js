var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputAmount: ".add__amount",
    addBtn: ".add__btn",
    itemDelete: ".item__delete",
    incomeList: ".income__list",
    expenseList: ".expense__list",
    labelIncome: ".label__income",
    labelExpense: ".label__expense",
    labelSummary: ".label__summary",
    labelPercent: ".label__badge",
    containerDiv: ".container",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDesc).value,
        amount: parseInt(document.querySelector(DOMstrings.inputAmount).value),
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    addItemList: function (item, type) {
      // 1. prepare
      var html =
        "<div id='" +
        type +
        "-##id##' class='item flex gap-2 border-b border-gray-300' > <div class='item__description w-[200px]'>##desc##</div> <div class='item__amount w-[60px] text-right'>$##amount##</div> <div class='item__delete'> <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-5 h-5' > <path stroke-linecap='round' stroke-linejoin='round' d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' /> </svg> </div> </div>";
      var selector = DOMstrings.incomeList;
      if (type === "sub") selector = DOMstrings.expenseList;
      // 2. HTML
      html = html.replace("##id##", item.id);
      html = html.replace("##desc##", item.desc);
      html = html.replace("##amount##", item.amount);
      // 3. Insert into dom
      document.querySelector(selector).insertAdjacentHTML("beforeend", html);
    },
    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputAmount + "," + DOMstrings.inputDesc
      );

      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((el) => {
        el.value = "";
      });
      fieldsArr[0].focus();
    },
    showSummary: function (data) {
      document.querySelector(DOMstrings.labelIncome).textContent =
        data.totalAdd;
      document.querySelector(DOMstrings.labelExpense).textContent =
        data.totalExp;
      document.querySelector(DOMstrings.labelSummary).textContent = data.total;
      document.querySelector(DOMstrings.labelPercent).textContent =
        data.percent + "%";
    },
  };
})();

var financialController = (function () {
  var Income = function (id, desc, amount) {
    this.id = id;
    this.desc = desc;
    this.amount = amount;
  };

  var Expense = function (id, desc, amount) {
    this.id = id;
    this.desc = desc;
    this.amount = amount;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach((el) => {
      sum = sum + el.amount;
    });
    data.totals[type] = sum;
  };

  var data = {
    items: {
      add: [],
      sub: [],
    },
    totals: {
      add: 0,
      sub: 0,
    },
    balance: 0,
    percent: 0,
  };

  return {
    addItem: function (type, desc, amount) {
      var item;
      if (data.items[type].length === 0) id = 1;
      else id = data.items[type][data.items[type].length - 1].id + 1;

      if (type === "add") {
        item = new Income(id, desc, amount);
      } else {
        item = new Expense(id, desc, amount);
      }
      data.items[type].push(item);
      return item;
    },
    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (element) {
        console.log(element);
        return element.id;
      });
      console.log(data.items);
      console.log(data.items[type]);
      // console.log(ids);
      // var index = ids.indexOf(id);
      // console.log("deleting " + index);
      // if (index !== -1) {
      //   data.items[type].slice(index, 1);
      // }
    },
    calculate: function () {
      calculateTotal("add");
      calculateTotal("sub");

      data.balance = data.totals.add - data.totals.sub;
      data.percent = Math.round((data.totals.sub / data.totals.add) * 100);
    },
    getSummary: function () {
      return {
        total: data.balance,
        percent: data.percent,
        totalAdd: data.totals.add,
        totalExp: data.totals.sub,
      };
    },
    getData: function () {
      console.log(data);
    },
  };
})();

var appController = (function (ui, finance) {
  var ctrlAddItem = function () {
    var input = ui.getInput();
    if (input.description !== "" && input.amount !== "") {
      var item = finance.addItem(input.type, input.description, input.amount);
      ui.addItemList(item, input.type);
      ui.clearFields();

      // 5. Calculate summary
      finance.calculate();
      var summary = finance.getSummary();

      // 6. Print result
      ui.showSummary(summary);
    }
  };
  var setupEventListeners = function () {
    var DOM = ui.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });
    document.addEventListener("keypress", function (event) {
      if (event.key == "Enter") {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (element) {
        var id = element.target.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = arr[1];
          console.log(arr);
          finance.deleteItem(type, itemId);
        }
      });
  };
  return {
    init: function () {
      console.log("Application started ...");
      setupEventListeners();
    },
  };
})(uiController, financialController);

appController.init();
