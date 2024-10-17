trim: true option is used for string fields to automatically remove leading and trailing whitespace from the value before saving it to the database.


 enum is used to define a set of allowed values for a specific field. It ensures that the value of the field must match one of the values specified in the enum array. This is useful for fields that can only have a limited set of predefined options, enforcing data consistency and reducing errors.


 ObjectId is typically used to reference another document in a different or the same collection.

 Explanation of populate():
Without populate(), Mongoose only returns the reference (ObjectId) stored in the additionalDetail field.
With populate(), Mongoose fetches the document from the Profile collection that corresponds to the ObjectId and inserts it in place of the ObjectId in the user document.