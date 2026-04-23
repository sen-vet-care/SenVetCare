-- Database Schema for Dr. Tamal B. Sen Memorial Clinic

-- 1. Clinic Info Table
CREATE TABLE IF NOT EXISTS clinic_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    established YEAR,
    phone_primary VARCHAR(20),
    phone_secondary VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    qualifications TEXT,
    bio TEXT,
    availability_status VARCHAR(50),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price_min INTEGER,
    price_max INTEGER,
    duration_mins INTEGER,
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Blogs Table (Automated Pipeline Target)
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    language VARCHAR(20) DEFAULT 'en',
    author_id INTEGER REFERENCES doctors(id),
    read_time_mins INTEGER,
    image_url TEXT,
    seo_keywords TEXT[],
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    owner_name VARCHAR(100) NOT NULL,
    pet_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    service_id INTEGER REFERENCES services(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. SEO Keywords Strategy Table
CREATE TABLE IF NOT EXISTS seo_keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(150) NOT NULL UNIQUE,
    search_volume INTEGER,
    difficulty INTEGER,
    last_used DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Media Assets Table
CREATE TABLE IF NOT EXISTS media_assets (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    type VARCHAR(50), -- e.g., 'blog_img', 'logo', 'doctor_portrait'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
