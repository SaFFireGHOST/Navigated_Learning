# from enum import Enum
from flask import request, jsonify
# from flask_sqlalchemy import SQLAlchemy
import flask_sqlalchemy
from datetime import datetime, timezone
from sqlalchemy import Numeric
from init import app
# from sqlalchemy import Enum
from sqlalchemy.types import Enum  # Use SQLAlchemy's Enum type

from datetime import datetime

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://1234:1234@localhost/navigated_learning'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db:  flask_sqlalchemy.SQLAlchemy = flask_sqlalchemy.SQLAlchemy(app)

# Models


class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(2048))
    description = db.Column(db.JSON)
    keywords = db.Column(db.JSON)
    polyline = db.Column(db.JSON)
    x_coordinate = db.Column(Numeric(20, 10))
    y_coordinate = db.Column(Numeric(20, 10))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    module_id = db.Column(db.Integer)
    submodule_id = db.Column(db.Integer)
    index = db.Column(db.Integer)
    type = db.Column(db.Integer)
    link = db.Column(db.String(2046))
    module = db.Column(db.String(2048))
    # embedding = db.Column(db.JSON)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'keywords': self.keywords,
            'polyline': self.polyline,
            'x': self.x_coordinate,
            'y': self.y_coordinate,
            'course_id': self.course_id,
            'module_id': self.module_id,
            'submodule_id': self.submodule_id,
            'index':self.index,
            'type': self.type,
            # 'embedding': self.embedding,
            'link': self.link
        }


class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250))
    description = db.Column(db.JSON)
    keywords = db.Column(db.JSON)
    polyline = db.Column(db.JSON)
    x_coordinate = db.Column(Numeric(20, 10))
    y_coordinate = db.Column(Numeric(20, 10))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    embedding = db.Column(db.JSON)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'keywords': self.keywords,
            'polyline': self.polyline,
            'x_coordinate': self.x_coordinate,
            'y_coordinate': self.y_coordinate,
            'course_id': self.course_id,
            # 'embedding': self.embedding
        }


class Learner(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    registered_date = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))
    name = db.Column(db.String(250))
    cgpa = db.Column(Numeric(20, 10))
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))
    enrollments = db.relationship('Enroll', backref='learner', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'registered_date': self.registered_date.isoformat() if self.registered_date else None,
            'name': self.name,
            'cgpa': self.cgpa,
            'username': self.username,
            'password': self.password
        }


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250))
    description = db.Column(db.JSON)
    initial_position = db.Column(db.JSON)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'initial_position': self.initial_position
        }


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    time = db.Column(db.DateTime, default=datetime.utcnow)
    type_id = db.Column(db.Integer)
    type = db.Column(db.String(250))
    link = db.Column(db.String(250))
    name = db.Column(db.String(250))
    enroll_id = db.Column(db.Integer, db.ForeignKey('enroll.id'))
    resource_id = db.Column(db.Integer, db.ForeignKey('resource.id'))

    def to_dict(self):
        return {
            'id': self.id,
            'time': self.time if self.time else None,
            'type_id': self.type_id,
            'enroll_id': self.enroll_id,
            'resource_id': self.resource_id,
            'link': self.link,
            'name': self.name,
            'type': self.type

        }


class Enroll(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    learner_id = db.Column(db.Integer, db.ForeignKey('learner.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    x_coordinate = db.Column(Numeric(20, 10))
    y_coordinate = db.Column(Numeric(20, 10))
    polyline = db.Column(db.JSON)
    accessible_resources = db.Column(db.JSON)  # Array of resource ids

    def to_dict(self):
        return {
            'id': self.id,
            'learner_id': self.learner_id,
            'course_id': self.course_id,
            'x_coordinate': self.x_coordinate,
            'y_coordinate': self.y_coordinate,
            'polyline': self.polyline,
            'accessible_resources': self.accessible_resources
        }


class Contribution(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    enroll_id = db.Column(db.Integer, db.ForeignKey('enroll.id'))
    submitted_on = db.Column(db.DateTime, default=datetime.utcnow)
    contribution_content = db.Column(db.TEXT)
    description = db.Column(db.JSON)
    prev_polyline = db.Column(db.JSON)
    polyline = db.Column(db.JSON)
    x_coordinate = db.Column(Numeric(20, 10))
    y_coordinate = db.Column(Numeric(20, 10))
    embedding = db.Column(db.JSON)

    def to_dict(self):
        return {
            'id': self.id,
            'enroll_id': self.enroll_id,
            'submitted_on': self.submitted_on.isoformat() if self.submitted_on else None,
            'contribution_content': self.contribution_content,
            'description': self.description,
            'prev_polyline': self.prev_polyline,
            'polyline': self.polyline,
            'x_coordinate': self.x_coordinate,
            'y_coordinate': self.y_coordinate,
            'embedding': self.embedding
        }

    def to_sub_dict(self):
        return {
            'id': self.id,
            'enroll_id': self.enroll_id,
            'submitted_on': self.submitted_on.isoformat() if self.submitted_on else None,
            'contribution_content': self.contribution_content,
            'description': self.description,
            'prev_polyline': self.prev_polyline,
            'polyline': self.polyline,
            'x_coordinate': float(self.x_coordinate) if self.x_coordinate else None,
            'y_coordinate': float(self.y_coordinate) if self.y_coordinate else None,
        }


class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    total_questions = db.Column(db.Integer, nullable=False)
    questions = db.relationship('Question', backref='quiz', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'total_questions': self.total_questions
        }


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(255))
    option_b = db.Column(db.String(255))
    option_c = db.Column(db.String(255))
    option_d = db.Column(db.String(255))
    correct_answer = db.Column(db.String(1), nullable=False)
    polyline = db.Column(db.JSON)

    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'question_text': self.question_text,
            'option_a': self.option_a,
            'option_b': self.option_b,
            'option_c': self.option_c,
            'option_d': self.option_d,
            'correct_answer': self.correct_answer
        }


class UserQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    score = db.Column(db.Numeric(5, 2))
    status = db.Column(Enum('completed', 'in-progress',
                       name='quiz_status'), nullable=False)
    attempt_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quiz_id': self.quiz_id,
            'score': self.score,
            'status': self.status,
            'attempt_date': self.attempt_date.isoformat() if self.attempt_date else None
        }


# Initialize database
with app.app_context():
    db.create_all()

# Routes

# Learners


@app.route('/learners', methods=['GET'])
def get_learners():
    learners = Learner.query.all()
    return jsonify([learner.to_dict() for learner in learners])


@app.route('/learners', methods=['POST'])
def create_learner():
    data = request.get_json()
    new_learner = Learner(
        name=data['name'],
        cgpa=data['cgpa'],
        username=data['username'],
        password=data['password']
    )
    db.session.add(new_learner)
    db.session.commit()
    return jsonify(new_learner.to_dict()), 201

# Courses


@app.route('/course/<int:id>', methods=['GET'])
def get_courses(id):
    course = Course.query.filter_by(id=id).first()
    return (course.to_dict())


@app.route('/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    new_course = Course(
        name=data['name'],
        description=data['description']
    )
    db.session.add(new_course)
    db.session.commit()
    return jsonify(new_course.to_dict()), 201

# Resources


@app.route('/resources/<int:id>', methods=['GET'])
def get_resources(id):
    resources = Resource.query.filter_by(course_id=id)
    print("resources are ")
    # print([resource.to_dict() for resource in resources])
    return jsonify([resource.to_dict() for resource in resources])


@app.route('/resources', methods=['POST'])
def create_resource():
    data = request.get_json()
    new_resource = Resource(
        name=data['name'],
        description=data['description'],
        keywords=data['keywords'],
        polyline=data['polyline'],
        x_coordinate=data['x_coordinate'],
        y_coordinate=data['y_coordinate'],
        course_id=data['course_id'],
        type=data['type']
        # ,
        # embedding=data['embedding']
    )
    db.session.add(new_resource)
    db.session.commit()
    return jsonify(new_resource.to_dict()), 201

# Topics


@app.route('/topics/<int:id>', methods=['GET'])
def get_topics(id):
    topics = Topic.query.filter_by(course_id=id)
    return jsonify([topic.to_dict() for topic in topics])


@app.route('/topics', methods=['POST'])
def create_topic():
    data = request.get_json()
    new_topic = Topic(
        name=data['name'],
        description=data['description'],
        keywords=data['keywords'],
        polyline=data['polyline'],
        x_coordinate=data['x_coordinate'],
        y_coordinate=data['y_coordinate'],
        course_id=data['course_id'],
        embedding=data['embedding']
    )
    db.session.add(new_topic)
    db.session.commit()
    return jsonify(new_topic.to_dict()), 201

# Enrolls


@app.route('/enrolls/<int:id>', methods=['GET'])
def get_enroll(id):
    enroll = Enroll.query.get(id)
    return jsonify(enroll.to_dict())


# @app.route('/enrolls', methods=['POST'])
# def create_enroll():
#     data = request.get_json()
#     new_enroll = Enroll(
#         learner_id=data['learner_id'],
#         course_id=data['course_id'],
#         # x_coordinate=data['x_coordinate'],
#         # y_coordinate=data['y_coordinate'],
#         polyline=data['polyline']
#     )
#     db.session.add(new_enroll)
#     db.session.commit()
#     return jsonify(new_enroll.to_dict()), 201

# Activities


@app.route('/activities/<int:id>', methods=['GET'])
def get_activities(id):
    activities = Activity.query.filter_by(enroll_id=id)
    return jsonify([activity.to_dict() for activity in activities])


@app.route('/activities', methods=['POST'])
def create_activity():
    data = request.get_json()
    new_activity = Activity(
        time=datetime.strptime(data['time'], '%Y-%m-%d %H:%M:%S'),
        # type_id=data['type_id'],
        type=data['type'],
        name=data['name'],
        link=data['link'],
        enroll_id=data['enroll_id'],
        # resource_id=data['resource_id']
    )
    db.session.add(new_activity)
    db.session.commit()
    return jsonify(new_activity.to_dict()), 201

# Contributions


@app.route('/contributions/<int:id>', methods=['GET'])
def get_contributions(id):
    contributions = Contribution.query.filter_by(enroll_id=id)

    return jsonify([contribution.to_sub_dict() for contribution in contributions])


@app.route('/contributions', methods=['POST'])
def create_contribution():
    data = request.get_json()
    new_contribution = Contribution(
        enroll_id=data['enroll_id'],
        submitted_on=datetime.strptime(
            data['submitted_on'], '%Y-%m-%d %H:%M:%S'),
        file_path=data['file_path'],
        description=data['description'],
        prev_polyline=data['prev_polyline'],
        polyline=data['polyline'],
        x_coordinate=data['x_coordinate'],
        y_coordinate=data['y_coordinate'],
        embedding=data['embedding']
    )
    db.session.add(new_contribution)
    db.session.commit()
    return jsonify(new_contribution.to_dict()), 201

# Quizzes


@app.route('/quizzes', methods=['GET'])
def get_quizzes():
    quizzes = Quiz.query.all()
    return jsonify([quiz.to_dict() for quiz in quizzes])


@app.route('/quizzes', methods=['POST'])
def create_quiz():
    data = request.get_json()
    new_quiz = Quiz(
        title=data['title'],
        description=data.get('description'),
        total_questions=data['total_questions']
    )
    db.session.add(new_quiz)
    db.session.commit()
    return jsonify(new_quiz.to_dict()), 201

# Questions


@app.route('/questions', methods=['GET'])
def get_questions():
    quiz_id = request.args.get('quiz_id')
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    return jsonify([question.to_dict() for question in questions])


@app.route('/questions', methods=['POST'])
def create_question():
    data = request.get_json()
    new_question = Question(
        quiz_id=data['quiz_id'],
        question_text=data['question_text'],
        option_a=data.get('option_a'),
        option_b=data.get('option_b'),
        option_c=data.get('option_c'),
        option_d=data.get('option_d'),
        correct_answer=data['correct_answer']
    )
    db.session.add(new_question)
    db.session.commit()
    return jsonify(new_question.to_dict()), 201

# UserQuiz : log of quizzes attempted by various users


@app.route('/user_quizzes', methods=['GET'])
def get_user_quizzes():
    user_id = request.args.get('user_id')
    user_quizzes = UserQuiz.query.filter_by(user_id=user_id).all()
    return jsonify([user_quiz.to_dict() for user_quiz in user_quizzes])


@app.route('/user_quizzes', methods=['POST'])
def create_user_quiz():
    data = request.get_json()
    new_user_quiz = UserQuiz(
        user_id=data['user_id'],
        quiz_id=data['quiz_id'],
        score=data.get('score'),
        status=data['status'],
        attempt_date=datetime.strptime(
            data['attempt_date'], '%Y-%m-%d %H:%M:%S') if 'attempt_date' in data else None
    )
    db.session.add(new_user_quiz)
    db.session.commit()
    return jsonify(new_user_quiz.to_dict()), 201


if __name__ == '__main__':
    app.run(debug=True)
