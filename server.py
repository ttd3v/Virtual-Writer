from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import smtplib,secrets,json
import graphene as graphql

app = Flask(__name__)
app.secret_key = b'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
db = SQLAlchemy(app)
migrate = Migrate(app,db)
email_author = "theogamer560yt@gmail.com"
email_password = "cted fics ohws fjxj"

def getAuthKey():
    key = ''
    keywords = list("qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890")
    for _ in range(100):
        key += secrets.choice(keywords)
    return key


class user(db.Model):
    email = db.Column(db.String(320),nullable=False)
    username = db.Column(db.String(25),nullable=False)
    about = db.Column(db.String(200),nullable=False,default='hello world!')
    password = db.Column(db.Text,nullable=False)
    id = db.Column(db.Integer,nullable=False,primary_key=True)
    AuthKey = db.Column(db.String(100),nullable=False,default=getAuthKey)

class Q_UserType(graphql.ObjectType):
    username = graphql.String()
    about = graphql.String()
class rename(graphql.Mutation):
    class Arguments:
        auth_key = graphql.String(required=True)
        username = graphql.String(required=True)
    ok = graphql.Boolean()
    def mutate(self,info,auth_key,username):
        user_ = user.query.filter_by(AuthKey=auth_key).first()
        if user_:
            ok = False
            try:
                if username is not None:
                    user_.username = username
                db.session.commit()
                ok = True
            except Exception as error:
                print(error)
                ok = False
                db.session.rollback()
        return ok
class rewrite_about(graphql.Mutation):
    class Arguments:
        auth_key = graphql.String(required=True)
        about = graphql.String(required=True)
    ok = graphql.Boolean()
    def mutate(self,info,auth_key,about):
        user_ = user.query.filter_by(AuthKey=auth_key).first()
        ok = False
        if user_:
            try:
                if about is not None:
                    user_.about = about
                db.session.commit()
                ok = True
            except Exception as error:
                print(error)
                ok = False
                db.session.rollback()
        return ok
class Mutations(graphql.ObjectType):
    change_name = rename.Field()
    change_about = rewrite_about.Field()
class Query(graphql.ObjectType):
    userProfile = graphql.Field(Q_UserType,auth_key=graphql.String(required=True))

    def resolve_userProfile(self,info,auth_key):
        try:
            user_get = user.query.filter_by(AuthKey=auth_key).first()
            print(auth_key)
            if user_get is not None:
                qut = Q_UserType(
                    username=user_get.username,
                    about=user_get.about
                )
                print(qut)
                return qut
            else:
                return Q_UserType(
                    username="none",
                    about="none"
                )
        except Exception as error:
            print(error) 
            return Q_UserType(
                username="none",
                about="none"
            )



schema = graphql.Schema(query=Query,mutation=Mutations)

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
            if not user.query.filter_by(email=data['email']).first():
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
                    db.session.commit()
                    print("A NEW USER HAS BEEN CREATED")
                except Exception:
                    print(Exception)
                    db.session.rollback()
        except Exception as err:
            print(err)
    
    return return_data

@app.route('/login',methods=['POST'])
def login_user():
    return_data = {
        'ok':False,
        'authenticated':'false',
        'username':'',
        'about':'',
        'auth_key':'',
    }
    if request.data:
        try:
            data = json.loads(request.data)
            if 'email' in data and 'password' in data:
                query = user.query.filter_by(email=data['email'], password=data['password'] )
                
                if query.first():
                    user_queried = query.first()
                    return_data['auth_key'] = user_queried.AuthKey
                    return_data['about'] = user_queried.about
                    return_data['username'] = user_queried.username
                    return_data['authenticated'] = 'true'
                    return_data['ok'] = True
                else:
                    return return_data
        except Exception as error:
            print(error)
            return {
                'ok':False,
                'authenticated':'false',
                'username':'',
                'about':'',
                'auth_key':'',
            }
    return return_data

@app.route('/account',methods=['POST'])
def account_info():
    return_data = {}
    if request.data and type(request.data) == bytes:
        data = request.data
        schema_result = schema.execute(data.decode('utf-8'))
        print(schema_result)
        if schema_result.data:
            return_data = schema_result.data
    return return_data

@app.route('/account_mutate',methods=['POST'])
def account_mutate():
    if request.data and type(request.data) == bytes:
        data = request.data
        print("mutate >>",data)
        result = schema.execute(data.decode('utf-8'))
        print(result)
    return {}
if __name__ == "__main__":
    app.run(host='127.0.0.1',port=5000)