from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
import string
import random

app = Flask(__name__, static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urls.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(500), nullable=False)
    short_url = db.Column(db.String(10), unique=True, nullable=False)

    def __init__(self, original_url, short_url):
        self.original_url = original_url
        self.short_url = short_url

def initialize_database():
    with app.app_context():
        db.create_all()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        original_url = request.form['url']
        
        # Check if URL already exists
        existing_url = Url.query.filter_by(original_url=original_url).first()
        
        if existing_url:
            short_url = existing_url.short_url
        else:
            # Generate new short URL and ensure it's unique
            while True:
                short_url = generate_short_url()
                # Check if short URL already exists in database
                if not Url.query.filter_by(short_url=short_url).first():
                    break
            
            # Create and add new URL to database
            new_url = Url(original_url=original_url, short_url=short_url)
            db.session.add(new_url)
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return "Error saving URL to database", 500
        
        full_short_url = request.host_url + short_url
        return render_template('index.html', short_url=full_short_url)
    
    return render_template('index.html')

@app.route('/<short_url>')
def redirect_to_original(short_url):
    url = Url.query.filter_by(short_url=short_url).first_or_404()
    return redirect(url.original_url)

def generate_short_url():
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(6))

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)