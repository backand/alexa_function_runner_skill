
// Alexa SDK for alexa skills
var Alexa = require('alexa-sdk');

// HTTP COMMS
var request = require('request');
const backand = require('@backand/nodejs-sdk');
backand.init({
     appName: 'APP_NAME',
     anonymousToken: 'ANONYMOUS_TOKEN'
});;

var handlers = {
  'ListFunctions': function (event) {
    var context = this;
    backand.invoke({
        method: 'GET',
        url: '1/action/config',
        params: {}
      }).then(function(data){
        console.log('SUCCESS');
        console.log(data.data.data);
        fn_count = data.data.data.length;
        fn_data = data.data.data;
        var function_descriptors = [];
        for(var i = 0; i < fn_count; i++) {
          function_descriptors.push("Function "+(i+1) + ", " + fn_data[i].name + ". ");
        }
        console.log(fn_count + " is the number of functions");
        context.emit(':tell',function_descriptors.join('\n'));
      })
      .catch(function(error){
          console.log('FAIL');
          console.log(response.body);
          //this.emit(':tell', 'There was an error.' + response.body);
          context.emit(':tell','There was an error afoot.')
      });
  },
  'RunFunction': function (event) {
      var context = this;
      var number = context.event.request.intent.slots.number.value;
      backand.invoke({
          method: 'GET',
          url: '1/action/config',
          params: {}
      }).then(function(data){
        fn_data = data.data.data;
        var function_id = number-1; // one-based instead of zero based
        var functionName = fn_data[function_id].name;
        backand.fn.get(functionName, {}).then(function(response){
          // Assuming output is in variable "message"
          context.emit(':tell',response.data.message);
        });
      })
      .catch(function(error){
          context.emit(':tell','There was an error afoot.')
      });
  },
  'Unhandled': function () {
    console.log('FAIL from UNHANDLED');
    this.emit(':tell', 'There was an error. in unhandled');
  }
};

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context, callback);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
