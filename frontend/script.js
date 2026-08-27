async function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await fetch("http://localhost:3000/auth/register",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );
    const data = await response.json();
    document.getElementById("message").innerText = data.message;
}
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;  
    const response = await fetch("http://localhost:3000/auth/login",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    document.getElementById("loginMessage").innerText = data.message;
    if(data.token){
        localStorage.setItem("token", data.token);
        console.log("JWT:",data.token);
    }
}