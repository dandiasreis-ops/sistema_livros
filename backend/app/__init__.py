from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os


load_dotenv()


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Rota principal
    @app.route('/')
    def home():
        return {"mensagem": "API do Sistema de Livros funcionando!"}

    from app.routes.usuario_routes import usuario_bp
    from app.routes.livro_routes import livro_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.filho_routes import filho_bp

    app.register_blueprint(usuario_bp)
    app.register_blueprint(livro_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(filho_bp)

    return app