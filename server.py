from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
import smtplib
import secrets,json
from flask_cors import CORS
app = Flask(__name__)
app.secret_key = b'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
db = SQLAlchemy(app)
email_author = "theogamer560yt@gmail.com"
email_password = "cted fics ohws fjxj"

def getAuthKey():
    key = ''
    keywords = list("qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$*()<>,._-+=")
    for _ in range(100):
        key += secrets.choice(keywords)
    return key


class user(db.Model):
    email = db.Column(db.String(320),nullable=False)
    username = db.Column(db.String(25),nullable=False)
    password = db.Column(db.Text,nullable=False)
    id = db.Column(db.Integer,nullable=False,primary_key=True)
    AuthKey = db.Column(db.String(100),nullable=False,default=getAuthKey)

with app.app_context():
    db.create_all()

@app.route('/newuser',methods=['POST'])
def new_user():
    return_data = {
        'ok':False,
        'auth_key':''
    }
    data = json.loads(request.data)
    if data and 'username' in data and 'email' in data and 'password' in data:
        TO = [data['email']]
        subject = "Hello!"
        text = 'Hi, welcome to VirtualWriter!'
        message = """\
        From: %s
        To: %s
        Subject: %s

        %s
        """ % (email_author, ", ".join(TO), subject, text)
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(email_author,email_password)
            server.sendmail(email_author,TO,message)
            server.quit()
            try:
                USER = user(email=data['email'],username=data['username'],password=data['password'])
                return_data['ok'] = True
                return_data['auth_key'] = USER.AuthKey
                return_data['username'] = USER.username
                return_data['age'] = 0
                db.session.add(USER)
                print("A NEW USER HAS BEEN CREATED")
            except Exception:
                print(Exception)
                db.session.rollback()
        except Exception as err:
            print(err)
    
    return return_data

if __name__ == "__main__":
    app.run(host='127.0.0.1',port=5000)