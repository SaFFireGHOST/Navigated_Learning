import pandas as pd
from modelsRoutes import db, Course, Topic, app, Enroll, Learner, Contribution, Quiz, Question, UserQuiz, Resource
from model_library import apply_preprocessing, create_topic_embeddings, create_topic_polylines, pushResourcesToDB, push_topics_to_db, create_resource_embeddings, create_resource_polylines, create_keywords_list, rad_plot_axes, rad_plot_poly, get_cord_from_polyline
from flask import jsonify
from datetime import datetime, timezone
from itertools import chain
from utils import get_highline_of_polylines, convert_to_lists, get_lowline_of_polylines, calculate_centroid, nearest_seven
from collections import defaultdict


def update_position(summary, enrollId, courseId):
    print(summary, enrollId, courseId)
    # (all_keywords_list, all_weight_list) = create_keywords_list([summary])
    # keybert_embeddings_list = create_embeddings_list(all_keywords_list)
    # new_keybert_embeddings_list = create_embeddings_centroid_list(
    #     keybert_embeddings_list)
    # all_polylines = create_polyline(new_keybert_embeddings_list, courseId)
    # polylines = db.session.query(Enroll.polyline).filter_by(id=enrollId).all()
    # print(polylines)

    (all_keywords_list, all_weight_list) = create_keywords_list([summary])
    learner_embeddings = create_resource_embeddings(all_keywords_list)
    topicembedding = db.session.query(
        Topic.embedding).filter_by(course_id=courseId).all()
    if not topicembedding:
        raise IndexError()

    learner_polylines = create_resource_polylines(
        topicembedding, learner_embeddings, 8)
    print(learner_polylines)
    # print(centroid_list)
    enroll: Enroll = Enroll.query.get(enrollId)
    if not enroll:
        raise IndexError
    resources: list[Resource] = Resource.query.filter_by(
        course_id=enroll.course_id).all()
    polylines = enroll.polyline
    print(polylines)
    new_polylines = get_highline_of_polylines(
        [learner_polylines[0], polylines])
    print(f'new polylines are {new_polylines}')
    original_list = convert_to_lists(new_polylines)
    print(f'original list is {original_list}')
    new_polylines_list = [item for sublist in original_list for item in (
        sublist if isinstance(sublist, list) else [sublist])]
    print(f'new polylines list is {new_polylines_list}')
    # new_polylines_list=original_list

    feature_length = len(learner_polylines[0])
    (tlen, theta) = rad_plot_axes(feature_length, 1, 1)
    centroid_list = rad_plot_poly(
        feature_length, [new_polylines_list], tlen, theta)
    print(f'centroid list is {centroid_list}')
    enroll.x_coordinate = centroid_list[0][0]
    enroll.y_coordinate = centroid_list[0][1]
    enroll.polyline = new_polylines_list
    enroll.accessible_resources = list(set(enroll.accessible_resources).union(set(
        nearest_seven(enroll.polyline, [[res.id, res.polyline] for res in resources]))))
    db.session.commit()
    new_contribution = Contribution(
        enroll_id=enrollId,
        submitted_on=datetime.now(timezone.utc),
        description={"summary": True},
        contribution_content=summary,
        prev_polyline=polylines,
        polyline=new_polylines_list,
        x_coordinate=centroid_list[0][0],
        y_coordinate=centroid_list[0][1],
        embedding=learner_embeddings
    )
    db.session.add(new_contribution)
    db.session.commit()
    return centroid_list[0]

# Genearting the default data for the db


def generate_data():
    # add learners
    learner1 = add_learner("Gururaj", 4.0, "guru", "guru")
    learner2 = add_learner("Pavani", 4.0, "pavani", "pavani")
    print("Created Learners")
    # add courses
    course1=add_course("Discrete Mathematics",
                  "Discrete mathematics is the study of mathematical structures that are discrete in the sense that they assume only distinct, separate values, rather than in a range of values. The subject enables the students to formulate problems precisely, solve the problems, apply formal proof techniques and explain their reasoning clearly.")
    course2=add_course("Foundations of cryptography ","The course provides the basic paradigm and principles of modern cryptography. The focus of this course will be on definitions and constructions of various cryptographic objects. We will try to understand what security properties are desirable in such objects, how to formally define these properties, and how to design objects that satisfy the definitions.")
    print("Created Courses")

    # Add resources
    topics1 = pd.read_excel(
        r'DM/DM_topics.xlsx')
    resource_keylist_1 = pd.read_excel(
        r'DM/DM_Resource_Keywords.xlsx')
    topics2 = pd.read_excel(
        r'DM/Foundation of Cryptography_Topics.xlsx')
    resource_keylist_2 = pd.read_excel(
        r'DM/FOC_keywords_list.xlsx')
    add_resources(course1.get("id"),topics1,resource_keylist_1)
    add_resources(course2.get("id"),topics2,resource_keylist_2)
    print("Added Resources")

    # Enroll courses
    enroll1=add_enroll(learner1.get("id"),course1.get("id"))
    enroll2=add_enroll(learner2.get("id"),course2.get("id"))
    enroll3=add_enroll(learner1.get("id"),course2.get("id"))

    print("Added Ernrollments")

    # Adding a quiz and questions
    quiz_id = add_quiz(
        title="Introduction to Discrete Mathematics",
        description="A basic quiz on discrete mathematics concepts.",
        total_questions=5
    )

    # Adding questions to the quiz with polyline generation
    add_question(quiz_id, 'What is the principle of mathematical induction?',
                 'A) A method of proving the truth of an infinite number of statements.',
                 'B) A method for solving differential equations.',
                 'C) A method of finding the minimum value of a function.',
                 'D) A technique for matrix multiplication.',
                 'A', course1.get("id"))

    add_question(quiz_id, 'What is the Pigeonhole Principle?',
                 'A) If more items are put into fewer containers than there are items, then at least one container must contain more than one item.',
                 'B) A principle used in calculus for finding areas under curves.',
                 'C) A principle used in geometry for calculating angles in polygons.',
                 'D) A theorem in probability theory for finding expected values.',
                 'A', course1.get("id"))

    add_question(quiz_id, 'In graph theory, what is a tree?',
                 'A) A connected graph with no cycles.',
                 'B) A graph with exactly one cycle.',
                 'C) A fully connected graph with weighted edges.',
                 'D) A graph where all vertices are connected by exactly two edges.',
                 'A', course1.get("id"))

    add_question(quiz_id, 'What is a permutation?',
                 'A) An arrangement of all or part of a set of objects.',
                 'B) A subset of a set of objects.',
                 'C) A combination of objects where order does not matter.',
                 'D) A sequence of numbers where each number is the sum of the previous two.',
                 'A', course1.get("id"))

    add_question(quiz_id, 'What is the principle of inclusion-exclusion?',
                 'A) A formula used to count the number of elements in the union of several sets.',
                 'B) A technique for finding eigenvalues of matrices.',
                 'C) A method for solving linear equations.',
                 'D) A theorem for calculating the area of geometric shapes.',
                 'A', course1.get("id"))

    print("Added Quiz and Questions")

    # create_Course("Discreate Mathematics",
    #               "this is the description of DM", None, None)


def add_course(name, description, polylines=[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]):
    new_course = Course(
        name=name,
        description=description,
        initial_position=get_lowline_of_polylines(polylines)
    )
    with app.app_context():
        db.session.add(new_course)
        db.session.commit()
        course_dict = new_course.to_dict()
        return course_dict


def add_learner(name, cgpa, username, password):
    new_learner = Learner(
        name=name,
        cgpa=cgpa,
        username=username,
        password=password
    )
    with app.app_context():
        db.session.add(new_learner)
        db.session.commit()
        learner_dict = new_learner.to_dict()
        return learner_dict


def add_enroll(learner_id, course_id):
    with app.app_context():
        first_module_courses = Resource.query.filter_by(course_id=course_id, module_id=1)
        polylines = []
        resource_id_polyline = []
        for course_temp in first_module_courses:
            polylines.append(course_temp.polyline)
            resource_id_polyline.append([course_temp.id, course_temp.polyline])

        lowline = get_lowline_of_polylines(polylines)
        print(f' lowline is {lowline}')

        feature_length = len(lowline)
        (tlen, theta) = rad_plot_axes(feature_length, 1, 1)
        centroid_list = rad_plot_poly(
            feature_length, [lowline], tlen, theta)
        print(f'centroid list is {centroid_list}')
        x_coordinate = centroid_list[0][0]
        y_coordinate = centroid_list[0][1]
        print(f'x is {x_coordinate} y is {y_coordinate}')

        new_enroll = Enroll(
            learner_id=learner_id,
            course_id=course_id,
            x_coordinate=float(x_coordinate),
            y_coordinate=float(y_coordinate),
            polyline=lowline,
            accessible_resources=nearest_seven(lowline, resource_id_polyline)
        )

        db.session.add(new_enroll)
        db.session.commit()

        enroll_dict = new_enroll.to_dict()
        return enroll_dict

    with app.app_context():
        db.session.add(new_enroll)
        db.session.commit()
        enroll_dict = new_enroll.to_dict()
        return enroll_dict

def add_resources(course_id,topics: pd.DataFrame, resource_keylist: pd.DataFrame):
    print("this is the new course id", course_id)
    # topics = pd.read_excel(
    #     r'DM/DM_topics.xlsx')
    apply_preprocessing(topics)
    topicembedding = create_topic_embeddings(topics)
    topic_polylines = create_topic_polylines(topics, topicembedding)
    print("Done")
    push_topics_to_db(topics, topicembedding, topic_polylines, course_id)
    # resource_keylist = pd.read_excel(
    #     r'DM/DM_Resource_Keywords.xlsx')
    apply_preprocessing(resource_keylist)
    resource_embeddings = create_resource_embeddings(
        resource_keylist['tokens'])
    resource_polylines = create_resource_polylines(
        topicembedding, resource_embeddings, 8)
    print(resource_polylines[0])
    print(resource_keylist.columns)
    pushResourcesToDB(resource_keylist, resource_embeddings,
                      resource_polylines, course_id)


def create_Course(name, description, topics: pd.DataFrame, resource_keylist: pd.DataFrame):
    print("this si the new course id", course_id)
    topics = pd.read_excel(
        r'DM/DM_topics.xlsx')
    apply_preprocessing(topics)
    topicembedding = create_topic_embeddings(topics)
    topic_polylines = create_topic_polylines(topics, topicembedding)
    print("Done")

    resource_keylist = pd.read_excel(
        r'DM/DM_Resource_Keywords.xlsx')
    apply_preprocessing(resource_keylist)
    resource_embeddings = create_resource_embeddings(
        resource_keylist['tokens'])
    resource_polylines = create_resource_polylines(
        topicembedding, resource_embeddings, 8)
    print(resource_polylines[0])

    new_course = Course(
        name=name,
        description=description,
        initial_position=get_lowline_of_polylines(resource_polylines)
    )
    with app.app_context():
        db.session.add(new_course)
        db.session.commit()
        new_learner = Learner(
            name="Gururaj",
            cgpa=4.0,
            username="guru",
            password="guru"
        )
        db.session.add(new_learner)
        db.session.commit()
        new_enroll = Enroll(
            learner_id=1,
            course_id=1,
            x_coordinate=0.1,
            y_coordinate=0.1,
            polyline=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        )
        db.session.add(new_enroll)
        db.session.commit()
        course_id = new_course.id
        print(new_course.to_dict())

    push_topics_to_db(topics, topicembedding, topic_polylines, course_id)
    pushResourcesToDB(resource_keylist, resource_embeddings,
                      resource_polylines, course_id)
    # new_polylines = []
    # for single_file in all_polylines:
    #     temp = [ max([single_file[i][j]['y'] for j in range(len(single_file[i]))]) for i in range(len(single_file))]
    #     new_polylines.append(temp)
    # breakpoint()


def login(username, password):
    learner = Learner.query.filter_by(
        username=username, password=password).first()
    if not learner:
        return {"isValid": False}
    print(learner, dir(learner))
    return {"isValid": True, "username": learner.username, "id": learner.id, "cgpa": learner.cgpa, "name": learner.name}


def learner_course_enrolled(id):
    learner = Learner.query.get(id)
    if not learner:
        return jsonify({"error": "Learner not found"}), 404

    enrolled_courses = []
    for enrollment in learner.enrollments:
        course = Course.query.get(enrollment.course_id)
        if course:
            enrolled_courses.append({
                'course_id': course.id,
                'course_name': course.name,
                'course_description': course.description
            })

    return jsonify(enrolled_courses)

def enrolled_learner_data(id,id2):
    enroll = Enroll.query.filter_by(learner_id=id,course_id=id2).first()
    if not enroll:
        return jsonify({"error": "enroll not found"}), 404
    learner_name = enroll.learner.name if enroll.learner else "Unknown"
    print(enroll.x_coordinate, enroll.y_coordinate)
    return {"x_coordinate": float(enroll.x_coordinate), "y_coordinate": float(enroll.y_coordinate), "enroll_id": enroll.id, "polyline": enroll.polyline, "learner_name": learner_name,"accessible_resources":enroll.accessible_resources }


def calculate_all_module_centroids(id):
    # Fetch all resources from the database
    resources = Resource.query.filter_by(course_id=id)

    # Dictionary to group resources by module_id and module name
    module_polylines = defaultdict(lambda: {"polylines": [], "module": None})

    # Group polylines by module_id and capture module name
    for resource in resources:
        if resource.polyline:  # Only add resources with polylines
            module_polylines[resource.module_id]["polylines"].append(
                resource.polyline)
            module_polylines[resource.module_id]["module"] = resource.module

    # Create a list of objects (dictionaries) containing module_id, module name, and polyline
    module_data_list = []
    for module_id, module_data in module_polylines.items():
        polylines = module_data["polylines"]
        module = module_data["module"]

        if polylines:  # Only calculate if there are polylines
            centroid = calculate_centroid(polylines)
            feature_length = len(centroid)
            (tlen, theta) = rad_plot_axes(feature_length, 1, 1)
            centroid_list = rad_plot_poly(
                feature_length, [centroid], tlen, theta)
            print(f'centroid list is {centroid_list}')
            x_coordinate = centroid_list[0][0]
            y_coordinate = centroid_list[0][1]
            print(f'module x is {x_coordinate} module y is {y_coordinate}')
        else:
            centroid = None
            x_coordinate = 0
            y_coordinate = 0

        # Append each module's data as a dictionary to the list
        module_data_list.append({
            "module_id": module_id,
            "module": module,
            "x": float(x_coordinate),
            "y": float(y_coordinate),
        })

    return module_data_list


def enrolled_learners_by_course(course_id):
    # Query all enrollments for the given course
    enrollments = Enroll.query.filter_by(course_id=course_id).all()

    if not enrollments:
        return jsonify({"error": "enrollments not found"}), 404

    # Prepare a list to hold enrollment details
    enroll_data = []

    for enroll in enrollments:
        # Extract the learner's name from the relationship
        learner_name = enroll.learner.name if enroll.learner else "Unknown"

        # Add each enroll's details to the list
        enroll_data.append({
            "x_coordinate": float(enroll.x_coordinate),
            "y_coordinate": float(enroll.y_coordinate),
            "enroll_id": enroll.id,
            "polyline": enroll.polyline,
            "learner_name": learner_name
        })

    # Return the list of enrollments
    return jsonify(enroll_data)


def learner_course_unenrolled(id):
    learner = Learner.query.get(id)
    if not learner:
        return jsonify({"error": "Learner not found"}), 404

    unenrolled_courses = []
    enrolled_course_ids = []

    for enrollment in learner.enrollments:
        course = Course.query.get(enrollment.course_id)
        if course:
            enrolled_course_ids.append(course.id)

    result = Course.query.filter(Course.id.notin_(enrolled_course_ids)).all()

    for course in result:
        if course:
            unenrolled_courses.append({
                'course_id': course.id,
                'course_name': course.name,
                'course_description': course.description
            })
    return jsonify(unenrolled_courses)

# Function to generate a polyline and coordinates for a quiz question


def generate_question_polyline(quiz_id, question_text, course_id):
    # Step 1: Extract keywords from the question text
    (keywords_list, weight_list) = create_keywords_list([question_text])

    # Step 2: Create embeddings for the question keywords
    question_embeddings = create_resource_embeddings(keywords_list)

    # Step 3: Fetch topic embeddings for the course
    with app.app_context():
        topic_embedding = db.session.query(
            Topic.embedding).filter_by(course_id=course_id).all()
        if not topic_embedding:
            raise IndexError("No topic embeddings found for the course.")

    # Step 4: Create polylines by comparing question embeddings with course/topic embeddings
    question_polylines = create_resource_polylines(
        topic_embedding, question_embeddings, 8)

    # Step 5: Generate centroid coordinates for the question
    feature_length = len(question_polylines[0])
    (tlen, theta) = rad_plot_axes(feature_length, 1, 1)
    centroid_list = rad_plot_poly(
        feature_length, [question_polylines[0]], tlen, theta)

    # Return the polyline and coordinates
    return {
        "polyline": convert_to_lists(question_polylines[0]),
        "x_coordinate": centroid_list[0][0],
        "y_coordinate": centroid_list[0][1]
    }


# Function to add a new quiz
def add_quiz(title, description, total_questions):
    new_quiz = Quiz(
        title=title,
        description=description,
        total_questions=total_questions
    )
    with app.app_context():
        db.session.add(new_quiz)
        db.session.commit()
        quiz_dict = new_quiz.to_dict()
    return quiz_dict['id']

# Function to add a question to a quiz with polyline and coordinate generation


def add_question(quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, course_id):
    # Generate polyline and coordinates for the question
    polyline_data = generate_question_polyline(
        quiz_id, question_text, course_id)

    # Add the question to the database
    new_question = Question(
        quiz_id=quiz_id,
        question_text=question_text,
        option_a=option_a,
        option_b=option_b,
        option_c=option_c,
        option_d=option_d,
        correct_answer=correct_answer,
        polyline=polyline_data["polyline"],
    )
    # print(f'Qn : x = {polyline_data['x_coordinate']}, y = {polyline_data['y_coordinate']}')
    # (0.373174196, 0.373522988) = (x, y) for Quiz

    with app.app_context():
        db.session.add(new_question)
        db.session.commit()
        new_quiz_dict = new_question.to_dict()
    return new_quiz_dict
