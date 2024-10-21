reset password token => it will generate a link and send it to email it will  be a frontened link to reset passwod (so it will control the link generate and send to email)

reset paswword=> it will update the password in your DB

Auth.js=> send otp , login , signup and change password 

createdAt :-1 => means to arrange in desending order where recent comes first 
limit 1 to restrict record to just 1


we had used dice bear to create image automatically




we had put the token and expiration time in user model

The crypto module is a built-in module in Node.js that provides cryptographic functionality. In this specific case, it's being used to generate a Universally Unique Identifier (UUID) which serves as a random token for password reset functionality.

new:true   is marked so that we get updated details in res