const expect = require ('expect');
const request = require ('supertest');
const {ObjectID} = require ('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: "First test todo"
},{
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>{
    done();
  });
});

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
