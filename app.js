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
    expensePercentageLabel: ".expense__list .item__percentage",
  };
  var nodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatMoney = function (amount, type) {
    amount = "" + amount;
    var x = amount.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (let i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 == 0) y += ",";
      count++;
    }
    var z = y.split("").reverse().join("");
    if (z[0] == ",") z = z.substring(1, z.length - 1);
    if (type == "add") z = "+ " + z;
    else z = "-  " + z;
    return z;
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

    displayPercentages: function (allPercentages) {
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      nodeListForeach(elements, function (el, index) {
        el.textContent = allPercentages[index] + "%";
      });
    },
    addItemList: function (item, type) {
      // 1. prepare
      var html =
        "<div id='" +
        type +
        "-##id##' class='item flex gap-2 border-b border-gray-300'><div class='item__description w-[200px]'>##desc##</div><div class='item__percentage text-xs border text-gray-200 rounded-md'></div><div class='item__amount w-[60px] text-right'>##amount##</div><a class='item__delete cursor-pointer'> <svg id='Icons' class='w-5 h-5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><defs><style>.cls-1{fill:#232323;}</style></defs><path class='cls-1' d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm4.707,14.293a1,1,0,1,1-1.414,1.414L12,13.414,8.707,16.707a1,1,0,1,1-1.414-1.414L10.586,12,7.293,8.707A1,1,0,1,1,8.707,7.293L12,10.586l3.293-3.293a1,1,0,1,1,1.414,1.414L13.414,12Z'/></svg> </a> </div>";
      var selector = DOMstrings.incomeList;
      if (type === "sub") selector = DOMstrings.expenseList;
      // 2. HTML
      html = html.replace("##id##", item.id);
      html = html.replace("##desc##", item.desc);
      html = html.replace("##amount##", formatMoney(item.amount, type));
      // 3. Insert into dom
      document.querySelector(selector).insertAdjacentHTML("beforeend", html);
    },
    deleteItemList: function (id) {
      var item = document.getElementById(id);
      item.parentNode.removeChild(item);
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
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    this.percentage = Math.round((this.amount / totalIncome) * 100);
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
        return element.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        //data.items[type] =
        data.items[type].slice(index, 1);
      }
      // console.log(data.items[type]);
    },
    calculate: function () {
      calculateTotal("add");
      calculateTotal("sub");
      data.balance = data.totals.add - data.totals.sub;
      if (data.totals.add > 0)
        data.percent = Math.round((data.totals.sub / data.totals.add) * 100);
      else data.percent = 0;
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
    calculatePercentages: function () {
      data.items.sub.forEach(function (el) {
        el.calcPercentage(data.totals.add);
      });
    },
    getPercentages: function () {
      var percentages = data.items.sub.map(function (el) {
        return el.getPercentage();
      });
      return percentages;
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

      // 6. Print result
      updateTusuv();
    }
  };

  var updateTusuv = function () {
    var summary = finance.getSummary();
    ui.showSummary(summary);
    financialController.calculate();
    var tusuv = financialController.getSummary();
    uiController.showSummary(summary);
    // 7. Calculate percentages
    financialController.calculatePercentages();
    // 8. Calculate percentages
    var allPercentages = financialController.getPercentages();
    // 9. Calculate percentages
    uiController.displayPercentages(allPercentages);
    console.log(allPercentages);
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
          finance.deleteItem(type, parseInt(itemId));
          ui.deleteItemList(id);
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
