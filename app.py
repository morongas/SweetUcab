from asyncio.windows_events import NULL
from cgi import print_directory
from optparse import Values
from flask import Flask, request, jsonify, send_file
from psycopg2 import connect, extras
import json

app = Flask(__name__)
host = 'localhost'
port = 5432
dbname = 'entrega'
username = 'postgres'
password = 'cjmd140102'

def get_connection():
    conn = connect(host=host,port=port,dbname=dbname,user=username,password=password)
    return conn


"""------------------------------USUARIO--------------------------"""

@app.get('/api/users')
def get_users():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM usuario')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)

@app.post('/api/users')
def create_user():
    new_user =  request.get_json()

    U_Nombre = new_user['U_Nombre']
    U_Tipo = new_user['U_Tipo']
    U_Contrasena = new_user['U_Contrasena']
    Rol_Clave =new_user['Rol_Clave']
    Em_Clave =new_user['Em_Clave']
    CN_Clave =new_user['CN_Clave']
    CJ_Clave =new_user['CJ_Clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO usuario (U_Nombre, U_Tipo, U_Contrasena,Rol_Clave,Em_Clave,CN_Clave,CJ_Clave) VALUES (%s, %s, %s,%s, %s, %s,%s) RETURNING *', (U_Nombre, U_Tipo, U_Contrasena,Rol_Clave,Em_Clave,CN_Clave,CJ_Clave))
    user = cur.fetchone();
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(user)


@app.delete('/api/users/<id>')
def delete_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM usuario WHERE u_clave= %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user)


@app.put('/api/users/<id>')
def update_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_user = request.get_json() 

    U_Nombre = new_user['U_Nombre']
    U_Tipo = new_user['U_Tipo']
    U_Contrasena = new_user['U_Contrasena']
    Rol_Clave =new_user['Rol_Clave']
    Em_Clave =new_user['Em_Clave']
    CN_Clave =new_user['CN_Clave']
    CJ_Clave =new_user['CJ_Clave']

    cur.execute('UPDATE usuario SET U_Nombre = %s, U_Tipo = %s, U_Contrasena = %s, Rol_Clave =%s,Em_Clave=%s,CN_Clave=%s,CJ_Clave=%s WHERE U_Clave = %s RETURNING *', (U_Nombre, U_Tipo, U_Contrasena,Rol_Clave,Em_Clave,CN_Clave,CJ_Clave, id))
    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify(upadate_user)


@app.get('/api/users/<id>')
def get_user(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM usuario WHERE u_clave = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Funcion que me devuelve el usuario por el nombre
@app.get('/api/users/i/<id>')
def get_user2(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM usuario WHERE u_nombre = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)
"""------------------------------FORMA DE PAGO--------------------------"""

@app.get('/static/forma_de_pago')
def get_fps():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM forma_de_pago')
    FormaDepago = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(FormaDepago)

@app.post('/api/forma_de_pago')
def create_fp():
    new_fp =  request.get_json()

    FP_Titular = new_fp['FP_Titular']
    FP_TipoDeTarjeta = new_fp['FP_TipoDeTarjeta']
    FP_NumTarjeta = new_fp['FP_NumTarjetaCred']
    FP_codigo_seguridad = new_fp['FP_CodigoSeg']
    FP_NumTarjetaDeb = new_fp['FP_NumTarjetaDeb']
    FP_clave = new_fp['FP_ClaveTarjeta']
    FP_Email= new_fp['FP_Email']
    FP_Telefono = new_fp['FP_Telefono']
    FP_EmailP= new_fp['FP_Email_PayPal']
    FP_Cantidad = new_fp['FP_Cantidad']
    FP_Tipo = new_fp['Tipo_FP']
    CN_Clave =new_fp['CN_Clave']
    CJ_Clave =new_fp['CJ_Clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO forma_de_pago (FP_Titular,FP_TipoDeTarjeta,FP_NumTarjetaCred,FP_CodigoSeg,FP_NumTarjetaDeb,FP_ClaveTarjeta,FP_Email,FP_Telefono,FP_Email_PayPal,FP_Cantidad,Tipo_FP,CN_Clave,CJ_Clave) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *', (FP_Titular,FP_TipoDeTarjeta,FP_NumTarjeta,FP_codigo_seguridad,FP_NumTarjetaDeb,FP_clave,FP_Email,FP_Telefono,FP_EmailP,FP_Cantidad,FP_Tipo,CN_Clave,CJ_Clave))
    fp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(fp)


@app.delete('/api/forma_de_pago/<id>')
def delete_fp(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM forma_de_pago WHERE id = %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()
    cur.closed()
    conn.close()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user)

@app.put('/api/forma_de_pago/<id>')
def update_fp(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_fp = request.get_json()   
    FP_Titular = new_fp['FP_Titular']
    FP_TipoDeTarjeta = new_fp['FP_TipoDeTarjeta']
    FP_NumTarjeta = new_fp['FP_NumTarjetaCred']
    FP_codigo_seguridad = new_fp['FP_CodigoSeg']
    FP_NumTarjetaDeb = new_fp['FP_NumTarjetaDeb']
    FP_clave = new_fp['FP_ClaveTarjeta']
    FP_Email= new_fp['FP_Email']
    FP_Telefono = new_fp['FP_Telefono']
    FP_EmailP= new_fp['FP_Email_PayPal']
    FP_Cantidad = new_fp['FP_Cantidad']
    FP_Tipo = new_fp['Tipo_FP']
    CN_Clave =new_fp['CN_Clave']
    CJ_Clave =new_fp['CJ_Clave']

    cur.execute('UPDATE forma_de_pago SET FP_Titular = %s,FP_TipoDeTarjeta=%s,FP_NumTarjetaCred=%s,FP_CodigoSeg=%s,FP_NumTarjetaDeb=%s,FP_ClaveTarjeta=%s,FP_Email=%s,FP_Telefono=%s,FP_Email_PayPal=%s,FP_Cantidad=%s,tipo_FP=%s,CN_Clave=%s,CJ_Clave=%s WHERE id = %s RETURNING *', (FP_Titular,FP_TipoDeTarjeta,FP_NumTarjeta,FP_codigo_seguridad,FP_NumTarjetaDeb,FP_clave,FP_Email,FP_Telefono,FP_EmailP,FP_Cantidad,FP_Tipo,CN_Clave,CJ_Clave,id))
    upadate_fp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_fp is None:
        return jsonify({'message': 'User not found'}), 404
    
    return 'User updated'

"""me va a devolver todas las formas de pago de un cliente"""

@app.get('/api/forma_de_pago/<id>/<id2>')     
def get_fp(id,id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    fp = NULL
    if(id2 =="1"):
        print("entro")
        cur.execute('SELECT * FROM forma_de_pago WHERE cn_clave = %s', (id,))
        fp = cur.fetchall()
    if(id2=="2"):
        cur.execute('SELECT * FROM forma_de_pago WHERE cj_clave = %s', (id,))
        fp = cur.fetchall()
    if fp is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(fp)

"""------------------------------CLIENTE NATURAL--------------------------"""

@app.get('/api/Cliente_Natural')
def get_CN():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Cliente_Natural')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)

@app.post('/api/Cliente_Natural')
def create_CN():
    new_user =  request.get_json()

    T_Clave = new_user['T_Clave']
    CN_RIF= new_user['CN_RIF']
    CN_CI =new_user['CN_CI']
    CN_PNombre =new_user['CN_PNombre']
    CN_SNombre =new_user['CN_SNombre']
    CN_PApellido =new_user['CN_PApellido']
    CN_SApellido =new_user['CN_SApellido']
    CN_Email =new_user['CN_Email']
    CN_Codigo =new_user['CN_Codigo']	
    L_Clave =new_user['L_Clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO Cliente_Natural (T_Clave,CN_RIF,CN_CI,CN_PNombre,CN_SNombre,CN_PApellido,CN_SApellido,CN_Email,CN_Codigo,L_Clave) VALUES (%s, %s, %s,%s, %s, %s,%s,%s, %s, %s) RETURNING *', (T_Clave,CN_RIF,CN_CI,CN_PNombre,CN_SNombre,CN_PApellido,CN_SApellido,CN_Email,CN_Codigo,L_Clave))
    user = cur.fetchone();
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(user)

@app.delete('/api/Cliente_Natural/<id>')
def delete_CN(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM Usuario WHERE CN_Clave = %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()

    if user is None:
        return jsonify({'message': 'User not found'}), 404

    cur.execute('DELETE FROM Telefono WHERE CN_Clave = %s RETURNING * ', (id,))
    user = cur.fetchone()
    conn.commit()

    if user is None:
        return jsonify({'message': 'User not found'}), 404

    cur.execute('DELETE FROM Cliente_Natural WHERE CN_Clave = %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()
    if user is None:
            return jsonify({'message': 'User not found'}), 404

    cur.close()
    conn.close()

    return jsonify(user)

@app.put('/api/Cliente_Natural/<id>')
def update_CN(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_user = request.get_json() 

    T_Clave = new_user['T_Clave']
    CN_RIF= new_user['CN_RIF']
    CN_CI =new_user['CN_CI']
    CN_PNombre =new_user['CN_PNombre']
    CN_SNombre =new_user['CN_SNombre']
    CN_PApellido =new_user['CN_PApellido']
    CN_SApellido =new_user['CN_SApellido']
    CN_Email =new_user['CN_Email']
    CN_Codigo =new_user['CN_Codigo']	
    L_Clave =new_user['L_Clave']

    cur.execute('UPDATE Cliente_Natural SET T_Clave = %s, CN_RIF = %s, CN_CI =%s,CN_PNombre=%s,CN_SNombre=%s,CN_PApellido=%s, CN_SApellido=%s,CN_Email=%s,CN_Codigo=%s,L_Clave=%s  WHERE cn_clave = %s RETURNING *', (T_Clave,CN_RIF,CN_CI,CN_PNombre,CN_SNombre,CN_PApellido,CN_SApellido,CN_Email,CN_Codigo,L_Clave,id))
    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify(upadate_user)

@app.get('/api/Cliente_Natural/<id>')
def get_CNE(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Cliente_Natural WHERE cn_clave = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/Cliente_Natural/Cedula/<id>')
def get_CNC(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Cliente_Natural WHERE cn_ci = %s', (id,))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

"""------------------------------CLIENTE JURIDICO--------------------------"""

@app.get('/api/Cliente_Juridico')
def get_CJ():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Cliente_Juridico')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)

@app.post('/api/Cliente_Juridico')
def create_CJ():
    new_user =  request.get_json()

    T_Clave = new_user['T_Clave']
    CJ_RIF= new_user['CJ_RIF']
    CJ_DenominacionSocial =new_user['CJ_DenominacionSocial']
    CJ_RazonSocial =new_user['CJ_RazonSocial']
    CJ_Email =new_user['CJ_Email']
    CJ_PaginaWeb=new_user['CJ_PaginaWeb']
    CJ_CapitalDisp =new_user['CJ_CapitalDisp']
    CJ_Codigo =new_user['CJ_Codigo']	


    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO Cliente_Juridico (T_Clave,CJ_RIF,CJ_DenominacionSocial,CJ_RazonSocial,CJ_Email,CJ_PaginaWeb,CJ_CapitalDisp,CJ_Codigo) VALUES (%s, %s,%s, %s, %s,%s, %s, %s) RETURNING *', (T_Clave,CJ_RIF,CJ_DenominacionSocial,CJ_RazonSocial,CJ_Email,CJ_PaginaWeb,CJ_CapitalDisp,CJ_Codigo))
    user = cur.fetchone();
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(user)

@app.delete('/api/Cliente_Juridico/<id>')
def delete_CJ(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM Usuario WHERE CJ_Clave = %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()

    if user is None:
        return jsonify({'message': 'User not found'}), 404

    cur.execute('DELETE FROM Telefono WHERE CJ_Clave = %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()

    if user is None:
        return jsonify({'message': 'User not found'}), 404

    cur.execute('DELETE FROM Cliente_Juridico WHERE CJ_Clave = %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()

    if user is None:
        return jsonify({'message': 'User not found'}), 404


    cur.close()
    conn.close()

    return jsonify(user)

@app.put('/api/Cliente_Juridico/<id>')
def update_CJ(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_user = request.get_json() 

    T_Clave = new_user['T_Clave']
    CJ_RIF= new_user['CJ_RIF']
    CJ_DenominacionSocial =new_user['CJ_DenominacionSocial']
    CJ_RazonSocial =new_user['CJ_RazonSocial']
    CJ_Email =new_user['CJ_Email']
    CJ_PaginaWeb=new_user['CJ_PaginaWeb']
    CJ_CapitalDisp =new_user['CJ_CapitalDisp']
    CJ_Codigo =new_user['CJ_Codigo']	


    cur.execute('UPDATE Cliente_Juridico SET  T_Clave = %s, CJ_RIF = %s, CJ_DenominacionSocial =%s,CJ_RazonSocial=%s,CJ_Email=%s,CJ_PaginaWeb=%s, CJ_CapitalDisp=%s,CJ_Codigo=%s WHERE cj_clave = %s RETURNING *', (T_Clave,CJ_RIF,CJ_DenominacionSocial,CJ_RazonSocial,CJ_Email,CJ_PaginaWeb,CJ_CapitalDisp,CJ_Codigo,id))
    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify(upadate_user)

@app.get('/api/Cliente_Juridico/<id>')
def get_CJ_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Cliente_Juridico WHERE cj_clave = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/Cliente_Juridico/Rif/<id>')
def get_CJ_rif_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Cliente_Juridico WHERE cj_rif = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


@app.delete('/api/persona_contacto/<id>')
def delete_PC(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM persona_contacto WHERE cj_clave= %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user)

@app.delete('/api/lugarJur/<id>')
def delete_lugarjur(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM Lugar_Jur WHERE cj_clave= %s RETURNING *', (id,))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if user is None:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user)
"""------------------------------ROLES--------------------------"""

@app.get('/api/Rol')
def get_Roles():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Rol')
    roles = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(roles)

@app.post('/api/Rol')
def create_Rol():
    new_rol = request.get_json()
    R_Nombre  = new_rol['r_nombre']
    R_Descripcion = new_rol['r_descripcion']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO Rol (r_nombre,r_descripcion) VALUES (%s, %s) RETURNING *', (R_Nombre,R_Descripcion))
    rol = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(rol)

@app.delete('/api/Rol/<id>')
def delete_Rol(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM Rol WHERE r_clave = %s RETURNING *', (id,))
    rol = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if rol is None:
        return jsonify({'message': 'Rol not found'}), 404
    return jsonify(rol)

@app.put('/api/Rol/<id>')
def update_Rol(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_rol = request.get_json() 

    R_Nombre = new_rol['r_nombre']
    R_Descripcion = new_rol['r_descripcion']

    cur.execute('UPDATE Rol SET  r_nombre = %s, r_descripcion = %s WHERE r_clave = %s RETURNING *', (R_Nombre,R_Descripcion,id))
    upadate_rol = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_rol is None:
        return jsonify({'message': 'Rol not found'}), 404
    
    return jsonify(upadate_rol)


@app.get('/api/Rol/<id>')
def get_rol(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM Rol WHERE r_clave = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)
"""------------------------------ASIGNACION DE PERMISOS A ROLES--------------------------"""
@app.post('/api/rol_accion')
def create_rolAccion():
    asignacion = request.get_json()

    Ac_Clave  = asignacion['Ac_Clave']
    R_Clave = asignacion['R_Clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO rol_accion (ac_clave,r_clave) VALUES (%s, %s) RETURNING *', (Ac_Clave,R_Clave))
    rol = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(rol)
    
    
"""------------------------------ASIGNACION DE ROLES A USUARIOS--------------------------"""
@app.put('/api/rol_usuario/<id>')
def create_rolUser(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    rol_usuario = request.get_json() 

    R_Clave = rol_usuario['R_Clave']

    cur.execute('UPDATE usuario SET  rol_clave = %s WHERE u_clave = %s RETURNING *', (R_Clave,id))
    upadate_rol = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_rol is None:
        return jsonify({'message': 'Rol not found'}), 404
    
    return jsonify(upadate_rol)

@app.get('/api/rol_usuario/<id>')
def get_Roluser(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT r_clave,r_nombre FROM Rol, usuario WHERE usuario.u_clave = %s AND r_clave = usuario.rol_clave', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

"""------------------------------Verifica si tiene usuario el cliente--------------------------"""
@app.get('/api/esUsuario/<id>')
def get_esUsuario(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT u_clave FROM usuario WHERE cn_clave =%s OR cj_clave = %s', (id,id,))
    user = cur.fetchall()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

"""------------------------------ACCIONES--------------------------"""
@app.get('/api/acciones')
def get_acc():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM accion')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)


@app.get('/api/clave/<id>')
def get_clave(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT u_clave FROM usuario WHERE u_nombre = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


@app.get('/api/accionesUser/<id>')
def get_accionesUser(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT ac_nombre FROM accion WHERE ac_clave IN (SELECT ac_clave FROM rol_accion WHERE r_clave IN (SELECT rol_clave FROM usuario WHERE u_nombre = %s))', (id,))
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users)

"""------------------------------DULCE--------------------------"""
# crud de Dulce

@app.get('/api/Dulce') #devuelve todos los Dulces
def get_Dulces():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Dulce")
    Dulce = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Dulce)

@app.get('/api/Dulce/<id>/Sabor')
def get_Sabor(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT Sa_Descripcion, Sa_Clave FROM Sabor WHERE Sa_Clave in (SELECT Sa_Clave FROM Sabor_Caramelo WHERE D_Clave = %s)", (id,))
    Sabores = cur.fetchall()

    print(Sabores)
    
    return jsonify(Sabores)

@app.get('/api/Dulce/<id>/Color')
def get_Color(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute( "SELECT Co_Nombre, Co_Clave FROM Color WHERE Co_Clave in (SELECT Co_Clave FROM Color_Caramelo WHERE D_Clave = %s)", (id,))
    Colores = cur.fetchall()

    print(Colores)

    return jsonify(Colores)

@app.post('/api/Dulce') #crea un nuevo Dulce
def create_Dulce():
    new_Dulce = request.get_json()

    nombre = new_Dulce['nombre']
    precio = new_Dulce['precio']
    descripcion = new_Dulce['descripcion']
    peso = new_Dulce['peso']
    imagen = new_Dulce['imagen']
    TaClave = new_Dulce['TaClave']
    FoClave = new_Dulce['FoClave']
    CDClave = new_Dulce['CDClave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO Dulce (D_Nombre, D_Precio, D_Descripcion, D_Imagen, D_Peso, Ta_Clave, Fo_Clave, CD_Clave) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *',
                (nombre, precio, descripcion, imagen, peso, TaClave, FoClave, CDClave))

    new_created_Dulce = cur.fetchone()
    print(new_created_Dulce)
    conn.commit()


    #creamos color_caramelo
    print("\n Colores: \n")
    for color in new_Dulce['ColoresSeleccionados']: #debemos crear varios colores
        d_clave = new_created_Dulce['d_clave']
        co_clave = color
        cur.execute('INSERT INTO Color_Caramelo (Co_Clave, D_Clave) VALUES (%s, %s) RETURNING *',
                    (co_clave, d_clave))
        new_created_Color_Caramelo = cur.fetchone()
        print(new_created_Color_Caramelo)

    #creamos sabor_caramelo
    print("\n Sabores: \n")
    for sabor in new_Dulce['SaboresSeleccionados']:  # debemos crear varios sabores
        d_clave = new_created_Dulce['d_clave']
        sa_clave = sabor
        cur.execute('INSERT INTO Sabor_Caramelo (Sa_Clave, D_Clave) VALUES (%s, %s) RETURNING *',
                    (sa_clave, d_clave))
        new_created_Sabor_Caramelo = cur.fetchone()
        print(new_created_Sabor_Caramelo)

    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Dulce)

@app.delete('/api/Dulce/<id>') #elimina un Dulce, gracias al cascade se borran los colores y sabores asociados
def delete_Dulce(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM Dulce WHERE d_clave = %s RETURNING *', (id, ))
    Dulce = cur.fetchone()

    conn.commit()

    cur.close()
    conn.close

    if Dulce is None:
        return jsonify({'message': 'Dulce not found'}), 404

    return jsonify(Dulce)

@app.put('/api/Dulce/<id>') #actualiza un Dulce | Actualizamos el dulce pero debemos borrar
def update_Dulce(id):   #los colores y sabores asociados
    
        conn = get_connection()
        cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    
        new_Dulce = request.get_json()
        nombre = new_Dulce['nombre']
        precio = new_Dulce['precio']
        descripcion = new_Dulce['descripcion']
        peso = new_Dulce['peso']
        imagen = new_Dulce['imagen']
        TaClave = new_Dulce['TaClave']
        FoClave = new_Dulce['FoClave']
        CDClave = new_Dulce['CDClave']
    
        cur.execute(
            'UPDATE Dulce SET D_Nombre = %s, D_Precio = %s, D_Descripcion = %s, D_Peso = %s, D_Imagen = %s, Ta_Clave = %s, Fo_Clave = %s, CD_Clave = %s WHERE D_Clave = %s RETURNING *',
            (nombre, precio, descripcion, peso, imagen, TaClave, FoClave, CDClave, id))
        updated_Dulce = cur.fetchone()
    
        conn.commit()

        if updated_Dulce is None:
            cur.close()
            conn.close()
            return jsonify({'message': 'Dulce not found'}), 404

        #borramos los colores y sabores asociados
        cur.execute('DELETE FROM Color_Caramelo WHERE D_Clave =%s',
                    (id))
        conn.commit()

        cur.execute('DELETE FROM Sabor_Caramelo WHERE D_Clave =%s',
                    (id))
        conn.commit()


        print("\n Colores: \n")
        for color in new_Dulce['ColoresSeleccionados']: #debemos crear varios colores
            d_clave = updated_Dulce['d_clave']
            co_clave = color
            cur.execute('INSERT INTO Color_Caramelo (Co_Clave, D_Clave) VALUES (%s, %s) RETURNING *',
                        (co_clave, d_clave))
            new_created_Color_Caramelo = cur.fetchone()
            print(new_created_Color_Caramelo)

        #creamos sabor_caramelo
        print("\n Sabores: \n")
        for sabor in new_Dulce['SaboresSeleccionados']:  # debemos crear varios sabores
            d_clave = updated_Dulce['d_clave']
            sa_clave = sabor
            cur.execute('INSERT INTO Sabor_Caramelo (Sa_Clave, D_Clave) VALUES (%s, %s) RETURNING *',
                        (sa_clave, d_clave))
            new_created_Sabor_Caramelo = cur.fetchone()
            print(new_created_Sabor_Caramelo)

        conn.commit()
    
        cur.close()
        conn.close()
    
        return jsonify(updated_Dulce)

@app.get('/api/Dulce/<id>') #devuelve un Dulce
def get_Dulce(id):
        
        conn = get_connection()
        cur = conn.cursor(cursor_factory=extras.RealDictCursor)
        
        cur.execute("SELECT * FROM Dulce WHERE d_clave = %s", (id,))
        Dulce = cur.fetchone()
        
        if Dulce is None:
            return jsonify({'error': 'Dulce not found'}), 404
        
        return jsonify(Dulce) 



"""-----------------------CARACTERISITICAS DE DULCE--------------------------------"""
#Crud Caracteristica de Dulce
@app.get('/api/CatalogoDulce')  # devuelve todos los tipos de los Dulces
def get_TiposDulce():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM catalogodulce")
    Tipos = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Tipos)

@app.get('/api/CatalogoDulce/<id>')  # devuelve todos los tipos de los Dulces
def get_TipoDulce(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM catalogodulce WHERE CD_Clave = %s", (id,))
    Tipos = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Tipos)

@app.get('/api/Formas')  # devuelve todas las formas de los Dulces
def get_Formas():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM forma")
    Formas = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Formas)

@app.get('/api/Formas/<id>')  # devuelve todas las formas de los Dulces
def get_Forma(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM forma WHERE Fo_Clave = %s", (id,))
    Formas = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Formas)

@app.get('/api/Tamanos')  # devuelve todos los Tamanos de Dulces
def get_Tamanos():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Tamano")
    Tamanos = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Tamanos)

@app.get('/api/Tamanos/<id>')  # devuelve un tamano de Dulces
def get_Tamano(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Tamano WHERE Ta_Clave = %s", (id,))
    Tamanos = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Tamanos)

@app.get('/api/Colores')  # devuelve todos los Colores de Dulces
def get_Colores():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Color")
    Colores = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Colores)

@app.get('/api/Sabores')  # devuelve todos los Colores de Dulces
def get_Sabores():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Sabor")
    Sabores = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Sabores)


"""-----------------------PEDIDO--------------------------------"""

# Crud Pedido online
@app.post('/api/Detalle_Pedido')
def post_Detalle_Pedido():
    new_Detalle_Pedido = request.get_json()

    d_clave = new_Detalle_Pedido['d_clave']
    pf_clave = new_Detalle_Pedido['pf_clave']
    po_clave = new_Detalle_Pedido['po_clave']
    rs_clave = new_Detalle_Pedido['rs_clave']
    t_clave = new_Detalle_Pedido['t_clave']
    dp_preciounitario = new_Detalle_Pedido['dp_preciounitario']
    dp_cantidad = new_Detalle_Pedido['dp_cantidad']
   
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO Detalle_Pedido (D_Clave, PF_Clave, PO_Clave, RS_Clave, T_Clave, DP_PrecioUnitario, DP_Cantidad) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *',
                (d_clave, pf_clave, po_clave, rs_clave, t_clave, dp_preciounitario, dp_cantidad))

    new_created_Detalle_Pedido = cur.fetchone()
    print(new_created_Detalle_Pedido)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Detalle_Pedido)

@app.post('/api/Pedido_Online')  # crea un nuevo Pedido Online
def create_Pedido_Online():
    new_Pedido_Online = request.get_json()

    po_monto = new_Pedido_Online['po_monto']
    cn_clave = new_Pedido_Online['cn_clave']
    cj_clave = new_Pedido_Online['cj_clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO Pedido_Online (PO_Monto, CN_Clave, CJ_Clave) VALUES (%s, %s, %s) RETURNING *',
                (po_monto, cn_clave, cj_clave))

    new_created_Pedido_Online = cur.fetchone()
    print(new_created_Pedido_Online)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Pedido_Online)

@app.get('/api/Pedido_Online')  # devuelve todos los Pedidos Online
def get_Pedidos_Online():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM pedido_online")
    Pedido_Online = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Pedido_Online)

@app.get('/api/Pedido_Online/<id>')  # devuelve un solo Pedido Online
def get_Pedido_Online(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Pedido_Online WHERE PO_Clave = %s", (id,))
    Pedido_Online = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Pedido_Online)

@app.get('/api/Detalle_Pedido_Online/<id>')  # devuelve todos los Detalles de un pedido
def get_Detalles_Pedido_Online(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Detalle_Pedido WHERE PO_Clave = %s", (id,))
    Detalle_Pedido = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Detalle_Pedido)

# Crud pedido fisico

@app.post('/api/Pedido_Fisico')  # crea un nuevo Pedido Fisico
def create_Pedido_Fisico():
    new_Pedido_Fisico = request.get_json()

    pf_monto = new_Pedido_Fisico['pf_monto']
    cn_clave = new_Pedido_Fisico['cn_clave']
    cj_clave = new_Pedido_Fisico['cj_clave']
    t_clave = new_Pedido_Fisico['t_clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO Pedido_Fisico (PF_Monto, CN_Clave, CJ_Clave, T_Clave) VALUES (%s, %s, %s, %s) RETURNING *',
                (pf_monto, cn_clave, cj_clave, t_clave))

    new_created_Pedido_Fisico = cur.fetchone()
    print(new_created_Pedido_Fisico)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Pedido_Fisico)

@app.get('/api/Pedido_Fisico')  # devuelve todos los Pedidos Fisicos
def get_Pedidos_Fisico():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM pedido_fisico")
    Pedido_Fisico = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Pedido_Fisico)

@app.get('/api/Pedido_Fisico/<id>')  # devuelve un solo Pedido Fisico
def get_Pedido_Fisico(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Pedido_Fisico WHERE PF_Clave = %s", (id,))
    Pedido_Fisico = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Pedido_Fisico)

@app.get('/api/Detalle_Pedido_Fisico/<id>') # devuelve todos los Detalles de un pedido
def get_Detalles_Pedido_Fisico(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Detalle_Pedido WHERE PF_Clave = %s", (id,))
    Detalle_Pedido = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Detalle_Pedido)

# Crud ReStock
@app.post('/api/Pedido_ReStock')  # crea un nuevo Pedido Fisico
def create_Pedido_ReStock():
    new_Pedido_Fisico = request.get_json()

    t_clave = new_Pedido_Fisico['t_clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('INSERT INTO restock (t_clave) VALUES (%s) RETURNING *',
                (t_clave))

    new_created_Pedido_ReStock = cur.fetchone()
    print(new_created_Pedido_ReStock)
    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Pedido_ReStock)

@app.get('/api/Pedido_ReStock')  # devuelve todos los Pedidos Fisicos
def get_Pedidos_ReStock():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM restock")
    Pedido_ReStock = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Pedido_ReStock)

@app.get('/api/Pedido_ReStock/t_clave/<id>')  # devuelve todos los restock de una tienda
def get_Pedido_ReStock_tienda(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM restock WHERE t_Clave = %s", (id,))
    Pedido_ReStock = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Pedido_ReStock)

@app.get('/api/Pedido_ReStock/<id>')  # devuelve un solo Pedido Fisico
def get_Pedido_ReStock(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM restock WHERE rs_Clave = %s", (id,))
    Pedido_ReStock = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Pedido_ReStock)

# devuelve todos los Detalles de un pedido
@app.get('/api/Detalle_Pedido_ReStock/<id>')
def get_Detalles_Pedido_ReStock(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Detalle_Pedido WHERE rs_Clave = %s", (id,))
    Detalle_Pedido = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Detalle_Pedido)


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Crud Estatus

@app.get('/api/Estado_del_Pedido')  # devuelve todos los Estados de los Pedidos (Catalogo)
def get_Estados_del_Pedido():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estado_del_Pedido")
    Estados_del_Pedido = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estados_del_Pedido)

@app.post('/api/Estatus_Pedido_Online')
def post_Estatus_Pedido_Online():
    new_Estatus_Pedido_Online = request.get_json()

    #epo_fecha = new_Estatus_Pedido_Online['epo_fecha']
    po_clave = new_Estatus_Pedido_Online['po_clave']
    #ep_clave = new_Estatus_Pedido_Online['ep_clave']
    ep_clave = 1

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_Online WHERE PO_Clave = %s ORDER BY EP_Clave DESC", (po_clave,))
    estatus_Actual = cur.fetchone()

    if estatus_Actual is None:
       ep_clave = 1
    else:
        ep_clave = estatus_Actual['ep_clave'] + 1

    #falta poner la fecha de fin del estatus anterios
    cur.execute('INSERT INTO Estatu_Pedido_Online (EP_Clave, PO_Clave) VALUES (%s, %s) RETURNING *',
                (ep_clave, po_clave))

    new_created_Estatus_Pedido_Online = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Estatus_Pedido_Online)

@app.get('/api/Estatus_Pedido_Online') # devuelve todos los Estatus de los Pedidos
def get_Estatus_Pedido_Online():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_Online")
    Estatus_Pedido_Online = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_Online)

@app.get('/api/Estatus_Pedido_Online/<id>')
def get_Estatus_Pedido_Online_unico(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_Online WHERE EPO_Clave = %s", (id,))
    Estatus_Pedido_Online = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_Online)

@app.get('/api/Estatus_Pedido_Online/PO_Clave/<id>') #obtenemos el registro de estatus de un pedido Fisico
def get_Estatus_Pedido_Online_PO_Clave(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_Online WHERE PO_Clave = %s ORDER BY EP_Clave DESC", (id,))
    Estatus_Pedido_Online = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_Online)

@app.post('/api/Estatus_Pedido_Fisico')
def post_Estatus_Pedido_Fisico():
    new_Estatus_Pedido_Fisico = request.get_json()

    #epo_fecha = new_Estatus_Pedido_Fisico['epo_fecha']
    pf_clave = new_Estatus_Pedido_Fisico['pf_clave']
    #ep_clave = new_Estatus_Pedido_Fisico['ep_clave']
    ep_clave = 1

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute(
        "SELECT * FROM Estatu_Pedido_Fisico WHERE PF_Clave = %s ORDER BY EP_Clave DESC", (pf_clave,))
    estatus_Actual = cur.fetchone()

    if estatus_Actual is None:
       ep_clave = 1
    else:
        ep_clave = estatus_Actual['ep_clave'] + 1

    #falta poner la fecha de fin del estatus anterios
    cur.execute('INSERT INTO Estatu_Pedido_Fisico (EP_Clave, PF_Clave) VALUES (%s, %s) RETURNING *',
                (ep_clave, pf_clave))

    new_created_Estatus_Pedido_Fisico = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Estatus_Pedido_Fisico)

# devuelve todos los Estatus de los Pedidos
@app.get('/api/Estatus_Pedido_Fisico')
def get_Estatus_Pedido_Fisico():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_Fisico")
    Estatus_Pedido_Fisico = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_Fisico)

@app.get('/api/Estatus_Pedido_Fisico/<id>')
def get_Estatus_Pedido_Fisico_unico(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_Fisico WHERE EPF_Clave = %s", (id,))
    Estatus_Pedido_Fisico = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_Fisico)

# obtenemos el registro de estatus de un pedido Fisico
@app.get('/api/Estatus_Pedido_Fisico/PF_Clave/<id>')
def get_Estatus_Pedido_Fisico_PF_Clave(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute(
        "SELECT * FROM Estatu_Pedido_Fisico WHERE PF_Clave = %s ORDER BY EP_Clave DESC", (id,))
    Estatus_Pedido_Fisico = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_Fisico)

######

@app.post('/api/Estatus_Pedido_ReStock')
def post_Estatus_Pedido_ReStock():
    new_Estatus_Pedido_Fisico = request.get_json()

    rs_clave = new_Estatus_Pedido_Fisico['rs_clave']
    ep_clave = 1

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute(
        "SELECT * FROM Estatu_Pedido_restock WHERE rs_Clave = %s ORDER BY EP_Clave DESC", (rs_clave,))
    estatus_Actual = cur.fetchone()

    if estatus_Actual is None:
       ep_clave = 1
    else:
        ep_clave = estatus_Actual['ep_clave'] + 1

    #falta poner la fecha de fin del estatus anterios
    cur.execute('INSERT INTO Estatu_Pedido_ReStock (EP_Clave, rs_Clave) VALUES (%s, %s) RETURNING *',
                (ep_clave, rs_clave))

    new_created_Estatus_Pedido_ReStock = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    return jsonify(new_created_Estatus_Pedido_ReStock)

# devuelve todos los Estatus de los Pedidos
@app.get('/api/Estatus_Pedido_ReStock')
def get_Estatus_Pedido_ReStock():

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_ReStock")
    Estatus_Pedido_ReStock = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_ReStock)

@app.get('/api/Estatus_Pedido_ReStock/<id>')
def get_Estatus_Pedido_ReStock_unico(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute("SELECT * FROM Estatu_Pedido_ReStock WHERE EPR_Clave = %s", (id,))
    Estatus_Pedido_ReStock = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_ReStock)

# obtenemos el registro de estatus de un pedido Fisico
@app.get('/api/Estatus_Pedido_ReStock/RS_Clave/<id>')
def get_Estatus_Pedido_ReStock_RS_Clave(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute(
        "SELECT * FROM Estatu_Pedido_ReStock WHERE RS_Clave = %s ORDER BY EP_Clave DESC", (id,))
    Estatus_Pedido_ReStock = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estatus_Pedido_ReStock)


@app.get('/api/Estado_del_Pedido/<id>') #obtenemos el estado actual de un pedido
def get_Estado_delPedido(id):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute(
        "SELECT * FROM Estado_Del_Pedido WHERE EP_Clave = %s", (id,))
    Estado = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(Estado)
"""--------------------Empleado-----------------------"""

@app.post('/api/empleado')
def create_emp():
    new_user =  request.get_json()

    em_pnombre = new_user['em_pnombre']
    em_snombre = new_user['em_snombre']
    em_papellido = new_user['em_papellido']
    em_sapellido = new_user['em_sapellido']
    em_ci = new_user['em_ci']
    em_salario = new_user['em_salario']
    t_clave = new_user['t_clave']
    
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO empleado (em_pnombre,em_snombre,em_papelido,em_sapellido,em_ci,em_salario,t_clave) VALUES (%s, %s, %s,%s, %s, %s,%s) RETURNING *', (em_pnombre,em_snombre,em_papellido,em_sapellido,em_ci,em_salario,t_clave))
    user = cur.fetchone();
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(user)

@app.get('/api/empleado/<id>') #obtenemos un empleado por su clave
def get_empleado(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM empleado WHERE em_clave = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


"""---------------------Tienda-----------------------"""
@app.get('/api/tienda/<id>')
def get_tienda(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM tienda WHERE t_nombre = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/tienda/n/<id>')
def get_tienda_n(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT t_nombre FROM tienda WHERE t_clave = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Me devuelve la clave de la  tienda que tiene el empleado

@app.get('/api/tienda/empleado/<id>')
def get_tienda_empleado(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT t_clave FROM empleado WHERE em_clave = %s', (id,))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)



"""---------------------Lugar-----------------------"""

@app.get('/api/lugar/<id>/<id2>')
def get_lugar(id,id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT l_clave FROM lugar WHERE l_nombre = %s AND l_tipo = %s', (id,id2))
    user = cur.fetchone()
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.post('/api/lugar')
def create_lugarJ():
    new_user =  request.get_json()

    cj_clave = new_user['cj_clave']
    l_clave = new_user['l_clave']
    lj_tipo = new_user['lj_tipo']
    
    
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO lugar_jur (cj_clave,l_clave,lj_tipo) VALUES (%s, %s, %s) RETURNING *', (cj_clave,l_clave,lj_tipo))
    user = cur.fetchone();
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(user)

@app.get('/api/lugar/<id>')
def get_lugarr(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM lugar WHERE l_clave = %s', (id,))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/lugarJur/<id>/<id2>')
def get_lugarrrr(id, id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM lugar_jur WHERE l_clave = %s AND cj_clave = %s', (id, id2))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/lugarJur/<id>')
def get_lugarrrdr(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute(
        'SELECT * FROM lugar_jur WHERE  cj_clave = %s', (id, ))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


"""---------------------Telefono-----------------------"""

@app.post('/api/telefono')
def create_tel():
    new_tel =  request.get_json()


    tlf_numero = new_tel['tlf_numero']
    tlf_codigoarea = new_tel['tlf_codigoarea']
    cj_clave = new_tel['cj_clave']
    cn_clave = new_tel['cn_clave']
    
    
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO telefono (tlf_numero,tlf_codigoarea,cj_clave,cn_clave) VALUES (%s, %s, %s,%s) RETURNING *', (tlf_numero,tlf_codigoarea,cj_clave,cn_clave))
    user = cur.fetchone();
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(user)

@app.get('/api/telefonocn/<id>')
def get_telefonocn(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM telefono WHERE cn_clave = %s', (id,))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/telefonocj/<id>')
def get_telefonocj(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM telefono WHERE cj_clave = %s', (id,))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.put('/api/telefono/<id>')
def update_telefono(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    new_tel = request.get_json() 

    tlf_numero = new_tel['tlf_numero']
    tlf_codigoarea = new_tel['tlf_codigoarea']
    cj_clave = new_tel['cj_clave']
    cn_clave = new_tel['cn_clave']

    cur.execute('UPDATE telefono SET TLF_Numero = %s, TLF_CodigoArea = %s, CJ_Clave = %s, CN_Clave =%s WHERE TLF_Clave = %s RETURNING *',
    (tlf_numero, tlf_codigoarea, cj_clave, cn_clave, id))

    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify(upadate_user)

"""---------------------PERSONA DE CONTACTO-----------------------"""	
@app.post('/api/persona_contacto')
def create_pc():
    new_tel =  request.get_json()


    pc_email = new_tel['pc_email']
    tlf_clave = new_tel['tlf_clave']
    cj_clave = new_tel['cj_clave']
    
    
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO persona_contacto (pc_email,tlf_clave,cj_clave) VALUES (%s, %s, %s) RETURNING *', (pc_email,tlf_clave,cj_clave))
    user = cur.fetchone();
    conn.commit()
    cur.close()
    conn.close()
  
    return jsonify(user)

"""---------------------FORMA DE PAGO A COMPRA-----------------------"""
@app.post('/api/forma_pago_compra')
def create_compraPago():
    new_cp = request.get_json()

    po_clave = new_cp['po_clave']
    fp_id = new_cp['fp_id']
    ppo_monto = new_cp['ppo_monto']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO pago_po (po_clave,fp_id,ppo_monto) VALUES (%s, %s, %s) RETURNING *', (po_clave,fp_id,ppo_monto))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(user)

@app.post('/api/forma_pago_compra_Fisico')
def create_compraPagoF():
    new_cp = request.get_json()

    pf_clave = new_cp['pf_clave']
    fp_id = new_cp['fp_id']
    ppf_monto = new_cp['ppf_monto']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO pago_pf (pf_clave,fp_id,ppf_monto) VALUES (%s, %s, %s) RETURNING *', (pf_clave,fp_id,ppf_monto))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(user)
    

"""---------------------DESCUENTO-----------------------"""

@app.post('/api/descuento')
def create_descuento():
    new_desc = request.get_json()

    d_clave = new_desc['d_clave']
    de_porcentaje = new_desc['de_porcentaje']
    de_fechainicio = new_desc['de_fechainicio']
    de_fechafin = new_desc['de_fechafin']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO descuento (d_clave,de_porcentaje,de_fechainicio,de_fechafin) VALUES (%s, %s, %s,%s) RETURNING ',
                (d_clave, de_porcentaje, de_fechainicio, de_fechafin))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(user)

@app.get('/api/descuento')
def get_descuento():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM descuento')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/descuento/ff')
def get_descuento_ff():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT distinct de_fechafin FROM descuento')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/descuento/<id>')
def get_descuento_id(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM descuento WHERE d_clave = %s', (id,))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)
"""---------------------ALMACEN-----------------------"""

@app.get('/api/almacen/<id>')
def get_almacen(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM almacen WHERE t_clave = %s', (id,))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/zona_almacen/<id>/<id2>')
def get_almacen_dulce(id, id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM zona_almacen WHERE d_clave = %s AND alm_codigo = %s', (id, id2))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.put('/api/zona_almacen/<id>/<id2>/<id3>')
def update_almacen_dulce(id, id2, id3):

    cantidad = id3

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE zona_almacen SET za_cantidad = za_cantidad - %s WHERE d_clave = %s AND alm_codigo = %s RETURNING *',
                (cantidad, id, id2))

    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify(upadate_user)

@app.put('/api/suma_zona_almacen/<id>/<id2>/<id3>')
def suma_almacen_dulce(id, id2, id3):

    cantidad = id3

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('UPDATE zona_almacen SET za_cantidad = za_cantidad + %s WHERE d_clave = %s AND alm_codigo = %s RETURNING *',
                (cantidad, id, id2))

    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify(upadate_user)

"""---------------------PASILLO-----------------------"""

@app.get('/api/zona_pasillo/<id>/<id2>')
def get_pasillo_dulce(id, id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM zona_pasillo WHERE d_clave = %s AND p_clave = %s', (id, id2))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.put('/api/zona_pasillo/<id>/<id2>/<id3>')
def update_pasillo_dulce(id,id2,id3):

    cantidad = id3

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('UPDATE zona_pasillo SET zp_cantidad = zp_cantidad - %s WHERE d_clave = %s AND p_clave = %s RETURNING *',
                (cantidad, id, id2))

    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify(upadate_user)

#sumamos zona pasillo, y restamos de zona almacen (tambien creamos la alerta)
@app.put('/api/suma_zona_pasillo/<id>/<id2>')
def suma_pasillo_dulce(id, id2):

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM zona_almacen WHERE d_clave = %s AND alm_codigo = %s',
                (id, id2))

    upadate_user = cur.fetchone()

    if upadate_user is None:
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': ' Almacen no encontrado'}), 404

    if upadate_user['za_cantidad'] >= 100:
        cantidad = 100
    else:
        cantidad = upadate_user['za_cantidad']

    cur.execute('UPDATE zona_pasillo SET zp_cantidad = zp_cantidad + %s WHERE d_clave = %s AND p_clave = %s AND zp_cantidad <= 20 RETURNING *',
                (cantidad, id, id2))
    updated_pasillo = cur.fetchone()

    if updated_pasillo is not None:
        cur.execute(
            'INSERT INTO pedido_pasillo (D_Clave,T_Clave,pp_cantidad) VALUES (%s,%s,%s) RETURNING *', 
            (id, id2, cantidad))

        cur.execute('UPDATE zona_almacen SET za_cantidad = za_cantidad - %s WHERE d_clave = %s AND alm_codigo = %s RETURNING *',
                    (cantidad, id, id2))

    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if updated_pasillo is None:
        return jsonify({'message': 'El pasillo no necesita rellenar'}), 200

    return jsonify(upadate_user)

@app.get('/api/pedidosPasillo')
def get_pedidosPasillo():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_pasillo ORDER BY pp_clave')
    pedido = cur.fetchall()

    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message': 'Pedido not found'}), 404

    return jsonify(pedido)

@app.get('/api/pedidosPasillo/<id>')
def get_pedidosPasilloTienda(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM pedido_pasillo WHERE T_Clave = %s ORDER BY pp_clave', (id,))
    pedido = cur.fetchall()

    cur.close()
    conn.close()

    if pedido is None:
        return jsonify({'message': 'Pedido not found'}), 404

    return jsonify(pedido)

@app.post('/api/pedidosPasillo')
def create_pedidosPasillo():
    new_po = request.get_json()

    T_Clave = new_po['T_Clave']
    D_Clave = new_po['D_Clave']
    cantidad = new_po['cantidad']

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO pedido_pasillo (T_Clave,D_Clave,pp_cantidad) VALUES (%s,%s,%s) RETURNING *',
                (T_Clave, D_Clave, cantidad))
    mp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(mp)

@app.delete('/api/pedidosPasillo/<id>')
def delete_pedidosPasillo(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM pedido_pasillo WHERE pp_clave = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Pedido deleted'})


"""---------------------INVENTARIO-----------------------"""

@app.get('/api/inventario/<id>')
def get_inventario(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM inventario WHERE alm_codigo = %s', (id,))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.get('/api/inventario/<id>/<id2>')
def get_inventario_dulce(id, id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM inventario WHERE alm_codigo = %s AND d_clave = %s', (id, id2))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

@app.put('/api/actualizar_inventario/<id>')
def update_inventario(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM zona_pasillo WHERE p_clave = %s ORDER BY d_clave ASC',       
                (id))
    zonasp = cur.fetchall()

    cur.execute('SELECT * FROM zona_almacen WHERE alm_codigo = %s ORDER BY d_clave ASC',
                (id))
    zonasa = cur.fetchall()

    for i in range(len(zonasa)):
        cantidadTotal = zonasa[i]['za_cantidad'] + zonasp[i]['zp_cantidad']
        print(i)
        print(cantidadTotal)
        print(zonasa[i]['d_clave'])

        cur.execute('UPDATE inventario SET in_cantidad = %s WHERE alm_codigo = %s AND d_clave = %s RETURNING *',
                    (cantidadTotal, id, zonasa[i]['d_clave']))

    upadate_user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if upadate_user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify(upadate_user)

"""---------------------PUNTOS-----------------------"""

@app.put('/api/agregarPuntoN/<id>')
def update_PuntosN(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    punto = "Punto"

    cur.execute(
        'UPDATE forma_de_pago SET fp_cantidad = fp_cantidad + 1  WHERE cn_clave = %s AND tipo_fp = %s RETURNING *', (id, punto))
    update_puntos = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if update_puntos is None:
        return jsonify({'message': 'no existen puntos'}), 200
    
    return jsonify(update_puntos)

@app.put('/api/agregarPuntoJ/<id>')
def update_PuntosJ(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    punto = "Punto"

    cur.execute(
        'UPDATE forma_de_pago SET fp_cantidad = fp_cantidad + 1  WHERE cj_clave = %s AND tipo_fp = %s RETURNING *', (id, punto))
    update_puntos = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if update_puntos is None:
        return jsonify({'message': 'no existen puntos'}), 200
    
    return jsonify(update_puntos)
    

@app.put('/api/restarPuntoN/<id>/<id2>')
def update_restar_PuntosN(id, id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    punto = "Punto"

    cur.execute(
        'UPDATE forma_de_pago SET fp_cantidad = fp_cantidad - %s  WHERE cn_clave = %s AND tipo_fp = %s RETURNING *', (id2, id, punto))
    update_puntos = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if update_puntos is None:
        return jsonify({'message': 'no existen puntos'}), 404

    return jsonify(update_puntos)

@app.put('/api/restarPuntoJ/<id>/<id2>')
def update__restar_PuntosJ(id, id2):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    punto = "Punto"

    cur.execute(
        'UPDATE forma_de_pago SET fp_cantidad = fp_cantidad - %s  WHERE cj_clave = %s AND tipo_fp = %s RETURNING *', (id2, id, punto))
    update_puntos = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if update_puntos is None:
        return jsonify({'message': 'no existen puntos'}), 404

    return jsonify(update_puntos)

"""---------------------DASHBOARD-----------------------"""

#primer trimestre 
@app.get('/api/dashboard/primer_trimestre')
def get_ps():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(aux.ventas) FROM (SELECT po_clave AS ventas from pedido_online where po_fecha between %s and %s  UNION ALL SELECT pf_clave as ventas from pedido_fisico where pf_fecha between  %s and %s) as aux',('2022-01-01','2022-03-31','2022-01-01','2022-03-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#segundo trimestre 
@app.get('/api/dashboard/segundo_trimestre')
def get_pss():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(aux.ventas) FROM (SELECT po_clave AS ventas from pedido_online where po_fecha between %s and %s UNION ALL SELECT pf_clave as ventas from pedido_fisico where pf_fecha between %s and %s) as aux',('2022-04-01','2022-06-30','2022-04-01','2022-06-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#tercer trimestre 
@app.get('/api/dashboard/tercer_trimestre')
def get_ts():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(aux.ventas) FROM (SELECT po_clave AS ventas from pedido_online where po_fecha between %s and %s UNION ALL SELECT pf_clave as ventas from pedido_fisico where pf_fecha between %s and %s) as aux',('2022-07-01','2022-09-30','2022-07-01','2022-09-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#cuarto trimestre 
@app.get('/api/dashboard/cuarto_trimestre')
def get_cs():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(aux.ventas) FROM (SELECT po_clave AS ventas from pedido_online where po_fecha between  %s and %s UNION ALL SELECT pf_clave as ventas from pedido_fisico where pf_fecha between  %s and %s) as aux',('2022-10-01','2022-12-31','2022-10-01','2022-12-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Dulce mas vendido
@app.get('/api/dashboard/dulce_mas_vendido')
def get_dmv():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select aux.suma, aux.d_clave from (select SUM(dp_cantidad) as suma,d_clave FROM detalle_pedido WHERE rs_clave is null GROUP BY d_clave) as aux where aux.suma = (select max(aux.suma) from (select SUM(dp_cantidad) as suma FROM detalle_pedido WHERE rs_clave is null GROUP BY d_clave) as aux)')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Dulce menos vendido
@app.get('/api/dashboard/dulce_menos_vendido')
def get_dmnv():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select aux.suma, aux.d_clave from (select SUM(dp_cantidad) as suma,d_clave FROM detalle_pedido WHERE rs_clave is null GROUP BY d_clave) as aux where aux.suma = (select min(aux.suma) from (select SUM(dp_cantidad) as suma FROM detalle_pedido WHERE rs_clave is null GROUP BY d_clave) as aux)')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Porcentaje de uso metodos de pago
@app.get('/api/dashboard/porcentaje_uso_metodos_pago')
def get_pmp():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(aux.fp_id), fp.tipo_fp from (select fp_id from pago_po union all select fp_id from pago_pf) as aux, forma_de_pago fp where aux.fp_id = fp.fp_id group by fp.tipo_fp')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#cantidad de venta online
@app.get('/api/dashboard/cantidad_venta_online')
def get_cvo():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from pedido_online')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#cantidad de venta fisica
@app.get('/api/dashboard/cantidad_venta_fisica')
def get_cvf():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*),t_clave from pedido_fisico group by t_clave')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


#Cantidad de puntos cangeados
@app.get('/api/dashboard/cantidad_puntos_cangeados')
def get_cpc():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT SUM(pago.pago) FROM ((SELECT po.ppo_monto as pago from pago_po po, forma_de_pago fp where po.fp_id = fp.fp_id AND fp.tipo_fp like %s )UNION ALL(SELECT pf.ppf_monto as pago from pago_pf pf, forma_de_pago fp where  pf.fp_id = fp.fp_id AND fp.tipo_fp like %s))  as pago',('Punto','Punto'))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cantidad de puntos obtenidos
@app.get('/api/dashboard/cantidad_puntos_obtenidos')
def get_cpo():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT SUM(fp_cantidad) FROM forma_de_pago WHERE tipo_fp = %s ',('Punto',))
    user = cur.fetchone()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)


"""---------------------ASISTENCIA-----------------------"""

@app.post('/api/asistencia')
def post_asistencia():
    new_as = request.get_json()

    a_dia = new_as['a_dia']
    a_fecha = new_as['a_fecha']
    a_horaentrada = new_as['a_horaentrada']
    a_horasalida = new_as['a_horasalida']
    em_clave = new_as['em_clave']

    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO asistencia (a_dia,a_fecha,a_horaentrada,a_horasalida,em_clave) VALUES (%s,%s, %s,%s,%s) RETURNING *',
                (a_dia, a_fecha, a_horaentrada, a_horasalida, em_clave))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify(user)


@app.delete('/api/asistencia/delete')
def delete_asistencia():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM asistencia *')
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'asistencia eliminada'})


"""---------------------TABLA DE ASISTENCIAS-----------------------"""

@app.get('/api/asistencia/gt')
def get_asistencia():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select * from asistencia ')
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str

@app.get('/api/asistencia/empleados')
def get_asistencia_empleados():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select distinct(em_clave) from asistencia')
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Primer trimestre para las inasistencias
@app.get('/api/asistencia/primerTrimestre/<id>')
def get_asistencia_primerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.em_clave = %s and e.em_clave = %s) and (aa.a_horaentrada is null and aa.a_horasalida is null) and (aa.a_fecha between %s and %s)', (id, id, '2022-01-01', '2022-03-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Segundo trimestre para las inasistencias
@app.get('/api/asistencia/segundoTrimestre/<id>')
def get_asistencia_segundoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.em_clave = %s and e.em_clave = %s) and (aa.a_horaentrada is null and aa.a_horasalida is null) and (aa.a_fecha between %s and %s)', (id, id, '2022-04-01', '2022-06-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Tercer trimestre para las inasistencias
@app.get('/api/asistencia/tercerTrimestre/<id>')
def get_asistencia_tercerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.em_clave = %s and e.em_clave = %s) and (aa.a_horaentrada is null and aa.a_horasalida is null) and (aa.a_fecha between %s and %s)', (id, id, '2022-07-01', '2022-09-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cuarto trimestre para las inasistencias
@app.get('/api/asistencia/cuartoTrimestre/<id>')
def get_asistencia_cuartoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) from asistencia aa,empleado e where (aa.em_clave = %s and e.em_clave = %s) and (aa.a_horaentrada is null and aa.a_horasalida is null) and (aa.a_fecha between %s and %s)', (id, id, '2022-10-01', '2022-12-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#llegada tarde primer trimestre
@app.get('/api/asistencia/llegadaTardePrimerTrimestre/<id>')
def get_asistencia_llegadaTardePrimerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada > any (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-01-01', '2022-03-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#llegada tarde segundo trimestre
@app.get('/api/asistencia/llegadaTardeSegundoTrimestre/<id>')
def get_asistencia_llegadaTardeSegundoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada > any (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-04-01', '2022-06-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#llegada tarde tercer trimestre
@app.get('/api/asistencia/llegadaTardeTercerTrimestre/<id>')
def get_asistencia_llegadaTardeTercerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada > any (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-07-01', '2022-09-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#llegada tarde cuarto trimestre
@app.get('/api/asistencia/llegadaTardeCuartoTrimestre/<id>')
def get_asistencia_llegadaTardeCuartoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa, empleado e WHERE  ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada > any (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-10-01', '2022-12-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cumplimiento de Horario primer trimestre
@app.get('/api/asistencia/cumplimientoHorarioPrimerTrimestre/<id>')
def get_asistencia_cumplimientoHorarioPrimerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada = (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND  (aa.a_horasalida >= (select ho_horasalida FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-01-01', '2022-03-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cumplimiento de Horario segundo trimestre
@app.get('/api/asistencia/cumplimientoHorarioSegundoTrimestre/<id>')
def get_asistencia_cumplimientoHorarioSegundoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada = (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND  (aa.a_horasalida >= (select ho_horasalida FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-04-01', '2022-06-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cumplimiento de Horario tercer trimestre
@app.get('/api/asistencia/cumplimientoHorarioTercerTrimestre/<id>')
def get_asistencia_cumplimientoHorarioTercerTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada = (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND  (aa.a_horasalida >= (select ho_horasalida FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-07-01', '2022-09-30'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Cumplimiento de Horario cuarto trimestre
@app.get('/api/asistencia/cumplimientoHorarioCuartoTrimestre/<id>')
def get_asistencia_cumplimientoHorarioCuartoTrimestre(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('select count(*) FROM asistencia aa,empleado e where ((aa.em_clave = %s) and (e.em_clave = %s)) AND  (aa.a_horaentrada = (select ho_horaentrada FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND  (aa.a_horasalida >= (select ho_horasalida FROM horario where e.em_clave = em_clave and ho_dia = aa.a_dia)) AND (aa.a_fecha between %s and %s)', (id, id, '2022-10-01', '2022-12-31'))
    user = cur.fetchall()

    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return jsonify(user)

#Hora entrada promedio
@app.get('/api/asistencia/horaEntradaPROM/<id>')
def get_asistencia_horaEntradaPROM(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute(
        'select AVG(a_horaentrada) from asistencia where em_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str

#Hora salida promedio
@app.get('/api/asistencia/horaSalidaPROM/<id>')
def get_asistencia_horaSalidaPROM(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute(
        'select AVG(a_horasalida) from asistencia where em_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str

#Hora entrada asignada
@app.get('/api/asistencia/horaEntradaAsignada/<id>')
def get_asistencia_horaEntradaAsignada(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute(
        'select ho_horaentrada, ho_dia from horario where em_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str

#Hora salida asignada
@app.get('/api/asistencia/horaSalidaAsignada/<id>')
def get_asistencia_horaSalidaAsignada(id):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute(
        'select ho_horasalida, ho_dia from horario where em_clave = %s', (id,))
    user = cur.fetchall()

    json_str = json.dumps(user, default=str)
    if user is None:
        return jsonify(None)

    cur.close()
    conn.close()
    return json_str


@app.get('/')
def home():
    return send_file('static/index.html')

if __name__ == '__main__':
    app.run(debug=True)
