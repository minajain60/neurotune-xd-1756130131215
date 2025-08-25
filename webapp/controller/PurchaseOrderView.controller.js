sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/MessagePopover",
  "sap/m/MessageItem",
  "sap/ui/core/library",
  "sap/ui/core/UIComponent",
  "sap/ui/core/util/Export",
  "sap/ui/core/util/ExportTypeCSV",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter"
], function (Controller, JSONModel, MessageToast, MessageBox, MessagePopover, MessageItem, coreLibrary, UIComponent, Export, ExportTypeCSV, Filter, FilterOperator, Sorter) {
  "use strict";

  // Shortcut for sap.ui.core.MessageType
  var MessageType = coreLibrary.MessageType;

  /**
   * @class converted.purchaseorderview.controller.PurchaseOrderView
   * Controller for the Purchase Order View.
   */
  return Controller.extend("converted.purchaseorderview.controller.PurchaseOrderView", {
    /**
     * Called when the view is initialized.
     */
    onInit: function () {
      // Load mock data for Purchase Order Header
      var oPurchaseOrderModel = new JSONModel();
      oPurchaseOrderModel.loadData("model/mockData/PurchaseOrderData.json");
      this.getView().setModel(oPurchaseOrderModel, "PurchaseOrderData");

      // Load mock data for Delivery Invoice
      var oDeliveryInvoiceModel = new JSONModel();
      oDeliveryInvoiceModel.loadData("model/mockData/DeliveryInvoiceData.json");
      this.getView().setModel(oDeliveryInvoiceModel, "DeliveryInvoiceData");

      // Load mock data for Purchase Order Items
      var oPurchaseOrderItemsModel = new JSONModel();
      oPurchaseOrderItemsModel.loadData("model/mockData/PurchaseOrderItems.json");
      this.getView().setModel(oPurchaseOrderItemsModel, "PurchaseOrderItems");

      // Load mock data for Selected Item Details
      var oSelectedItemDetailsModel = new JSONModel();
      oSelectedItemDetailsModel.loadData("model/mockData/SelectedItemDetails.json");
      this.getView().setModel(oSelectedItemDetailsModel, "SelectedItemDetails");

      // Initialize message model for MessageArea/MessagePopover
      var oMessageModel = new JSONModel({
        messages: [{
          type: MessageType.Success,
          title: "System Information",
          description: "Application converted successfully, Use AI optimize for better result",
          subtitle: "Conversion complete",
          counter: 1
        }]
      });
      this.getView().setModel(oMessageModel, "messages");
    },

    /**
     * Event handler for saving the document.
     */
    onActionSave: function () {
      MessageToast.show("Save action triggered");
    },

    /**
     * Event handler for print preview.
     */
    onActionPrintPreview: function () {
      MessageToast.show("Print Preview action triggered");
    },

    /**
     * Event handler for displaying messages.
     */
    onActionMessages: function () {
      this.handleMessagePopoverPress(); // Use the existing message popover
    },

    /**
     * Event handler for personal settings.
     */
    onActionPersonalSetting: function () {
      MessageToast.show("Personal Setting action triggered");
    },

    /**
     * Event handler for saving as template.
     */
    onActionSaveAsTemplate: function () {
      MessageToast.show("Save As Template action triggered");
    },

    /**
     * Event handler for loading from template.
     */
    onActionLoadFromTemplate: function () {
      MessageToast.show("Load From Template action triggered");
    },

    /**
     * Event handler for selecting a tab in the main tab strip.
     * @param {sap.ui.base.Event} oEvent The selection event.
     */
    onSelectMainTab: function (oEvent) {
      var sTabKey = oEvent.getParameter("key");
      MessageToast.show("Selected tab: " + sTabKey);
    },

    /**
     * Event handler for default values button.
     */
    onActionDefaultValues: function () {
      MessageToast.show("Default Values action triggered");
    },

    /**
     * Event handler for additional planning button.
     */
    onActionAddlPlanning: function () {
      MessageToast.show("Additional Planning action triggered");
    },

    /**
     * Event handler for selecting an item in the order item dropdown.
     * @param {sap.ui.base.Event} oEvent The selection event.
     */
    onActionSelectOrderItem: function (oEvent) {
      var sKey = oEvent.getParameter("selectedKey");
      MessageToast.show("Selected order item: " + sKey);
    },

    /**
     * Event handler for selecting the previous item.
     */
    onActionSelectPrevItem: function () {
      MessageToast.show("Select Previous Item action triggered");
    },

    /**
     * Event handler for selecting the next item.
     */
    onActionSelectNextItem: function () {
      MessageToast.show("Select Next Item action triggered");
    },

    /**
     * Event handler for selecting a tab in the item detail tab strip.
     * @param {sap.ui.base.Event} oEvent The selection event.
     */
    onSelectSubTab: function (oEvent) {
      var sTabKey = oEvent.getParameter("key");
      MessageToast.show("Selected sub tab: " + sTabKey);
    },

    /**
     * Event handler for searching control code.
     */
    onActionSearchControlCode: function () {
      MessageToast.show("Search Control Code action triggered");
    },

    /**
     * Opens a confirmation dialog.
     */
    openConfirmDialog: function () {
      MessageBox.confirm("Are you sure?", {
        title: "Confirmation",
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.OK) {
            MessageToast.show("Confirmed!");
          } else {
            MessageToast.show("Cancelled!");
          }
        }
      });
    },

    /**
     * Event handler for exporting the table data to CSV.
     */
    onExportToCSV: function () {
      var oTable = this.byId("itemDetailsTable");
      var oBinding = oTable.getBinding("items");
      var aData = oBinding.getModel().getProperty(oBinding.getPath());

      if (!aData || aData.length === 0) {
        MessageToast.show("No data to export.");
        return;
      }

      var aHeaders = Object.keys(aData[0]);
      var sCsvContent = aHeaders.join(",") + "\n";

      aData.forEach(function (row) {
        var aValues = aHeaders.map(function (header) {
          return "\"" + (row[header] || "").toString().replace(/"/g, "\"\"") + "\"";
        });
        sCsvContent += aValues.join(",") + "\n";
      });

      var oBlob = new Blob([sCsvContent], {
        type: "text/csv"
      });
      var sUrl = URL.createObjectURL(oBlob);
      var oLink = document.createElement("a");
      oLink.href = sUrl;
      oLink.download = "purchase_order_items.csv";
      document.body.appendChild(oLink); // Required for Firefox
      oLink.click();
      document.body.removeChild(oLink);
      URL.revokeObjectURL(sUrl);
    },

    /**
     * Event handler for live search in the item details table.
     * @param {sap.ui.base.Event} oEvent The search event.
     */
    onSearch: function (oEvent) {
      var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query");
      var oTable = this.byId("itemDetailsTable");
      var oBinding = oTable.getBinding("items");
      var aFilters = [];

      if (sQuery && sQuery.length > 0) {
        var aSearchFilters = [];
        aSearchFilters.push(new Filter("MaterialNumber", FilterOperator.Contains, sQuery));
        aSearchFilters.push(new Filter("ShortText", FilterOperator.Contains, sQuery));
        aFilters.push(new Filter({
          filters: aSearchFilters,
          and: false
        }));
      }
      oBinding.filter(aFilters);
    },

    /**
     * Event handler for filtering the item details table.
     */
    onFilterPress: function () {
      MessageBox.information("Filter functionality not yet implemented.");
    },

    /**
     * Event handler for sorting the item details table.
     */
    onSortPress: function () {
      MessageBox.information("Sort functionality not yet implemented.");
    },

    /**
     * Handles the press event of the message popover button.
     * @param {sap.ui.base.Event} oEvent The button press event.
     */
    handleMessagePopoverPress: function (oEvent) {
      if (!this._oMessagePopover) {
        this._oMessagePopover = new MessagePopover({
          items: {
            path: 'messages>/messages',
            template: new MessageItem({
              type: '{messages>type}',
              title: '{messages>title}',
              description: '{messages>description}',
              subtitle: '{messages>subtitle}',
              counter: '{messages>counter}'
            })
          }
        });
        this.getView().byId("messagePopoverBtn").addDependent(this._oMessagePopover);
      }
      this._oMessagePopover.toggle(oEvent.getSource());
    },

    /**
     * Called when the Add button in the table toolbar is pressed.
     */
    onTableBtnAdd: function () {
      MessageToast.show("Add Item button pressed.");
    },

    /**
     * Called when the Delete button in the table toolbar is pressed.
     */
    onTableBtnDelete: function () {
      MessageToast.show("Delete Item button pressed.");
    },

    /**
     * Called when the Copy button in the table toolbar is pressed.
     */
    onTableBtnCopy: function () {
      MessageToast.show("Copy Item button pressed.");
    },

    /**
     * Called when the Lock button in the table toolbar is pressed.
     */
    onTableBtnLock: function () {
      MessageToast.show("Lock Item button pressed.");
    },

    /**
     * Called when the Unlock button in the table toolbar is pressed.
     */
    onTableBtnUnlock: function () {
      MessageToast.show("Unlock Item button pressed.");
    },

    /**
     * Called when the Settings button in the table toolbar is pressed.
     */
    onTableBtnSettings: function () {
      MessageToast.show("Table Settings button pressed.");
    },

    /**
     * Called when the Filter button in the table toolbar is pressed.
     */
    onTableBtnFilter: function () {
      MessageToast.show("Filter Table button pressed.");
    },

    /**
     * Called when the Export button in the table toolbar is pressed.
     */
    onTableBtnExport: function () {
      this.onExportToCSV();
    }

  });
});
