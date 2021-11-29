const path = require('path');
const exhbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const errorHandler = require('errorhandler');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

module.exports = app =>{
    //settings
    app.set('port',process.env.PORT || 3000);
    app.set('views',path.join(__dirname,'../views'));
    app.engine('.hbs',exhbs.engine({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        extname: '.hbs',
        layoutsDir: path.join(app.get('views'),'layouts'),
        partialsDir: path.join(app.get('views'),'partials'),
        defaultLayout: 'main',
        helpers: require('./helpers')
    }));
    app.set('view engine','.hbs');

    //middlewares
    app.use(morgan('dev'));
    app.use(multer({
        dest: path.join(__dirname,'../public/upload/temp')
    }).single('image'));
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());

    //routes
    app.use('/',require('../routes/index'));

    //static files
    app.use('/public',express.static(path.join(__dirname,'../public')));

    //errorhandlers
    // if('development' === app.get('env')){
    //     app.use(errorHandler);
    // }
    return app;
}