const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()

app.use(bodyparser.json())
app.use(cors())

const port = 8000

let conn = null 

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tutorial',
        port: 3306
    })
}

const validateData = (userData) => {
    let errors = []

    if (!userData.firstname){
        errors.push('กรุณาใส่ชื่อจริง')
    }

    if (!userData.lastname){
        errors.push('กรุณาใส่นามสกุล')
    }

    if (!userData.age){
        errors.push('กรุณาใส่อายุ')
    }

    if (!userData.gender){
        errors.push('กรุณาใส่เพศ')
    }

    if (!userData.interests){
        errors.push('กรุณาใส่สิ่งที่สนใจ')
    }

    if (!userData.description){
        errors.push('กรุณาใส่รายละเอียดของคุณ')
    }

    return errors
}

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async(req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})

// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
    try {
        let user = req.body

        const errors = validateData(user)
        if(errors.length > 0){
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'insert OK',
            data: results[0]
        })
    } catch (error) {
        const errorMessage = error.message || 'something wrong'
        const errors = error.errors || []
        console.error('error message', error.message);
        res.status(500).json({
            message: errorMessage,
            errors: errors
        })
    }
    
})

// GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', async(req, res) => {
    try{
        let id = req.params.id
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)

        if(results[0].length == 0){
            throw {statusCode: 404, message: 'หาไม่เจอ'}
        }else{
            res.json(results[0][0])
        }
    }catch (error){
        console.error('error message', error.message);
        let statusCode = error.statusCode || 500
        res.status(500).json({
            message: 'something wrong'
        })
    }
})

// path = PUT / user/:id
app.put('/users/:id', async(req, res) => {
    try {
        let id = req.params.id
        let updateUser = req.body
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id])
        res.json({
            message: 'update OK',
            data: results[0]
        })
    } catch (error) {
        console.error('error message', error.message);
        res.status(500).json({
            message: 'something wrong'
        })
    }

    
})

// path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.path('/user/:id', (req, res) => {
    let id = req.params.id
    let updateUser = req.body

    // ค้นหาข้อมูล users
    let selectedIndex = users.findIndex(user => user.id == id) 

    // update ข้อมูล user
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
    users[selectedIndex].age = updateUser.age || users[selectedIndex].age
    users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender


    res.json({
        message: 'update user complete',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })

    res.send(selectedIndex + '')
})

//path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', async(req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('DELETE from users WHERE id = ?', id)
        res.json({
            message: 'delete OK',
            data: results[0]
        })
    } catch (error) {
        console.error('error message', error.message);
        res.status(500).json({
            message: 'something wrong' 
        })
    }
})

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log('http server run at ' + port);
})