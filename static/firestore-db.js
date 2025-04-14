const userDetails  = document.querySelector('.userDetails')
const isLogin  = document.querySelector('.isLogin')
const editProfile  = document.querySelector('#editProfile')


function createUserCollection(user){
   firebase.firestore().collection('users')
   .doc(user.uid)
   .set({
       uid:user.uid,
	     pa:user.pa,
       name:user.displayName, 
       email:user.email,
       phone:"",
       specialty:"",
       portfolioUrl:"",
       experience:""
   })
}


async function getuserInfo(userID){
    if(userID){
      const userInfoSnap = await  firebase.firestore()
    .collection('users')
    .doc(userID)
    .get()

   const userInfo = userInfoSnap.data()
   if(userInfo){
       userDetails.innerHTML = `
       <h3>${userInfo.name}</h3>
       <h3>${userInfo.email}</h3>
       <h3>${userInfo.phone}</h3>
       `
   }    
    }else{
        userDetails.innerHTML = `
        <h3>please login</h3>
        `
    }
}
								 


async function getuserInfoRealtime(userID){
    if(userID){
      const userdocRef = await  firebase.firestore()
        .collection('users')
        .doc(userID)
        userdocRef.onSnapshot((doc) =>{
            if(doc.exists){
                 const userInfo = doc.data()
                    if(userInfo){
                        userDetails.innerHTML = `
                        <ul class="collection">
                          <li class="collection-item"><h4>${userInfo.name}</h4></li>
                          <li class="collection-item"> <b> E-mail :  </b> ${userInfo.email}</li>
                          <li class="collection-item"> <b> phone : </b> ${userInfo.phone}</li>
                          <li class="collection-item"> <b> speciality : </b> ${userInfo.specialty}</li>
                          <li class="collection-item"> <b> Experience : </b> ${userInfo.experience}</li>
                          <li class="collection-item"> <b> portfolio : </b> <a href="${userInfo.portfolioUrl}" target="_blank">open</li>
                        </ul>
                        `
                        editProfile["name"].value = userInfo.name
                        editProfile["profileEmail"].value = userInfo.email
                        editProfile["phoneno"].value = userInfo.phone
                        editProfile["specialty"].value = userInfo.specialty
                        editProfile["prorfolioUrl"].value = userInfo.portfolioUrl
                        editProfile["experience"].value = userInfo.experience

                        if(firebase.auth().currentUser.photoURL){
                            document.querySelector('#proimg').src = firebase.auth().currentUser.photoURL
                            document.querySelector('#proimgb').src = firebase.auth().currentUser.photoURL
                        }


						isLogin.innerHTML = `  
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button class="btn btn-primary" data-bs-target="#modal_edituser" data-bs-toggle="modal">Edit Profile</button>
						`

                }    
             }
        })


    }else{
        userDetails.innerHTML = `<h3>please login</h3>`
        
		document.querySelector('#proimg').src= "/static/user.png"  
		document.querySelector('#proimgb').src= "/static/user.png" 
		
		isLogin.innerHTML = `  
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
		<button class="btn btn-primary"> <a id="loginli" data-bs-toggle="modal" data-bs-target="#modal_login" >Login</a></button>
		`
    }
}


function updateUserProfile(e){
    e.preventDefault()
    const userDocRef =  firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
	
    userDocRef.update({
        name:editProfile["name"].value,
        email:editProfile["profileEmail"].value,
        phone:editProfile["phoneno"].value,
        specialty:editProfile["specialty"].value,
        portfolioUrl:editProfile["prorfolioUrl"].value,
        experience:editProfile["experience"].value

    })
    M.Modal.getInstance(myModel[2]).close()
}


function uploadImage(e){
    console.log(e.target.files[0])
    const uid = firebase.auth().currentUser.uid
    const fileRef = firebase.storage().ref().child(`/users/${uid}/profile`)
    const uploadTask =  fileRef.put(e.target.files[0])
    uploadTask.on('state_changed', 
  (snapshot) => {
   var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if(progress=='100')  alert('uploaded'); 
  }, 
  (error) => {
   console.log(error)
  alert(error.message); 
  }, 
  () => {
    
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //  console.log('File available at', downloadURL);
      document.querySelector('#proimg').src = downloadURL
      document.querySelector('#proimgb').src = downloadURL
      firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL
      })
    });
  }
);
}



async function allUserDetails(){
  document.getElementById('table').style.display='table'
  const userRef = await firebase.firestore().collection('users').get()  
  userRef.docs.forEach(doc=>{
           const info =   doc.data()
           document.getElementById('tbody').innerHTML += `
           <tr>
            <td>${info.name}</td>
            <td>${info.email}</td>
            <td>${info.phone}</td>
            <td>${info.specialty}</td>
            <td>${info.experience}</td>
            <td><a href="${info.portfolioUrl}" target="_blank">view</td>
          </tr>
           `
    })
 
  
}