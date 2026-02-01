
const supabaseUrl = 'https://eorrsbggsffcegnoqgsh.supabase.co';
const supabaseKey = 'sb_publishable_GxcErKVNbLguR_OW2hWG_Q_ZiP-rjFt'
const supa = supabase.createClient(supabaseUrl,supabaseKey)

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        const { data, error } = await supa.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Success! User created. Check your email or Supabase dashboard.");
        }
    });
}

const googleBtn = document.getElementById('google-login');

if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        const { data, error } = await supa.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // This redirects the user back to your appointment page after login
                redirectTo: window.location.href = "https://nafay-developer.github.io/JS-Final-Exam/appointment.html";
            }
        });

        if (error) {
            alert("Google Sign-In Error: " + error.message);
        }
    });
}


const appointmentForm = document.getElementById('appointment-form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const appointmentData = {
            patient_name: document.getElementById('patientName').value,
            doctor: document.getElementById('doctorSelect').value,
            date: document.getElementById('visitDate').value,
            time: document.getElementById('visitTime').value,
            reason: document.getElementById('reason').value,
            status: 'Confirmed'
        };

        const { data, error } = await supa.from('appointments').insert([appointmentData]);

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Success! Your appointment is booked.Scroll down to view the details of your appointment.");
            appointmentForm.reset();
            fetchAppointments();
        }
    });
}


async function fetchAppointments() {
    const listDiv = document.getElementById('appointments-list');
    if (!listDiv) return;

    const { data, error } = await supa.from('appointments').select('*').order('created_at', { ascending: false });
    if (data) {
        listDiv.innerHTML = data.map(app => `
            <div class="card">
                <h4>Doctor: ${app.doctor}</h4>
                <p><b>Patient:</b> ${app.patient_name}</p>
                <p><b>When:</b> ${app.date} at ${app.time}</p>
                <p><b>Reason:</b> ${app.reason}</p>
                <button onclick="cancelAppointment(${app.id})" style="background: red; margin-top: 10px;">Cancel Appointment</button>
            </div>
        `).join('');
    }
}
fetchAppointments();




async function cancelAppointment(id) {
    const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
    
    if (confirmCancel) {
        const { error } = await supa
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Appointment cancelled successfully.");
            fetchAppointments(); 
        }
    }
}




const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        
        const { data, error } = await supa.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Login Failed: " + error.message);
        } else {
            alert("Login Successful! Redirecting...");
            // Redirect to your appointment booking page
            window.location.href = 'appointment.html'; 
        }
    });
}

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supa.auth.signOut(); // Using 'supa' to match your client name

        if (error) {
            alert("Error logging out: " + error.message);
        } else {
            alert("Logged out successfully!");
            window.location.href = 'register.html'; // Redirect to login
        }
    });

}
