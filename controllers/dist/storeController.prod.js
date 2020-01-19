"use strict";var mongoose=require("mongoose"),multer=require("multer"),jimp=require("jimp"),uuid=require("uuid"),Store=mongoose.model("Store"),multerOptions={storage:multer.memoryStorage(),fileFilter:function(e,r,t){r.mimetype.startsWith("image/")?t(null,!0):t({message:"That file type isn't allowed!"},!1)}};exports.upload=multer(multerOptions).single("photo"),exports.resize=function(r,e,t){var n,a;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:if(r.file){e.next=3;break}return t(),e.abrupt("return");case 3:return n=r.file.mimetype.split("/")[1],r.body.photo="".concat(uuid.v4(),".").concat(n),e.next=7,regeneratorRuntime.awrap(jimp.read(r.file.buffer));case 7:return a=e.sent,e.next=10,regeneratorRuntime.awrap(a.resize(800,jimp.AUTO));case 10:return e.next=12,regeneratorRuntime.awrap(a.write("./public/uploads/".concat(r.body.photo)));case 12:t();case 13:case"end":return e.stop()}})},exports.homePage=function(e,r){r.render("index")},exports.addStore=function(e,r){r.render("editStore",{title:"Add Store"})},exports.createStore=function(r,t){var n;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(new Store(r.body).save());case 2:n=e.sent,r.flash("success","Successfully created ".concat(n.name,". \n    Care to leave a review?")),t.redirect("/store/".concat(n.slug));case 5:case"end":return e.stop()}})},exports.getStores=function(e,r){var t;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Store.find());case 2:t=e.sent,r.render("stores",{title:"Stores",stores:t});case 4:case"end":return e.stop()}})},exports.getStoreBySlug=function(r,t,n){var a;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Store.findOne({slug:r.params.slug}));case 2:if(a=e.sent){e.next=5;break}return e.abrupt("return",n());case 5:return e.abrupt("return",t.render("store",{title:a.name,store:a}));case 6:case"end":return e.stop()}})},exports.editStore=function(r,t){var n;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Store.findOne({_id:r.params.id}));case 2:n=e.sent,t.render("editStore",{title:"Edit ".concat(n.name),store:n});case 4:case"end":return e.stop()}})},exports.updateStore=function(r,t){var n;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return r.body.location.type="Point",e.next=3,regeneratorRuntime.awrap(Store.findOneAndUpdate({_id:r.params.id},r.body,{new:!0,runValidators:!0}).exec());case 3:n=e.sent,r.flash("success","\n    Successfully updated <strong>".concat(n.name,'</strong>. \n    <a href="/store/').concat(n.slug,'">View Store →</a>\n  ')),t.redirect("/stores/".concat(n.id,"/edit"));case 6:case"end":return e.stop()}})};