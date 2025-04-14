const myModel = document.querySelectorAll('.modal')

// Function to show the Bootstrap toast with custom content
function showToast(heading, body, color) {
  const toastHeading = document.getElementById('meauto');
  const toastBody = document.getElementById('toastbody');
  const toastLiveExample = document.getElementById('liveToast')

  // Update the content of the toast
  toastHeading.textContent = heading;
  toastBody.textContent = body;

  if (color === 'green') {
    toastLiveExample.classList.add('green-toast');
    toastLiveExample.classList.remove('red-toast');
  } else if (color === 'red') {
    toastLiveExample.classList.add('red-toast');
    toastLiveExample.classList.remove('green-toast');
  }

      
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
}


async function signup(e){
    e.preventDefault()
    const email  = document.querySelector('#signupEmail')
    const password  = document.querySelector('#signupPassword')
    const signModal = new bootstrap.Modal(document.getElementById('modal_signup'));
    try{
      const result = await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
      await result.user.updateProfile({
        displayName: "User"
      })
	  let Passw = document.getElementById("signupPassword").value;
        result.user.pa=Passw;
	 // console.log(result.user.pa)
      createUserCollection(result.user)
      // await result.user.sendEmailVerification()
      showToast('Signup', `welcome ${result.user.email}`,'green');
      signModal.hide();
    //  console.log("sign",result)       
    }catch(err){
        console.log(err)
        showToast('Signup',  err.message,'red');
        signModal.show();
    }
    email.value = ""
    password.value = ""
    M.Modal.getInstance(myModel[0]).close()
    
}
async function login(e){
    e.preventDefault()
    const email  = document.querySelector('#loginEmail')
    const password  = document.querySelector('#loginPassword')
    const loginModal = new bootstrap.Modal(document.getElementById('modal_login'));
    try{
      const result = await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
      showToast('User Login', 'Successfully', 'green');
      loginModal.hide();
    // console.log(result)  
    }catch(err){
        console.log(err)
        showToast('User Login', err.message, 'red');
        loginModal.show();
    }
    email.value = ""
    password.value = ""
    M.Modal.getInstance(myModel[1]).close()
}

function logout(){
    firebase.auth().signOut()

    showToast('User Logout', 'Successfully','green');

	 document.getElementById("logoutli").style.display = "block"
      document.getElementById("loginli").style.display = "none"
      document.getElementById("signupli").style.display = "none"
	 
    document.querySelector('#proimg').src= "/static/user.png"  
    document.querySelector('#proimgb').src= "/static/user.png" 

}

// get real time user data.
const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  const loginModal = new bootstrap.Modal(document.getElementById('modal_login'));
  
  if (user) {
    // User is logged in
    document.getElementById("loginli").style.display = "none";
    document.getElementById("signupli").style.display = "none";
    document.getElementById("logoutli").style.display = "block";
    
    // Close the login modal if open
    loginModal.hide();
    
    getuserInfoRealtime(user.uid);
    
    if (user.uid === 'TSS0ckznnpM2UkjxHIxp2Y8ivFc2') {
      allUserDetails();
    }
  } else {
    // User is not logged in
    getuserInfoRealtime(null);
    document.getElementById("logoutli").style.display = "none";
    document.getElementById("loginli").style.display = "block";
    document.getElementById("signupli").style.display = "block";
    
    // Show the login modal (only if not already open)
    if (!document.querySelector('#modal_login.show')) {
      loginModal.show();
    }
  }
});

function needLogin(){

  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    const loginModal = new bootstrap.Modal(document.getElementById('modal_login'));
    
    if (user) {
      // User is logged in
      document.getElementById("loginli").style.display = "none";
      document.getElementById("signupli").style.display = "none";
      document.getElementById("logoutli").style.display = "block";
      
      // Close the login modal if open
      loginModal.hide();
      
      getuserInfoRealtime(user.uid);
      
      if (user.uid === 'TSS0ckznnpM2UkjxHIxp2Y8ivFc2') {
        allUserDetails();
      }
    } else {
      // User is not logged in
      getuserInfoRealtime(null);
      document.getElementById("logoutli").style.display = "none";
      document.getElementById("loginli").style.display = "block";
      document.getElementById("signupli").style.display = "block";
      
      // Show the login modal (only if not already open)
      if (!document.querySelector('#modal_login.show')) {
        loginModal.show();
      }
    }
  });

}


// async function loginWithGoogle(){
//     try{
//     var provider = new firebase.auth.GoogleAuthProvider();
//     const result =  await firebase.auth().signInWithPopup(provider); 
//     // console.log(result)
// 	   createUserCollection(result.user);
//      showToast('Login With Google', 'Successfully','green');
//     }catch(err){
//         console.log(err)
//      showToast('Login With Google', err.message,'red');
//     }
// }
