from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
import secrets

app = Flask(__name__)
app.secret_key = b'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

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
    data = request.data
    if data and 'username' in data and 'email' in data and 'password' in data:
        try:
            USER = user(email=data['email'],username=data['username'],password=data['password'])
            return_data['ok'] = True
            return_data['auth_key'] = USER.AuthKey
            db.session.add(USER)
            print("A NEW USER HAS BEEN CREATED")
        except Exception:
            print(Exception)
            db.session.rollback()
    return return_data

if __name__ == "__main__":
    app.run(host='127.0.0.1',port=5000)