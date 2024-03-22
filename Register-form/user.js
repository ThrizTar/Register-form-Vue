const BASE_URL = 'http://localhost:8000'

// 2. นำ user ที่โหลดออกมาใส่กลับเข้าไปใน HTML
window.onload = async () =>{
    await loadData()
}

const loadData = async () => {
    console.log('on load');
    // 1. Load user ทั้งหมดออกมาจาก API
    const response = await axios.get(`${BASE_URL}/users`)

    console.log(response.data);

    const userDOM = document.getElementById('user') 

    // 2. นำ user ที่โหลดมาใส่กลับเข้าไปใน html
    let htmlData = '<div>'

    for (let i = 0; i < response.data.length; i++) {
        const user = response.data[i];
        htmlData += `<div>
            ${user.id} ${user.firstname} ${user.lastname}
            <a href='index.html?id=${user.id}'><button>Edit</button></a>
            <button class='delete' data-id='${user.id}'>Delete</button>
        </div>`
    }

    htmlData += '</div>'

    userDOM.innerHTML = htmlData

    const deleteDOMs = document.getElementsByClassName('delete')

    for (let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async(event) => {
            // ดึง id ออกมา
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData() // recursive function
            }catch(error){
                console.log('error', error);
            }
        })
        
    }
}