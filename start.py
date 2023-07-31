from io import UnsupportedOperation
from flask import Flask, render_template, request, redirect, flash, url_for, session, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from flask_login import  UserMixin, LoginManager, login_user,login_required, logout_user
from sqlite3 import dbapi2
import secrets
# from flask_cors import CORS
import os
import ssl
import shutil




app = Flask(__name__)
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_COOKIE_SECURE"] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['CORS_HEADERS'] = 'Content-Type'
# cors = CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = 'jhgcur3ntu98rht56curch566rtrt'
app.config['DEBAG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


login_manager = LoginManager(app)
db = SQLAlchemy(app)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    mail_user = db.Column(db.String(30), nullable=False, unique=True)
    password = db.Column(db.String(300), nullable=False)
    role = db.Column(db.String(300), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    def __repr__(self):
        return '<User %r>' % self.id

# with app.app_context():
#     db.create_all()

@app.route('/')
def login():
    return render_template('index.html')

@app.route('/welcome')
@login_required
def welcome():
    response = {'success': True, 'message': 'Login yes'}
    return jsonify(response)


@app.route('/data-user')
@login_required
def data_user():
    all_users = User.query.all()
    users_data = []
    for user in all_users:
        user_data = {
            'success': True,
            'message': 'Login yes',
            'id': user.id,
            'mail_user': user.mail_user,
            'role': user.role,
            'date': user.date.strftime('%Y-%m-%d %H:%M:%S')
        }
        users_data.append(user_data)

    return jsonify(users_data)




@app.route('/admin', methods=['POST'])
def admin():
    if request.method == "POST" :
        data = request.get_json()
        mail_user = data.get('email')
        password = data.get('password')
        renainma = False
        # aut = secrets.token_urlsafe(8)
        mail_user = mail_user.lower()
        user = User.query.filter_by(mail_user = mail_user).first()
        if len(mail_user)>3 and len(password)>7:
            if not user:
                response = {'success': False, 'message': 'Not user'}
                return jsonify(response)

            else:
                # Проверяем пароль
                if check_password_hash(user.password, password):
                    login_user(user)
                    response = {'success': True, 'message': 'Login successful'}
                    return jsonify(response)
                else:
                    response = {'success': False, 'message': 'Invalid password'}
                    return jsonify(response)
        else:
            response = {'success': False, 'message':'Data entered incorrectly'}
            return jsonify(response)



@app.route('/register', methods=['POST'])
def registr():
    if request.method == "POST" :
        data = request.get_json()
        mail_user = data.get('email')
        password = data.get('password')
        # renainma = False
        # aut = secrets.token_urlsafe(8)
        mail_user = mail_user.lower()
        user = User.query.filter_by(mail_user = mail_user).first()
        if len(mail_user) >3 and len(password)>7:
                # Шифруем пароль и вносим в базу
                hash = generate_password_hash(password)
                user_new = User(mail_user=mail_user,  password=hash, role="Admin")
                if not user:
                    # сохранием изменение
                        db.session.add(user_new)
                        db.session.commit()
                        # логирование 
                        login_user(user_new)
                        response = {'success': True, 'message': 'Login successful'}
                        return jsonify(response)
                else:
                    response = {'success': False, 'message': 'Yes user'}
                    return jsonify(response)
        else:
            response = {'success': False, 'message':'Data entered incorrectly'}
            return jsonify(response)

@app.route('/logout', methods=['POST', 'GET'])
@login_required
def logout():
    # Удаляем сесию выходим из акаунта
    logout_user()
    response = {'success': False, 'message': 'Not login'}
    return jsonify(response)



@login_manager.user_loader
def load_user(user):
    # Выполняем вход 
    return User.query.get(user)


#source_certpath = 'etc/letsencrypt/live/gabreil666.asuscomm.com/fullchain.pem'
#source_keypath = 'etc/letsencrypt/live/gabreil666.asuscomm.com/privkey.pem'
#target_directory = '/home/pi/web_video/'  # Замените на путь к целевой папке

# Копируем файлы в целевую папку
#shutil.copy(source_certpath, target_directory)
#shutil.copy(source_keypath, target_directory)


#certpath = 'fullchain.pem'
#keypath = 'privkey.pem'
# root_directory = '/home/pi/web_video/'  # Замените на путь к вашей корневой папке

#context = (certpath, keypath)
# os.chdir(root_directory)  # Устанавливаем корневую папку сервера

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8443)