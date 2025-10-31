import mysql from 'mysql2/promise';
process.loadEnvFile();


let conexion;

try {
  conexion = await mysql.createConnection({
    host: process.env.SQL_HOST,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER_ADMIN,
    password: process.env.SQL_PASSWORD_ADMIN,
  });

  console.log('✅ Conexión a la base de datos establecida correctamente');

} catch (error) {
  console.error('\n❌ Error al conectar con la base de datos');
  console.error('💡 Verifica que:');
  console.error('   - El servidor MySQL esté ejecutándose');
  console.error('   - Las credenciales en .env sean correctas');
  console.error(`   - La base de datos "${process.env.SQL_DATABASE}" exista`);
  console.error('   - El puerto MySQL esté disponible');
  console.error('\n📋 Detalles técnicos:', error.code || error.message);
  console.error('');
  process.exit(1);
}

export default conexion;