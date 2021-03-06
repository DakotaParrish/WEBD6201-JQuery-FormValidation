/*************************************************************************************************************************************
 * Written By: Dakota Parrish 100764514, Jordan Wriker 100445715
 * Program Name: WEBD6201-JQuery And Form Validation
 * Due Date: Sunday February 27, 2022
 * Description: Added login and register page functionality using JQuery. Used Regular expressions to validate each input
 * field on register page. Once User has successfully logged in, username is injected into nav bar between contact us and
 * login/logout. If there is an invalid input on the register page, error is shown. Once user has correct information entered on register page,
 * console displays output.
 */
class User
{
   // TODO: missing Getters and Setters

    // constructor
    constructor(firstName = "", lastName = "",  emailAddress = "", password = "")
    {
        this.FirstName = firstName;
        this.LastName = lastName;
        this.UserName = firstName.toLowerCase() + lastName.toLowerCase();
        this.EmailAddress = emailAddress;
        this.Password = password;
    }   

    // overriden methods
    toString() 
    {
      return `Name : ${this.FirstName} ${this.LastName}\nEmail Address : ${this.EmailAddress}`;
    }   

    // utility methods
    toJSON()
    {
        return {
            "FirstName": this.FirstName,
            "LastName": this.LastName,
            "EmailAddress": this.EmailAddress,
            "Password": this.Password
        }
    }

    fromJSON(data)
    {
        this.FirstName = data.FirstName;
        this.LastName = data.LastName;
        this.EmailAddress = data.EmailAddress;
        this.UserName = data.Username;
        this.Password = data.Password;
    }

    serialize()
    {
        if(this.FirstName !== "" && this.LastName !== "" && this.Username !== "" && this.EmailAddress !== "" && this.Password !== "")
        {
            return `${this.FirstName},${this.LastName},${this.EmailAddress},${this.UserName},${this.Password},`;
        }
        console.error("One or more properties of the User Object are missing or invalid");
        return null;
    }
    
    deserialize(data) // assume that data is in a comma-separated format (string array of properties)
    {
        let propertyArray = data.split(",");
        this.FirstName = propertyArray[0];
        this.LastName = propertyArray[1];
        this.UserName = propertyArray[2];
        this.EmailAddress = propertyArray[3];
        this.Password = propertyArray[4];
    }
}

// IIFE -- Immediately Invoked Function Express
// AKA anonymous self-executing function

"use strict";
(function()
{
    /**
     * This function uses AJAX open a connection to the url and returns data to the callback function
     *
     * @param {string} method
     * @param {string} url
     * @param {Function} callback
     */
    function AjaxRequest(method, url, callback)
    {
        // step 1 - create a new XHR object
        let XHR = new XMLHttpRequest();

        // step 2 - create an event
        XHR.addEventListener("readystatechange", ()=>
        {
            if(XHR.readyState === 4 && XHR.status === 200)
            {
               callback(XHR.responseText);
            }
        });

        // step 3 - open a request
        XHR.open(method, url);

        // step 4 - send the request
        XHR.send();
    }

    /**
     * This function loads the Navbar from the header file and injects into the page
     *
     * @param {string} data
     */
    function LoadHeader(data)
    {
        $("header").html(data);
        $(`li>a:contains(${document.title})`).addClass("active");
        CheckLogin();
    }

    function DisplayHome()
    {
        console.log("Home Page");

        

        $("#AboutUsButton").on("click", () => 
        {
            location.href = "about.html";
        });

        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`);

        $("body").append(`
        <article class="container">
            <p id="ArticleParagraph" class="mt-3">This is the Article Paragraph</p>
            </article>`);
    }

    function DisplayAboutPage()
    {
        console.log("About Us Page");
    }

    function DisplayProjectsPage()
    {
        console.log("Our Projects Page");
    }

    function DisplayServicesPage()
    {
        console.log("Our Services Page");
    }

    /**
     * Adds a Contact Object to localStorage
     *
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName, contactNumber, emailAddress)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0, 1) + Date.now();

            localStorage.setItem(key, contact.serialize());
        }
    }

    /**
     * This method validates an input text field in the form and displays
     * an error in the message area
     *
     * @param {string} input_field_ID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(input_field_ID, regular_expression, error_message)
    {
        let messageArea = $("#messageArea").hide();
        
        $("#" + input_field_ID).on("blur", function()
        {
            let inputFieldText = $(this).val();

            if(!regular_expression.test(inputFieldText))
            {
                $(this).trigger("focus").trigger("select"); 
                messageArea.addClass("alert alert-danger").text(error_message).show(); 
            }
            else
            {
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function ContactFormValidation()
    {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]{1,})+([\s,-]([A-Z][a-z]{1,}))*$/,"Please enter a valid Full Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}$/, "Please enter a valid Contact Number.");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }

    function DisplayContactPage()
    {
        console.log("Contact Us Page");

        ContactFormValidation();
        
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function()
        {
            if(subscribeCheckbox.checked)
            { 
                AddContact(fullName.value, contactNumber.value, emailAddress.value);
            }
        });
    }

    function DisplayContactListPage()
    {
        console.log("Contact-List Page");

        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList");

            let data = ""; // data container -> add deserialized data from the localStorage

            let keys = Object.keys(localStorage); // returns a string array of keys

            let index = 1; // counts how many keys

            // for every key in the keys array (collection), loop
            for (const key of keys) 
            {
                let contactData = localStorage.getItem(key); // get localStorage data value related to the key

                let contact = new core.Contact(); // create a new empty contact object
                contact.deserialize(contactData);

                // inject a repeatable row into the contactList
                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>
                `;

                index++;
            }

            contactList.innerHTML = data;

            $("#addButton").on("click",() =>
            {
                location.href = "edit.html#add";
            });

            $("button.delete").on("click", function()
            {
                if(confirm("Are you sure?"))
                {
                    localStorage.removeItem($(this).val());
                }

                // refresh after deleting
                location.href = "contact-list.html";
            });

            $("button.edit").on("click", function()
            {
                location.href = "edit.html#" + $(this).val();
            });
        }
    }

    function DisplayEditPage()
    {
        console.log("Edit Page");

        ContactFormValidation();

        let page = location.hash.substring(1);

        switch(page)
        {
            case "add":
                {
                    $("main>h1").text("Add Contact");

                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);
                
                    $("#editButton").on("click", (event)=>
                    {
                        event.preventDefault();
                        // Add Contact
                        AddContact(fullName.value, contactNumber.value, emailAddress.value);
                        // refresh the contact-list page
                        location.href = "contact-list.html";
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "contact-list.html";
                    });
                }
                break;
            default:
                {
                    // get the contact  info from localStorage
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));

                    // display the contact info in the edit form
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    // when editButton is pressed - update the contact
                    $("#editButton").on("click", (event)=>
                    {
                        event.preventDefault();

                        // get any changes from the form
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();

                        // replace the item in localStorage
                        localStorage.setItem(page, contact.serialize());

                        // return to the contact-list
                        location.href = "contact-list.html";
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "contact-list.html";
                    });
                }
                break;
        }
    }
    /**
     * DisplayLoginPage Function - Displays the Login page.
     *
     */
    function DisplayLoginPage()
    {
        console.log("Login Page");
        let messageArea = $("#messageArea");
        messageArea.hide();

        /**
         * Click event for login button
         */
        $("#loginButton").on("click", function()
        {
            let success = false;

            // create an empty user object
            let newUser = new User();

            // use jQuery shortcut to lod the users.json file
            $.get("./Data/users.json", function(data)
            {
                // for every user in the users.json file, loop
                for (const user of data.users) 
                {
                    // check if the username and password entered matches the user data
                    if(username.value == user.Username && password.value == user.Password)
                    {
                        console.log("conditional passed!");
                        // get the user data from the file and assign it to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                 // if username and password matches..success! -> perform the login sequence
                if(success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize());

                    // hide any error message
                    messageArea.removeAttr("class").hide();

                    // redirect the user to the secure area of the site - contact-list.html
                    location.href = "contact-list.html";
                }
                else
                {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Credentials").show();
                }
            });
        });

        $("#cancelButton").on("click", function()
        {
            // clear the login form
            document.forms[0].reset();

            // return to the home page
            location.href = "index.html";
        });
    }

    /**
     * CheckLogin() - Method that swaps the login navbar item to logout as well as inserts
     * the username for the login in between the Contact Us navbar item and Login/Logout navbar item.
     *
     */
    function CheckLogin()
    {
        // if user is logged in, then...
        if(sessionStorage.getItem("user"))
        {
            // swap out the login link for logout
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            );

            /*Performs logout action*/
            $("#logout").on("click", function()
            {
                // perform logout
                sessionStorage.clear();
                
                // redirect back to login page
                location.href = "login.html";
            })

            //Inserts username value into the nav bar between contact us and logout
            let userName = sessionStorage.getItem("user").split(',')[3];
            let contactListNavbar = $("a:contains('Contact Us')").parent();
            let user = sessionStorage.getItem("user").split(',');
            console.log(user);
            contactListNavbar.after(`<li class="nav-item"><a class="nav-link disabled">${userName}</a></li>`);
        }
    }


    /**
     * RegistrationPageValidation Function - This method validates an input text field in the form and displays
     * an error in the message area located on the register.html page.
     *
     * @param {*} input_field_ID
     * @param {*} regular_expression
     * @param {*} error_message
     */
    function RegistrationPageValidation(input_field_ID, regular_expression, error_message)
    {
        let errorMessage = $("#ErrorMessage");

        $("#" + input_field_ID).on("blur", function()
        {
            let inputFieldText = $(this).val();

            if(!regular_expression.test(inputFieldText))
            {
                $(this).trigger("focus");
                $(this).trigger("select");
                console.log("Testing");
                errorMessage.show().addClass("alert alert-danger").text(error_message);
            }
            else
            {
                errorMessage.removeAttr("class").hide();
            }
        });
    }

    /**
     * Takes the password and confirm password values and breaks them in to character arrays.
     * It then checks to see if both arrays are the same length and if so compares each character.
     * Returns true or false depending on if the two strings match.
     * 
     * @param {string} password 
     * @param {string} check_password 
     * @returns {boolean} isMatch
     */
    function ConfirmPassword(password, check_password)
    {
        let isMatch = true;
        let passwordSplit = password.split('');
        let check_passwordSplit = check_password.split('');

        if(passwordSplit.length == check_passwordSplit.length)
        {
            for(i = 0; i < check_passwordSplit.length; i++)
            {
                if(passwordSplit[i] != check_passwordSplit[i])
                {
                    console.log("Passwords do not match");
                    isMatch = false;
                }
            }
        }
        else
        {
            isMatch = false;
        }

        if(isMatch == false)
        {
            return isMatch;
        }
        else
        {
            return isMatch;
        }
    }
    /**
     * RegistrationFormValidation Function - Validates for each input on the register.html page by using Regular expressions
     * as well as using the RegistrationPageValidation() method.
     *
     */
    function RegistrationFormValidation()
    {
        RegistrationPageValidation("FirstName", /([A-Z][a-z]{1,})/, "Invalid First Name! First Name must be at least 2 letters and start with a capital letter!");
        RegistrationPageValidation("lastName", /([A-Z][a-z]{1,})/, "Invalid Last Name! Last Name must be at least 2 letters and start with a capital letter!");

        RegistrationPageValidation("emailAddress", /^([a-zA-Z0-9._%-]{8,}@[a-zA-Z0-9-]{4,}\.[a-zA-Z]{2,6})*$/, "Please enter a valid email address");
        RegistrationPageValidation("password", /^([a-zA-Z0-9._%-]{6,})*$/, "Invalid Password! Password must be at least 6 characters in length");

        RegistrationPageValidation("confirmPassword", /^([a-zA-Z0-9._%-]{6,})*$/, "Invalid Password! Password must be at least 6 characters in length");
    }

    /**
     * DisplayRegisterPage Function - Displays the registration page.
     *
     */
    function DisplayRegisterPage()
    {
        console.log("Register Page");
        $("#contentArea").prepend(`<div id="ErrorMessage">ERROR MESSAGE</div>`);
        $("#ErrorMessage").hide();
        let errorMessage = $("#ErrorMessage");
        emailAddress.text = "Email";
        password.text = "Password";
        RegistrationFormValidation();
        
        /**
         *  Click event for the submit button. Checks to see if all fields have data and if they do it check to see if both passwords are the same.
         * If the data is fine a new User is created and the form is reset. If there is a problem with the data an error is displayed. 
         */
        $("#submitButton").on("click", function(event)
        {
            
            console.log("Testing");
            event.preventDefault();
            if(FirstName.value != null)
            {
                if(lastName.value != null)
                {
                    if(emailAddress.value != null)
                    {
                        if(password.value != null)
                        {
                            if(ConfirmPassword(password.value, confirmPassword.value) == false)
                            {
                                errorMessage.show().addClass("alert alert-danger").text("Invalid Password! They do not match");
                                $("#password").trigger("focus");
                                $("#password").trigger("select");
                            }
                            else
                            {
                                let newUser = new User(FirstName.value, lastName.value, emailAddress.value,password.value);
                                console.log(newUser.toString() + "\nCreated!");
                                FirstName.value = "";
                                lastName.value = "";
                                emailAddress.value = "";
                                password.value = "";
                                confirmPassword.value = "";
                            }
                            
                        }
                        else
                        {
                            errorMessage.show().addClass("alert alert-danger").text("Error! Password cannot be blank.");
                            $("#password").trigger("focus");
                            $("#password").trigger("select");                            
                        }                
                    }
                    else
                    {
                        errorMessage.show().addClass("alert alert-danger").text("Error! Email Address cannot be blank.");
                        $("#emailAddress").trigger("focus");
                        $("#emailAddress").trigger("select");                        
                    }
                }
                else
                {
                    errorMessage.show().addClass("alert alert-danger").text("Error! Last Name cannot be blank.");
                    $("#lastName").trigger("focus");
                    $("#lastName").trigger("select");                    
                }
            }
            else
            {
                errorMessage.show().addClass("alert alert-danger").text("Error! First Name cannot be blank.");
                $("#FirstName").trigger("focus");
                $("#FirstName").trigger("select");
            }
        });
    }

 

    // named function
    function Start()
    {
        console.log("App Started!!");

        AjaxRequest("GET", "header.html", LoadHeader);

        switch (document.title) 
        {
          case "Home":
            DisplayHome();
            break;
          case "About Us":
            DisplayAboutPage();
            break;
          case "Our Projects":
            DisplayProjectsPage();
            break;
          case "Our Services":
            DisplayServicesPage();
            break;
          case "Contact-List":
            DisplayContactListPage();
            break;
          case "Contact Us":
            DisplayContactPage();
            break;
          case "Edit":
            DisplayEditPage();
            break;
            case "Login":
            DisplayLoginPage();
            break;
            case "Register":
            DisplayRegisterPage();
            break;
        }

        //Calls the CheckLogin() function
        CheckLogin();

    }
    

    window.addEventListener("load", Start);


})();