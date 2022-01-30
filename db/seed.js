// inside db/seed.js

// grab our client with destructuring from the export in index.js
const { 
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getUserById
} = require('./index');




// this function should call a query which drops all tables from our database
async function dropTables() {
    try {

        console.log("Starting to drop tables...");

      await client.query(`

      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
  
      `);

      console.log("Finished dropping tables!");
    } catch (error) {

      throw error; // we pass the error up to the function that calls dropTables
    }
  }

  async function createTables() {
    try {

        console.log("Starting to build tables...");
        
      await client.query(`
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts(
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
     
      `);
      console.log("Finished building tables!");
    } catch (error) {
      throw error; // we pass the error up to the function that calls createTables
    }
  }

  async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'albert', location:'santa clara' });
      const sandra = await createUser({ username: 'sandra', password: 'sandy2810', name: 'sandra', location:'san jose ' });
      const glamgal = await createUser({ username: 'glamgal', password: 'glam0214' , name: 'glamgal', location:'san francisco' });
      
  
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  

  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      console.error(error);
    } 
  }

  async function testDB() {
    try {
        console.log("Starting to test database...");
    // this only calls for the users to see if the call is working 
        // const users = await getAllUsers();
        // console.log("Result:", users);
    // this is updating a users info in the database, we are testing here
        // console.log("Calling updateUser on users[0]")
        // const updateUserResult = await updateUser(users[0].id, {
        //   name: "Newname Sogood",
        //   location: "Lesterville, KY"
        // });
        // console.log("Result:", updateUserResult);

        const posts = await getUserById(1);    
            console.log("this is  getuserbyid", posts);

    
        console.log("Finished database tests!");
      } catch (error) {
        console.error("Error testing database!");
        throw error;
      }
  }
  
  

  rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());