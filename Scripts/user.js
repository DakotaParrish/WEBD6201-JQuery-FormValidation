(function(core){

    class User
    {
        // TODO: missing Getters and Setters

        // constructor
        constructor(firstName = "", lastName = "", emailAddress = "", username ="", password = "")
        {
            
            this.FirstName = firstName;
            this.lastName = lastName;
            this.EmailAddress = emailAddress;
            this.Username = username;
            this.Password = password;
        }

        // overriden methods
        toString()
        {
            return `First Name : ${this.FirstName}\nLast Name : ${this.LastName}\nEmail Address : ${this.EmailAddress}\nUsername : ${this.Username}`;
        }

        // utility methods
        toJSON()
        {
            return {
                "FirstName": this.FirstName,
                "LastName": this.LastName,
                "EmailAddress": this.EmailAddress,
                "Username": this.Username
            }
        }

        fromJSON(data)
        {
            this.FirstName = data.FirstName;
            this.LastName = data.LastName;
            this.EmailAddress = data.EmailAddress;
            this.Username = data.Username;
            this.Password = data.Password;
        }

        serialize()
        {
            if(this.FirstName !== "" && this.LastName !== "" && this.EmailAddress !== "" && this.Username !== "")
            {
                return `${this.FirstName},${this.LastName},${this.EmailAddress},${this.Username}`;
            }
            console.error("One or more properties of the User Object are missing or invalid");
            return null;
        }
    
        deserialize(data) // assume that data is in a comma-separated format (string array of properties)
        {
            let propertyArray = data.split(",");
            this.FirstName = propertyArray[0];
            this.LastName = propertyArray[1];
            this.EmailAddress = propertyArray[2];
            this.Username = propertyArray[3];
        }
    }

    core.User = User;

})(core || (core={}));