require('dotenv/config');

const ENV = process.env

async function connectDB() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection(ENV.DATABASE_URL);
    global.connection = connection
    return connection
}

const selectTable = async (tabela) => {
    const conn = await connectDB()
    return await conn.query(`SELECT * FROM ${tabela}`).then(res => {return res[0]})
}

const sqlTable = (tabela, data) => {
    let sql
    let values 
    switch (tabela) {
        case 'usuarios':
            sql = "INSERT INTO usuarios(nome, email, cpf, tipo) VALUES (?,?,?,?);"
            values = [data.nome, data.email, data.cpf, data.tipo]
            break;
    
        case 'empresa':
            sql = "INSERT INTO empresa(nome) VALUES (?);"
            values = [data.nome]
            break;

        case 'clientes':
            sql = "INSERT INTO clientes(idEmpresa, nome, DataNascimento, email, Telefone1, Telefone2) VALUES (?,?,?,?,?,?);"
            values = [data.idEmpresa, data.nome, data.dataNascimento, data.email, data.telefone1, data.telefone2]
            break;

        case 'agenda':
            sql = "INSERT INTO agenda(idEmpresa, valor) VALUES (?,?);"
            values = [data.idEmpresa, data.valor]
            break

        case 'itens':
            sql = "INSERT INTO itens(idAgenda, idServico, idEmpresa, valor) VALUES (?,?,?,?);"
            values = [data.idAgenda, data.idServico, data.idEmpresa, data.valor]
            break

        case 'servicos':
            sql = "INSERT INTO servicos(idEmpresa, nome, valor, descricao, duracao, foto) VALUES (?,?,?,?,?,?);"
            values = [data.idEmpresa, data.nome, data.valor, data.descricao, data.duracao, data.foto]
            break
    }

    return [sql,values]
}

const addInTable = async (tabela, data) => {
    const sql = sqlTable(tabela, data)
    const conn = await connectDB()
    await conn.query(sql[0], sql[1]);
    return await conn.query(`SELECT LAST_INSERT_ID()`)
}

const removeOfTable = async (tabela, id) => {
    const conn = await connectDB()
    return await conn.query(`DELETE FROM ${tabela} WHERE id = ${id}`)
}

const dataQuery = async (tabela, filter) => {
    const conn = await connectDB()
    return { 
        clientes: await conn.query(`SELECT * FROM clientes`).then(res => {return res[0]}), 
        agenda: await conn.query(`SELECT * FROM agenda`).then(res => {return res[0]}), 
        itens: await conn.query(`SELECT * FROM itens`).then(res => {return res[0]}), 
        servicos: await conn.query(`SELECT * FROM servicos`).then(res => {return res[0]})
    }
}

// const uuu = async () => {
//     const conn = await connectDB()
//     await conn.query('DROP TABLE SequelizeMeta')
//     await conn.query('DROP TABLE usuarios')
//     await conn.query('DROP TABLE clientes')
// }
// uuu()

module.exports = { connectDB, selectTable, addInTable, removeOfTable, dataQuery};
