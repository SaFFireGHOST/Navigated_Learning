from init import app, DBcreated
import pandas as pd
from flask import jsonify, request
from repository import create_Course, update_position, login, learner_course_enrolled,generate_data,learner_course_unenrolled,enrolled_learner_data,enrolled_learners_by_course,calculate_all_module_centroids,add_enroll
import modelsRoutes
# Read data from Excel file
excel_file = 'DM_Resource_Plot.xlsx'
df = pd.read_excel(excel_file)
excel_file = 'DM_learner_plot.xlsx'
df_learner = pd.read_excel(excel_file)

# Assuming your Excel file has columns 'x', 'y', and 'video_url'
scatterplot_data = df[['index', 'name', 'x',
                       'y', 'video_url', 'module','module_id','submodule_id']].to_dict(orient='records')

# Convert the scatterplot_data into a DataFrame
df_scatter = pd.DataFrame(scatterplot_data)

# Group by 'module_id' and calculate the mean of 'x' and 'y'
module_data_df = df_scatter.groupby('module_id').agg({'x': 'mean', 'y': 'mean','module': 'first' }).reset_index()

# Convert the result to a list of dictionaries with 'module_id', 'x', and 'y'
module_data = module_data_df.to_dict(orient='records')
topic_data_df=pd.read_excel('DM/DM_topics.xlsx')
topic_data=topic_data_df[['name','description']].to_dict(orient='records')


learner_data = df_learner[['index', 'resource_name',
                           'x', 'y', 'description']].to_dict(orient='records')

if DBcreated:
    # print("creating the course")
    # create_Course("Discreate Mathematics",
    #               "this is the description of DM", None, None)
    print("Generating Data")
    generate_data()


@app.route('/data')
def get_data():
    # print(cursor, dir(cursor))
    # print(scatterplot_data)
    return jsonify(scatterplot_data)

@app.route('/moduleData/<int:id>')
def get_module_data(id):
    print(module_data)
    moudle=calculate_all_module_centroids(id)
    print(f'moudle is {moudle}')
    # print(module_data)
    return jsonify(moudle)

@app.route('/topicData')
def get_topic_data():
    # print(topic_data)
    return jsonify(topic_data)


@app.route('/new_positions')
def get_new_data():
    return jsonify(learner_data)


@app.route("/login", methods=['POST'])
def login_user():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    print(password, username)
    return login(username, password)


@app.route("/enrolledCourses/<int:id>", methods=['GET'])
def get_enrolled_course(id):
    return learner_course_enrolled(id)



@app.route("/enrolledLearner/<int:id>/<int:id2>", methods=['GET'])
def get_enrolled_learner(id,id2):
    return enrolled_learner_data(id,id2)

@app.route("/enrolledLearnersByCourse/<int:id>", methods=['GET'])
def get_enrolled_learners(id):
    return enrolled_learners_by_course(id)

@app.route("/recomCourses/<int:id>", methods=['GET'])
def get_recom_course(id):
    return learner_course_unenrolled(id)

@app.route("/submitsummary", methods=['POST'])
def get_new_postion():
    data = request.get_json()
    summary = data["summary"]
    enrollId = data["enroll_id"]
    courseId = data["course_id"]
    pos = update_position(summary, enrollId, courseId)
    return jsonify(pos), 200

@app.route('/enrolls', methods=['POST'])
def create_enroll():
    data = request.get_json()
    learner_id=data['learner_id']
    course_id=data['course_id']
    # new_enroll = Enroll(
    #     learner_id=data['learner_id'],
    #     course_id=data['course_id'],
    #     # x_coordinate=data['x_coordinate'],
    #     # y_coordinate=data['y_coordinate'],
    #     polyline=data['polyline']
    # )
    # db.session.add(new_enroll)
    # db.session.commit()
    return add_enroll(learner_id,course_id)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
