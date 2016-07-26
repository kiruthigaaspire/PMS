var Form = require('form-builder').Form;

// creates my form with some data for the inputs
var myForm = Form.create({action: '/signup', class: 'myform-class'}, {
    user: {firstName: 'Lucas', lastName: 'Pelegrino', email: 'my@email.com'}
});

// opens the form 
myForm.open(); // will return: <form action="/signup" class="myform-class">

console.log(myForm.text().attr('name', 'user[firstName]').render()); // will return: <input type="text" name="user[firstName]" value="Lucas" />

// add the last name field and renders it
myForm.text().attr('name', 'user[lastName]').render(); // will return: <input type="text" name="user[lastName]" value="Pelegrino" />

// add the email field and renders it
myForm.email().attr('name', 'user[email]').render(); // will return: <input type="email" name="user[email]" value="my@email.com" />

// closes form
myForm.end();
