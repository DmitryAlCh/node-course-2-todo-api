const expect = require ('expect');
const request = require ('supertest');
const {ObjectID} = require ('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post/todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test to do test';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
      });
  });

  it('Should not create todo with invalid data', (done) =>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res)=>{
        if (err){
          return done(err);
        }
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>{
          done(e);
        });
      });
  });
});

describe('Get /todos', () => {
  it('Shoud get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('Get / todos /:id', ()=>{
  it('Should get a specific todo', (done) =>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('Should return 404 if no todo found', (done) => {
    //make sure you get a 404 back
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 for non-object Ids', (done) => {
    // todos/123
    request(app)
      .get('/todos/123')
      // .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('Delete /todos/:id', ()=>{
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
     .delete(`/todos/${hexId}`)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo._id).toBe(hexId);
     })
     .end((err, res) =>{
       if(err){
         return done(err);
       }
      //  query database find By Id, toNotExist
      Todo.findById(hexId).then((todo) => {
        // console.log('Find is fired');
        // console.log(`Found todo: ${todo}`);
        // console.log(`Response status is: ${res.status}`);
        // console.log(todo.body);
        expect(todo).toNotExist();
        done();
      }).catch((e)=>{
        done(e);
      });
    });
  });
  it('Should return 404 if todo not found', (done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  it('Should return 404 if object Id is invalid', (done)=>{
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', ()=>{
  it('Should update the todo', (done) =>{
    // grab is of first item
    var hexId = todos[0]._id.toHexString();
    // update text, set completed true
    var newText = "New text inserted during testing";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({"text": newText, "completed": true})
    // 200
      .expect(200)
    // text is changed, completed is true, completedAt is a number
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }
        done();
      });

  });

  it('Should clear completedAt when todo is not completed', (done) => {
    // grab Id, of second todo item
    var hexId = todos[1]._id.toHexString();
    var secondTestText = "Changing the text inside second test";
    // update text, set completed to false
    request(app)
      .patch(`/todos/${hexId}`)
      .send({"text": secondTestText, completed: false})
    // 200
      .expect(200)
    // text is changed, completed is false, completed at is null
      .expect((res) => {
        expect(res.body.todo.text).toBe(secondTestText);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end((err,res)=>{
        if (err){
          return done(err);
        }
        done();
      });
  });
});

describe('Get /users/me', ()=>{
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);

  });

  it('Should retutn 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST / users', () => {
  it('Should create a user', (done) => {
    var email = "volodja@volodja.com";
    var password = 'secret';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if (err){
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          done();
        });
      });
  });

  it('Should return validation errors if request invalid', (done) =>{
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .end(done);
  });

  it('Shlud not create user if email in use', (done) => {
    var email='example@example.com';
    var password = 'anypassword';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

});

describe('Post/users/login', () => {
  it('Should login user and return an auth token', (done) =>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
      });
  });
});

  it('Should reject invalid login',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res)=>{
        if (err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
        }).catch((e)=>done(e));
      });
  });


});

describe('Delete /users/me/token', ()=>{
  it('Should remove auth token on logout',(done)=>{

    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          done(err);
        }
        User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
        }).catch((e)=>done(e));
      });
  });
});
