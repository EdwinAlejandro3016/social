const express = require('express');

// initializations
const config = require('./server/config');
const app = config(express());
require('dotenv').config();
require('./database');

app.listen(app.get('port'),()=>{
    console.log('server on PORT:',app.get('port'))
}) 