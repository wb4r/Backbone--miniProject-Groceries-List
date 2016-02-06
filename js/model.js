// ---- APP ----
// -------------
var App = {
  init: function() {
    this.Items = new ItemsCollection(items_json);
    this.View = new ItemView({ collection: this.Items })
  }
}

// ---- MODEL ----
// ---------------
var ItemModel = Backbone.Model.extend({
  idAttribute: "id",
  initialize: function() {
    this.collection.incrementID();
    this.set("id", this.collection.last_id)
  }
})

// ---- VIEW ----
// --------------
var ItemView = Backbone.View.extend({
  tagName: "tbody",
  el: $("tbody").get(0),
  template: Handlebars.compile($("#items").html()),
  events: {
    // "click #alldelete": "deleteAll",
    "click .btn": "removeItem"
  },
  removeItem: function(e) {
    e.preventDefault();
    var id = +$(e.target).attr("data-id");
    var itemToRemove = _(this.collection.models).findWhere({id: id});
    this.collection.remove(itemToRemove)
  },
  deleteAll: function(e) {
    // e.preventDefault();
    this.collection.reset();
  },
  render: function() {
    this.$el.html(this.template({
      items: this.collection.models
    }))
  },
  initialize: function() {
    this.$el = $("tbody");
    this.render();
    this.listenTo(this.collection, "remove reset render", this.render);
  }
})

// ---- COLLECTION ----
// --------------------
var ItemsCollection = Backbone.Collection.extend({
  last_id: 0,
  model: ItemModel,
  incrementID: function() {
    return ++this.last_id;
  },
  sortBy: function(prop) {
    this.models = _(this.models).sortBy(function(m) {
      return m.attributes[prop];
    });
    App.View.render();
  },
  sortByName: function() {
    this.sortBy("name");
  }
})

// Register Partial
Handlebars.registerPartial("item", $("#item").html())


// CREATE - ADD ONE
$("form").on("submit", function(e) {
  e.preventDefault();
  App.Items.add({
    name: $("input[name=name]").val(),
    quantity: $("input[name=quantity]").val()
  });

  App.View.render();
  emptyBoxes();
})

// DELETE ALL
$("#alldelete").on("click", function(e) {
  e.preventDefault();
  App.View.deleteAll();
})

// SORTBY
$("th").on("click", function(e) {
  var prop = $(this).attr("data-prop");
  App.Items.sortBy(prop)
})

function emptyBoxes() {
  $("input[name=name]").val("");
  $("input[name=quantity]").val("");
}

// Init App
App.init();
