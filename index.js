const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path  =  require('path');

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser('abcd_my_secret_kye'));
app.use(session({
    secret:'my_session_secret_key',
    resave:false,
    saveUninitialized:true,
}));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req,res,next)=>{
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

app.get('/',(req,res)=>{
    res.cookie('user_cookie','k2',{httpOnly:true});
    res.render('index');
});
app.post('/set-flash',(req,res)=>{
    req.flash('success',' is a flash message!')
    req.flash('user_name',req.body.user_name);
    res.redirect('/display-flash');
});

app.get('/set-flash',(req,res)=>{
    req.flash('success', 'This is a success message!');
    req.flash('error', 'This is an error message!');
    res.redirect('/display-flash');
});

app.get('/display-flash', (req, res) => {
    user_name = req.flash('user_name');
    res.render('display-flash',{user_name});
});

app.post('/set-cookie',(req,res)=>{
    res.cookie('error',' is an cookie data',{httpOnly:true});
    res.cookie('user_cookie',req.body.user_name,{httpOnly:true});
    res.redirect('/display-cookie');
});

app.get('/display-cookie', (req, res) => {
    user_name = req.cookies.user_cookie;
    errorMessage = req.cookies.error;
    res.render('display-cookie',{user_name,errorMessage});
});

app.get('/clear-cookie', (req, res) => {
    res.clearCookie('user_cookie');
    res.clearCookie('error');
    res.send('Cookie cleared');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is runing at http://localhost:${PORT}`);
})