// ================= SUPABASE SETUP =================
const supabaseUrl = 'https://eorrsbggsffcegnoqgsh.supabase.co';
const supabaseKey = 'sb_publishable_GxcErKVNbLguR_OW2hWG_Q_ZiP-rjFt';
const supa = supabase.createClient(supabaseUrl, supabaseKey);

// ================= REGISTER =================
const registerForm = document.getElementById('register-form');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const { error } = await supa.auth.signUp({ email, password });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Success! Check your email for verification.");
    }
  });
}

// ================= GOOGLE LOGIN =================
const googleBtn = document.getElementById('google-login');

if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    const { error } = await supa.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: "https://nafay-developer.github.io/JS-Final-Exam/appointment.html"
      }
    });

    if (error) {
      alert("Google Sign-In Error: " + error.message);
    }
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { error } = await supa.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login Failed: " + error.message);
    } else {
      alert("Login Successful!");
      window.location.href = './appointment.html';
    }
  });
}

// ================= LOGOUT =================
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const { error } = await supa.auth.signOut();

    if (error) {
      alert("Logout Error: " + error.message);
    } else {
      alert("Logged out successfully!");
      window.location.href = 'register.html';
    }
  });
}

// ================= APPOINTMENT BOOKING =================
const appointmentForm = document.getElementById('appointment-form');

if (appointmentForm) {
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { data: { user } } = await supa.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const appointmentData = {
      patient_name: document.getElementById('patientName').value,
      doctor: document.getElementById('doctorSelect').value,
      date: document.getElementById('visitDate').value,
      time: document.getElementById('visitTime').value,
      reason: document.getElementById('reason').value,
      status: 'Confirmed',
      user_id: user.id
    };

    const { error } = await supa
      .from('appointments')
      .insert([appointmentData]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Appointment booked successfully!");
      appointmentForm.reset();
      fetchAppointments();
    }
  });
}

// ================= FETCH APPOINTMENTS =================
async function fetchAppointments() {
  const listDiv = document.getElementById('appointments-list');
  if (!listDiv) return;

  const { data: { user } } = await supa.auth.getUser();
  if (!user) return;

  const { data, error } = await supa
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  listDiv.innerHTML = data.map(app => `
    <div class="card">
      <h4>Doctor: ${app.doctor}</h4>
      <p><b>Patient:</b> ${app.patient_name}</p>
      <p><b>When:</b> ${app.date} at ${app.time}</p>
      <p><b>Reason:</b> ${app.reason}</p>
      <button 
        onclick="cancelAppointment(${app.id})"
        style="background:red; margin-top:10px;">
        Cancel Appointment
      </button>
    </div>
  `).join('');
}

fetchAppointments();

// ================= CANCEL APPOINTMENT =================
async function cancelAppointment(id) {
  const confirmCancel = confirm("Are you sure you want to cancel?");

  if (!confirmCancel) return;

  const { error } = await supa
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Appointment cancelled.");
    fetchAppointments();
  }
}
