var webstore = openDatabase('ehealth', '1.0', 'demo', 5*1024*1024);
var locstore = window.localStorage ;

function patientRegister() {
    var name = document.getElementById("name").value;
    var age  = document.getElementById("age").value;
    var phno = document.getElementById("phno").value ;
    var mail = document.getElementById("mail").value;
    var pwrd = document.getElementById("pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS PATIENTS (name VARCHAR(50), age INT, phone INT, email VARCHAR(100), password VARCHAR(50), PRIMARY KEY (email))');
        tx.executeSql('INSERT INTO PATIENTS VALUES (?,?,?,?,?)', [name, age, phno, mail, pwrd]);
    });

    alert(mail, pwrd);

    window.location.href = "index.html";
}

function doctorRegister() {
    var name = document.getElementById("name").value;
    var age  = document.getElementById("age").value;
    var phno = document.getElementById("phno").value;
    var mail = document.getElementById("mail").value;
    var regid = document.getElementById("regid").value;
    var pwrd = document.getElementById("pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS DOCTORS (name VARCHAR(50), age INT, phone INT, email VARCHAR(100), registration_id VARCHAR(50), password VARCHAR(50), PRIMARY KEY (email))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS APPOINTMENT (email VARCHAR(50), sun INT, mon INT, tue INT, wed INT, thu INT, fri INT, sat INT, PRIMARY KEY (email))');

        tx.executeSql('INSERT INTO DOCTORS VALUES (?,?,?,?,?,?)', [name, age, phno, mail, regid, pwrd]);
        tx.executeSql('INSERT INTO APPOINTMENT VALUES (?,?,?,?,?,?,?,?)', [mail, '0', '0', '0', '0', '0', '0', '0']);
    });

    alert(mail, pwrd);

    window.location.href = "index.html";
}

function patientLogin() {
    var mail = document.getElementById("patient_mail").value;
    var pwrd = document.getElementById("patient_pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM PATIENTS WHERE email = ? AND password = ?', [mail, pwrd], function(tx, results) {
            var len = results.rows.length;

            if (len == 1) {
                locstore.setItem("user", "patient")
                locstore.setItem("mail", mail);

                var name = results.rows.item(0).name;
                locstore.setItem("name", name);

                window.location.href = "patient_home.html";
            }
            else {
                alert('error');

                var msg = "error";
                // make use of this later
            }
        }, null);
    });
}

function doctorLogin() {
    var mail = document.getElementById("doctor_mail").value;
    var pwrd = document.getElementById("doctor_pwrd").value;

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM DOCTORS WHERE email = ? AND password = ?', [mail, pwrd], function(tx, results) {
            var len = results.rows.length;

            if (len == 1) {
                locstore.setItem("user", "doctor");
                locstore.setItem("mail", mail);

                var name = results.rows.item(0).name;
                locstore.setItem("name", name);

                window.location.href = "doctor_home.html";
            }
            else {
                alert('error');

                var msg = "error";
                // make use of this later
            }
        }, null);
    });
}


function patientForgotPwd() {
    var mail = document.getElementById("mail").value;
    var npwd = document.getElementById("npwd").value;

    webstore.transaction( function(tx) {
        tx.executeSql('UPDATE PATIENTS SET password = ? WHERE email = ?', [npwd ,mail]);
    });

    window.location.href = "index.html";
}

function doctorForgotPwd() {
    var mail = document.getElementById("mail").value;
    var npwd = document.getElementById("npwd").value;

    webstore.transaction( function(tx) {
        tx.executeSql('UPDATE DOCTORS SET password = ? WHERE email = ?', [npwd ,mail]);
    });

    window.location.href = "index.html";
}


function logout() {
    locstore.clear();

    window.location.href = 'index.html';
}

// navbars 
function openNav() {
    document.getElementById('sidenav').style.width = "80%";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById("header").style.backgroundColor = "rgba(0,128,0,0.4)"
    document.getElementById("profile_header").style.backgroundColor = "rgba(0,128,0,0.4)"
}

function closeNav() {
    document.getElementById('sidenav').style.width = "0";
    document.body.style.backgroundColor = "#f0f0f0";
    document.getElementById("header").style.backgroundColor = "green"
    document.getElementById("profile_header").style.backgroundColor = "green"

}

// toggle login pages 

function showDoctorLogin() {
    document.getElementById("patient").style.right = "100%";
    document.getElementById("doctor").style.right  = "0";
}

function showPatientLogin() {
    document.getElementById("doctor").style.right  = "100%";
    document.getElementById("patient").style.right = "0";
}

// patient home page

function getDoctors() {
    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM DOCTORS', [], function(tx, results) {
            var len = results.rows.length;
            var i;

            for (i = 0; i < len; i++) {
                var name = results.rows.item(i).name;
                var mail = results.rows.item(i).email;
                var func = "displayDocProfile('" +mail+ "')";

                name = toTitleCase(name);

                var container = '';
                container += '<div class="doc" onclick="' +func+ '">';
                container += '<div class="img">';
                container += '</div>';
                container += '<div class="name">';
                container += 'Dr. ' + name;
                container += '</div>';
                container += '<a href="#">Book an appointment</a>';
                container += '</div>';

                document.getElementById('doc_container').innerHTML += container;
            }
        });
    });
}

// first letter of each word made capital
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
} 

// doctor profile

function displayDocProfile(mail) {
    locstore.setItem("docmail", mail);
    document.location.href = 'patient_docprofile.html';
}

function getDoctorDetails() {
    var mail = locstore.getItem("docmail");
    locstore.removeItem("docmail");

    webstore.transaction(function(tx) {
        tx.executeSql('SELECT * FROM DOCTORS WHERE email = ?', [mail], function(tx, results) {
            var name = results.rows.item(0).name;

            document.getElementById("profile_name").innerHTML = "Dr. " +name; 

        });
    });
}