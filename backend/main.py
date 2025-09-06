import os
from typing import List, Optional

import pymongo
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr

# Cargar variables de entorno desde .env
load_dotenv()

# --- Configuración de la Aplicación FastAPI ---
app = FastAPI(
    title="Teachers API",
    description="API para gestionar perfiles de profesores.",
    version="1.0.0"
)

# --- Middleware de CORS ---
# Permitir solicitudes desde el frontend de Next.js
origins = [
    "http://localhost:3000",  # Asumiendo que el frontend corre en el puerto 3000
    "http://localhost:9002", # Puerto de desarrollo de Next.js especificado en package.json
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Conexión a la Base de Datos MongoDB ---
# Usar la variable de entorno o un valor predeterminado para desarrollo local
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/teachers_db")
client = None
db = None

if MONGO_URI:
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client.get_database("teachers_db")
        # Ping para verificar la conexión
        client.admin.command('ping')
        print("✅ Conexión a MongoDB exitosa.")
    except pymongo.errors.ConnectionFailure as e:
        print(f"Error al conectar a MongoDB: {e}")
        client = None
        db = None
else:
    print("⚠️ La variable de entorno MONGO_URI no está definida. La API funcionará sin base de datos.")


# --- Modelos de Datos Pydantic ---
class TeacherSchema(BaseModel):
    nombre_completo: str = Field(..., min_length=3)
    email: EmailStr
    curso: str = Field(..., min_length=1)
    asignaturas: List[str] = Field(..., min_length=1)
    colegios: List[str] = Field(..., min_length=1)

    class Config:
        json_schema_extra = {
            "example": {
                "nombre_completo": "Ana Pérez",
                "email": "ana.perez@example.com",
                "curso": "3º Medio",
                "asignaturas": ["Matemáticas", "Física"],
                "colegios": ["Colegio Cervantes"]
            }
        }

class TeacherDB(TeacherSchema):
    id: str = Field(alias="_id")


# --- Endpoints de la API ---
@app.get("/", tags=["Root"])
def read_root():
    """Endpoint raíz para verificar que la API está funcionando."""
    return {"message": "Bienvenido a la API de Profesores"}

# --- Endpoints CRUD ---

@app.post("/teachers", response_model=TeacherDB, status_code=status.HTTP_201_CREATED, tags=["Teachers"])
def create_teacher(teacher: TeacherSchema):
    """
    Crea un nuevo profesor en la base de datos.
    """
    if not db:
        raise HTTPException(status_code=503, detail="La base de datos no está disponible.")

    teacher_dict = teacher.model_dump()
    result = db.teachers.insert_one(teacher_dict)

    # Construir la respuesta para que coincida con el modelo TeacherDB
    created_teacher = db.teachers.find_one({"_id": result.inserted_id})
    if created_teacher:
        created_teacher['id'] = str(created_teacher['_id'])
        return created_teacher

    raise HTTPException(status_code=500, detail="No se pudo crear el profesor.")


@app.get("/teachers", response_model=List[TeacherDB], tags=["Teachers"])
def get_teachers():
    """
    Obtiene la lista de todos los profesores.
    """
    if not db:
        raise HTTPException(status_code=503, detail="La base de datos no está disponible.")

    teachers = []
    for teacher in db.teachers.find():
        teacher['id'] = str(teacher['_id'])
        teachers.append(teacher)
    return teachers


@app.get("/teachers/{id}", response_model=TeacherDB, tags=["Teachers"])
def get_teacher(id: str):
    """
    Obtiene un profesor por su ID.
    """
    if not db:
        raise HTTPException(status_code=503, detail="La base de datos no está disponible.")

    from bson import ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail=f"El ID '{id}' no es válido.")

    teacher = db.teachers.find_one({"_id": ObjectId(id)})
    if teacher:
        teacher['id'] = str(teacher['_id'])
        return teacher

    raise HTTPException(status_code=404, detail=f"Profesor con ID '{id}' no encontrado.")


@app.put("/teachers/{id}", response_model=TeacherDB, tags=["Teachers"])
def update_teacher(id: str, teacher_update: TeacherSchema):
    """
    Actualiza la información de un profesor existente.
    """
    if not db:
        raise HTTPException(status_code=503, detail="La base de datos no está disponible.")

    from bson import ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail=f"El ID '{id}' no es válido.")

    update_data = teacher_update.model_dump(exclude_unset=True)

    result = db.teachers.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=f"Profesor con ID '{id}' no encontrado.")

    updated_teacher = db.teachers.find_one({"_id": ObjectId(id)})
    if updated_teacher:
        updated_teacher['id'] = str(updated_teacher['_id'])
        return updated_teacher

    raise HTTPException(status_code=500, detail="No se pudo actualizar el profesor.")


@app.delete("/teachers/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Teachers"])
def delete_teacher(id: str):
    """
    Elimina un profesor de la base de datos.
    """
    if not db:
        raise HTTPException(status_code=503, detail="La base de datos no está disponible.")

    from bson import ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail=f"El ID '{id}' no es válido.")

    result = db.teachers.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Profesor con ID '{id}' no encontrado.")

    return
