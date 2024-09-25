
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask import Flask

print("this should run only once")
mysql: MySQL = None
app: Flask = None
DBcreated: bool = False


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    CORS(app)

    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = '1234'
    app.config['MYSQL_PASSWORD'] = '1234'
    # Optionally specify the database name if it exists
    # app.config['MYSQL_DB'] = 'navigated_learning'

    global mysql
    mysql = MySQL(app)

    return app, mysql


def is_database_present(mysql):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SHOW DATABASES LIKE 'navigated_learning'")
        result = cursor.fetchone()
        cursor.close()
        return result is not None
    except Exception as e:
        print(f"Error checking database presence: {e}")
        return False


def create_database(mysql):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS navigated_learning")
        cursor.close()
        print("Database created")
    except Exception as e:
        print(f"Error creating database: {e}")


def create_tables(mysql):
    try:
        cursor = mysql.connection.cursor()
        # Add SQL statements to create tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Resources (
                id INTEGER PRIMARY KEY,
                name VARCHAR(25),
                description JSON,
                keywords JSON,
                polyline JSON,
                x_coordinate DECIMAL,
                y_coordinate DECIMAL,
                course_id INTEGER,
                module_id INTEGER,
                submodule_id INTEGER,
                type INTEGER,
                embedding JSON
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Topics (
                id INTEGER PRIMARY KEY,
                name VARCHAR(250),
                description JSON,
                keywords JSON,
                polyline JSON,
                x_coordinate decimal,
                y_coordinate decimal,
                course_id INTEGER,
                embedding json
            )
        """)

        cursor.execute(""" 
            CREATE TABLE IF NOT EXISTS Learners (
                id INTEGER PRIMARY KEY,
                registered_date TIMESTAMP,
                name VARCHAR(250),
                cgpa VARCHAR(2),
                username VARCHAR(50),
                password VARCHAR(50)
            );
        """)

        cursor.execute(""" 
            CREATE TABLE IF NOT EXISTS Courses (
                id INTEGER PRIMARY KEY,
                name VARCHAR(250),
                description JSON
            );
        """)

        cursor.execute(""" 
            CREATE TABLE IF NOT EXISTS Activity (
                id INTEGER PRIMARY KEY,
                time DATETIME,
                type_id INTEGER,
                enroll_id INTEGER,
                resource_id INTEGER
            );
        """)

        cursor.execute(""" 
            CREATE TABLE IF NOT EXISTS Enrolls (
                id INTEGER PRIMARY KEY,
                learner_id INTEGER,
                course_id INTEGER,
                x_coordinate DECIMAL,
                y_coordinate DECIMAL,
                polyline JSON
            );
        """)

        cursor.execute(""" 
            CREATE TABLE IF NOT EXISTS Contribution (
                id INTEGER PRIMARY KEY,
                enroll_id INTEGER,
                submitted_on DATETIME,
                file_path VARCHAR(1024),
                description JSON,
                prev_polyline JSON,
                polyline JSON,
                x_coordinate DECIMAL,
                y_coordinate DECIMAL,
                embedding JSON
            );
        """)

        cursor.execute("""
            ALTER TABLE Enrolls
            ADD CONSTRAINT fk_enrolls_learner
            FOREIGN KEY (learner_id) REFERENCES Learners(id)
            ON DELETE CASCADE ON UPDATE CASCADE;  
        """)

        cursor.execute("""
            ALTER TABLE Topics
            ADD CONSTRAINT fk_topics_course
            FOREIGN KEY (course_id) REFERENCES Courses(id)
            ON DELETE CASCADE ON UPDATE CASCADE;  
        """)

        cursor.execute("""  
            ALTER TABLE Enrolls
            ADD CONSTRAINT fk_enrolls_course
            FOREIGN KEY (course_id) REFERENCES Courses(id)
            ON DELETE CASCADE ON UPDATE CASCADE; 
        """)

        cursor.execute("""
            ALTER TABLE Resources
            ADD CONSTRAINT fk_resource_course
            FOREIGN KEY (course_id) REFERENCES Courses(id)
            ON DELETE CASCADE ON UPDATE CASCADE;
        """)

        # # add topic id foreign key
        # cursor.execute("""
        #     ALTER TABLE Resources
        #     ADD CONSTRAINT fk_resource_topic
        #     FOREIGN KEY (topic_id) REFERENCES Topics(id)
        #     ON DELETE CASCADE ON UPDATE CASCADE;
        # """)

        cursor.execute(""" 
            ALTER TABLE Activity
            ADD CONSTRAINT fk_activity_enroll
            FOREIGN KEY (enroll_id) REFERENCES Enrolls(id)
            ON DELETE CASCADE ON UPDATE CASCADE;  
        """)

        cursor.execute(""" 
            ALTER TABLE Activity
            ADD CONSTRAINT fk_activity_resource
            FOREIGN KEY (resource_id) REFERENCES Resources(id)
            ON DELETE CASCADE ON UPDATE CASCADE;  
        """)

        cursor.execute(""" 
            ALTER TABLE Contribution
            ADD CONSTRAINT fk_contribution_enroll
            FOREIGN KEY (enroll_id) REFERENCES Enrolls(id)
            ON DELETE CASCADE ON UPDATE CASCADE;  
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Quiz (
            quiz_id INTEGER PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            total_questions INTEGER NOT NULL
            );
                       
            INSERT INTO Quiz (title, description, total_questions) VALUES ('Introduction to Discrete Mathematics', 'A basic quiz on discrete mathematics concepts.', 5);
        """)

        cursor.execute("""
                CREATE TABLE IF NOT EXISTS Questions (
                question_id INTEGER PRIMARY KEY AUTO_INCREMENT,
                quiz_id INTEGER,
                question_text TEXT NOT NULL,
                option_a VARCHAR(255),
                option_b VARCHAR(255),
                option_c VARCHAR(255),
                option_d VARCHAR(255),
                correct_answer CHAR(1),
                Polyline VARCHAR(255),
                FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id)
            );
                       
                SET @quiz_id = LAST_INSERT_ID();


                INSERT INTO Questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, Polyline) VALUES 
                (@quiz_id, 'What is the principle of mathematical induction?', 'A) A method of proving the truth of an infinite number of statements.', 'B) A method for solving differential equations.', 'C) A method of finding the minimum value of a function.', 'D) A technique for matrix multiplication.', 'A', NULL),
                (@quiz_id, 'What is the Pigeonhole Principle?', 'A) If more items are put into fewer containers than there are items, then at least one container must contain more than one item.', 'B) A principle used in calculus for finding areas under curves.', 'C) A principle used in geometry for calculating angles in polygons.', 'D) A theorem in probability theory for finding expected values.', 'A', NULL),
                (@quiz_id, 'In graph theory, what is a tree?', 'A) A connected graph with no cycles.', 'B) A graph with exactly one cycle.', 'C) A fully connected graph with weighted edges.', 'D) A graph where all vertices are connected by exactly two edges.', 'A', NULL),
                (@quiz_id, 'What is a permutation?', 'A) An arrangement of all or part of a set of objects.', 'B) A subset of a set of objects.', 'C) A combination of objects where order does not matter.', 'D) A sequence of numbers where each number is the sum of the previous two.', 'A', NULL),
                (@quiz_id, 'What is the principle of inclusion-exclusion?', 'A) A formula used to count the number of elements in the union of several sets.', 'B) A technique for finding eigenvalues of matrices.', 'C) A method for solving linear equations.', 'D) A theorem for calculating the area of geometric shapes.', 'A', NULL);
        """) 

        cursor.execute("""
                CREATE TABLE IF NOT EXISTS User_quiz (
                user_quiz_id INTEGER PRIMARY KEY AUTO_INCREMENT,
                user_id INTEGER,
                quiz_id INTEGER,
                score DECIMAL(5, 2),
                status ENUM('completed', 'in-progress') NOT NULL,
                attempt_date DATETIME,
                FOREIGN KEY (user_id) REFERENCES Users(user_id),  -- Assuming there is a Users table
                FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id)
            );

        """) 

        cursor.close()
        print("Tables created or already exist.")

    except Exception as e:
        print(f"Error creating tables: {e}")


def main():
    global app, mysql, DBcreated
    app, mysql = create_app()

    with app.app_context():
        if is_database_present(mysql):
            print("Database is present.")
            app.config['MYSQL_DB'] = 'navigated_learning'
            cursor = mysql.connection.cursor()
            cursor.execute("use navigated_learning")
        else:
            print("Database is not present.")
            DBcreated = True
            create_database(mysql)
            app.config['MYSQL_DB'] = 'navigated_learning'
            cursor = mysql.connection.cursor()
            cursor.execute("use navigated_learning")


main()
