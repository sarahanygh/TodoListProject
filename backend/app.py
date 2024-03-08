# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sara12345@localhost:5433/Data'
db = SQLAlchemy(app)

# Define the Todo model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Todo {self.id} {self.text} {self.is_completed}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'text': self.text,
            'is_completed': self.is_completed
        }

# Create the database tables
with app.app_context():

  db.create_all()

# Routes for CRUD operations
@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.order_by(Todo.id).all()
    return jsonify([todo.serialize() for todo in todos])

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.json
    new_todo = Todo(text=data['text'], is_completed=data['is_completed'])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.serialize())

@app.route('/api/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    todo = Todo.query.get(id)
    data = request.json
    todo.text = data['text']
    todo.is_completed = data['is_completed']
    db.session.commit()
    return jsonify(todo.serialize())

@app.route('/api/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = Todo.query.get(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted'})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
