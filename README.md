# 🐾 Pets Adoption Website  

**Live at:** [https://pets-adoption-b8d9.onrender.com](https://pets-adoption-b8d9.onrender.com)  

## 📖 Overview  
**Pets Adoption** is an **all-in-one platform for pet lovers** where users can:  
- Adopt pets 🐕  
- Volunteer for pets 🐾  
- Find veterinary doctors near them 🩺  
- Discover recommended pet food 🍲  
- Share and read resources from fellow pet owners 💬  
- And admins can efficiently manage the entire platform.  

The system ensures **secure login/signup authentication** for users, while providing a **dedicated admin panel** to manage adoption requests, volunteering, doctors, food, and resources.  

---

## ✨ Features  

### 🔑 Authentication  
- Secure **Login / Signup** for users.  
- Dedicated **Admin login** with role-based access.  

### 🏠 Home  
- Redirects users to the **main dashboard** after login.  

### 🐶 Adoption  
- Browse a list of pets available for adoption.  
- Each pet has a **photo, breed, age, and details**.  
- Option to **Adopt a pet** → reveals owner details (contact, address, etc.).  
- **Request for Adoption** form → submit pet details & upload certificate → request sent to admin.  

### 🤝 Volunteer  
- View pets available for volunteering with details (breed, period, requirements).  
- **Volunteer for a pet** → access owner’s details.  
- **Request for Volunteering** form → submit details & upload file → request sent to admin.  

### 🩺 Veterinary  
- **Filter doctors by location**.  
- View doctor profiles (photo, name, hospital, specialization, experience).  
- Admin can add new doctors → instantly visible to users.  

### 🍲 Pet Food  
- Recommended pet foods listed with **images, details, and suitable pets**.  
- Admin can add pet food recommendations → displayed to users in real-time.  

### 🛠 Manage Pets (Admin Panel)  
Admin-exclusive access with 5 main sections:  
1. **Adoption** → View & manage adoption requests (Accept / Dismiss).  
2. **Volunteer** → Manage volunteering requests (Accept / Dismiss).  
3. **Veterinary** → Add/update veterinary doctors.  
4. **Pet Food** → Add/update recommended pet foods.  
5. **Resources** → Manage user reviews (Delete if needed).  

### 📚 Resources  
- Users can **read reviews, tips, and pet-care stories** from others.  
- **Write a Review** option → submit name, pet info, and review → displayed publicly.  

---

## 🛠 Tech Stack  

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **ORM:** Sequelize  
- **Hosting:** Render  

---

## ⚙️ Installation & Setup  

1. Clone the repository  
   ```bash
   git clone https://github.com/navyasreeannem/pets-adoption.git
   cd pets-adoption/pets-adoption-website
2.Install dependencies
npm install
