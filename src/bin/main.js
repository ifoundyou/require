require.config({
  shim:{
  	'zepto':{
  		exports:'$'
  	},
  	'backbone':{
  		deps:['underscore','zepto']
  	}
  },
  baseUrl:'../require/src',
  paths:{
  	'underscore':'vendor/underscore',
  	'zepto':'vendor/zepto',
  	'backbone':'vendor/backbone',
  	'app':'lib/app',
  	'hammer':'vendor/hammer',
  	'sss':'lib/sss',
    'lib':'lib/lib.min',
    '99':'lib/99'
  }
});

require(['app'],function(App){ 
  var app=new App;
  app.init({
    container:'rotary',
    mid      :'pages',
    page     :'page',
    wrap     :document.body,
    pages    :[
                {
                  'url':'src/media/0.jpg',
                  'className':'slide1'
                },
                {
                  'url':'src/media/1.jpg',
                  'className':'slide2'
                },
                {
                  'url':'src/media/2.jpg',
                  'className':'slide3'
                },
                {
                  'url':'src/media/3.jpg',
                  'className':'slide4'
                },
                {
                  'url':'src/media/4.jpg',
                  'className':'slide5'
                },
                {
                  'url':'src/media/5.jpg',
                  'className':'slide6'
                }
              ]
  });
});