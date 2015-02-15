require.config({
  shim:{
  	'zepto':{
  		exports:'$'
  	},
  	'backbone':{
  		deps:['underscore','zepto']
  	}
  },
  baseUrl:'../require/static',
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
                  'url':'static/media/0.jpg',
                  'className':'slide1'
                },
                {
                  'url':'static/media/1.jpg',
                  'className':'slide2'
                },
                {
                  'url':'static/media/2.jpg',
                  'className':'slide3'
                },
                {
                  'url':'static/media/3.jpg',
                  'className':'slide4'
                },
                {
                  'url':'static/media/4.jpg',
                  'className':'slide5'
                },
                {
                  'url':'static/media/5.jpg',
                  'className':'slide6'
                }
              ]
  });
});