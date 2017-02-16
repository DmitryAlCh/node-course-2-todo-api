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
  text: "Second test todo"
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
