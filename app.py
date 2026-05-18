from flask import Flask, render_template, request, redirect, session, url_for, jsonify
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file (for local development)
load_dotenv()

app = Flask(__name__)
app.secret_key = "your_secret_key"

def get_db_connection():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("WARNING: DATABASE_URL not found. Database connection will fail.")
        return None
    try:
        conn = psycopg2.connect(db_url)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# Function to Create Profile Table
def create_tables():
    conn = get_db_connection()
    if not conn:
        print("Could not connect to database for create_tables")
        return
    try:
        sqr = conn.cursor()
        sqr.execute("""CREATE TABLE IF NOT EXISTS profile (
            Name VARCHAR(30), 
            Email VARCHAR(50) PRIMARY KEY, 
            Password VARCHAR(50),
            Gender VARCHAR(10),
            Mobile VARCHAR(20),
            Country VARCHAR(50)
        )""")
        
        # Safely alter existing table to add columns if they don't exist
        sqr.execute("SELECT column_name FROM information_schema.columns WHERE table_name='profile'")
        columns = [info[0] for info in sqr.fetchall()]
        
        if 'gender' not in columns and 'Gender' not in columns:
            sqr.execute("ALTER TABLE profile ADD COLUMN Gender VARCHAR(10)")
        if 'mobile' not in columns and 'Mobile' not in columns:
            sqr.execute("ALTER TABLE profile ADD COLUMN Mobile VARCHAR(20)")
        if 'country' not in columns and 'Country' not in columns:
            sqr.execute("ALTER TABLE profile ADD COLUMN Country VARCHAR(50)")
            
        conn.commit()
    except Exception as err:
        print(f"Error updating profile schema: {err}")
    finally:
        conn.close()

# Try to initialize tables on startup
create_tables()

# Function to Create User-Specific History Table
def create_user_table(email):
    conn = get_db_connection()
    if not conn: return
    try:
        sqr = conn.cursor()
        table_name = email.replace("@", "_").replace(".", "_")

        sqr.execute("SELECT table_name FROM information_schema.tables WHERE table_name=%s", (table_name,))
        result = sqr.fetchone()

        if not result:  # Only create if the table doesn't exist
            sqr.execute(f'DROP TABLE IF EXISTS "{table_name}"')  
            sqr.execute(f"""CREATE TABLE "{table_name}" (
                ID SERIAL PRIMARY KEY,
                Date_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                Car FLOAT, PublicTransport FLOAT, Flight FLOAT,
                Electricity FLOAT, LPG FLOAT, NaturalGas FLOAT, Clothing FLOAT, Electronics FLOAT, PlasticWaste FLOAT,
                FoodWaste FLOAT, TreesPlanted FLOAT, RenewableEnergy FLOAT,
                Total FLOAT
            )""")
            conn.commit()
        else:
            # Check if NaturalGas column exists for existing users
            sqr.execute("SELECT column_name FROM information_schema.columns WHERE table_name=%s", (table_name,))
            columns = [info[0] for info in sqr.fetchall()]
            if 'naturalgas' not in columns and 'NaturalGas' not in columns:
                sqr.execute(f'ALTER TABLE "{table_name}" ADD COLUMN NaturalGas FLOAT DEFAULT 0')
                conn.commit()
    except Exception as err:
        print(f"Error checking/adding NaturalGas column: {err}")
    finally:
        conn.close()

# Default Home Route (Redirects to Dashboard)
@app.route("/")
def home():
    if "email" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("cover"))

# Dashboard Route (index.html)
@app.route("/dashboard")
def dashboard():
    if "email" not in session:
        return redirect(url_for("cover"))  # Redirect to login page if not logged in
    return render_template("index.html")

# Education Page
@app.route("/education")
def education():
    return render_template("education.html")

# History Page
@app.route("/history")
def history():
    return render_template("history.html")

# Profile Page
@app.route("/profile")
def profile():
    return render_template("profile.html")

# Cover Page (Login/Signup)
@app.route("/cover")
def cover():
    error = request.args.get("error")
    return render_template("cover.html", error=error)

# Login Page
@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]

    conn = get_db_connection()
    if not conn:
        return "Internal Server Error: Database Connection Failed", 500
    try:
        sqr = conn.cursor()
        sqr.execute("SELECT Email FROM profile WHERE Email=%s AND Password=%s", (email, password))
        user = sqr.fetchone()
        
        if user:
            session["email"] = email  # Store user session
            return redirect(url_for("dashboard"))  # Redirect to index.html (Dashboard)
        else:
            return redirect(url_for("cover", error="invalid_login"))
    except Exception as e:
        print(e)
        return "Internal Server Error", 500
    finally:
        conn.close()


@app.route("/signup", methods=["POST"])
def signup():
    try:
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        gender = request.form.get("gender", "")
        mobile = request.form.get("mobile", "")
        country = request.form.get("country", "")

        conn = get_db_connection()
        if not conn:
            return "Internal Server Error: Database Connection Failed", 500
        
        try:
            sqr = conn.cursor()
            # Check if the user already exists
            sqr.execute("SELECT Email FROM profile WHERE Email=%s", (email,))
            existing_user = sqr.fetchone()

            if existing_user:
                return redirect(url_for("cover", error="already_registered"))

            # Insert the new user into the profile table
            sqr.execute("INSERT INTO profile (Name, Email, Password, Gender, Mobile, Country) VALUES (%s, %s, %s, %s, %s, %s)", 
                        (name, email, password, gender, mobile, country))
            conn.commit()
            
            create_user_table(email)  # Create a personal emissions table for the user

            session["email"] = email  # Store user session
            return redirect(url_for("dashboard"))  # Redirect to index.html after signup
            
        finally:
            conn.close()

    except Exception as e:
        print(f"General Error: {e}")  # Debugging line
        return f"Something went wrong. Please try again. Error: {e}"


@app.route("/calculator", methods=["GET", "POST"])
def calculator():
    if "email" not in session:
        return redirect(url_for("cover"))  # Redirect to login if not logged in

    email = session["email"]
    table_name = email.replace("@", "_").replace(".", "_")  # Convert email to a safe table name
    days_left = 0
    
    conn = get_db_connection()
    if not conn:
        return "Internal Server Error: Database Connection Failed", 500
        
    try:
        sqr = conn.cursor()
        sqr.execute(f'SELECT CAST(EXTRACT(EPOCH FROM (NOW() - Date_Time)) / 86400 AS INTEGER) FROM "{table_name}" ORDER BY Date_Time DESC LIMIT 1')
        last_calc = sqr.fetchone()
        if last_calc and last_calc[0] is not None:
            days_passed = last_calc[0]
            if days_passed < 15:
                days_left = 15 - days_passed
    except Exception as e:
        print("Error checking calculation dates:", e)

    if request.method == "POST":
        if days_left > 0:
            conn.close()
            return redirect(url_for("calculator")) # Block POST if restricted

        # Initialize emission storage with correct length
        usage = [0] * 12 # Updated from 13 to 12

        # Car Emission
        if "car_distance" in request.form:
            fuel_type = request.form["fuel_type"]
            car_distance = float(request.form["car_distance"])
            fuel_emission = {"petrol": 0.20, "diesel": 0.25, "CNG": 0.10}
            usage[0] = car_distance * fuel_emission.get(fuel_type, 0)

        # Public Transport
        if "public_distance" in request.form:
            transport_type = request.form["transport_type"]
            transport_emission = {"bus": 0.07, "train": 0.05, "metro": 0.04}
            usage[1] = float(request.form["public_distance"]) * transport_emission.get(transport_type, 0)

        # Flights
        if "flight_distance" in request.form:
            flight_distance = float(request.form["flight_distance"])
            flight_type = request.form["flight_type"]
            usage[2] = flight_distance * (250 if flight_type == "short-haul" else 1000)

        # Other Emissions
        categories = ["electricity", "lpg", "natural_gas", "clothes", "electronics", "plastic_waste", "food_waste", "trees_planted", "renewable_energy"]
        emission_factors = [0.5, 2.98, 1.85, 50, 70, 2.5, 0.9, -20, -0.5]

        for i, category in enumerate(categories):
            usage[i + 3] = float(request.form.get(category, 0)) * emission_factors[i]

        total_emission = round(sum(usage), 2)

        # Log the full SQL query with parameters
        sql_query = f"""INSERT INTO "{table_name}" 
        (Car, PublicTransport, Flight, Electricity, LPG, NaturalGas, Clothing, Electronics, PlasticWaste, FoodWaste, TreesPlanted, RenewableEnergy, Total)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        try:
            sqr.execute(sql_query, usage + [total_emission])
            conn.commit()
        except Exception as e:
            print("Error saving calculation:", e)
        finally:
            conn.close()

        return redirect(url_for("result", total=total_emission))

    conn.close()
    return render_template("calculator.html", days_left=days_left)

@app.route("/get_dashboard_data")
def get_dashboard_data():
    if "email" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    email = session["email"]
    table_name = email.replace("@", "_").replace(".", "_")

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database Connection Failed"}), 500

    try:
        sqr = conn.cursor()
        sqr.execute(f'SELECT COUNT(*), SUM(Total) FROM "{table_name}"')
        result = sqr.fetchone()
        count = result[0] if result and result[0] is not None else 0
        total_emissions = round(result[1], 2) if result and result[1] is not None else 0

        sqr.execute(f'SELECT Total FROM "{table_name}" ORDER BY Date_Time DESC LIMIT 1')
        last_record = sqr.fetchone()
        last_emission = round(last_record[0], 2) if last_record else 0

        notify_calc_due = False
        if count > 0:
            sqr.execute(f'SELECT CAST(EXTRACT(EPOCH FROM (NOW() - Date_Time)) / 86400 AS INTEGER) FROM "{table_name}" ORDER BY Date_Time DESC LIMIT 1')
            last_calc_days = sqr.fetchone()
            if last_calc_days and last_calc_days[0] is not None:
                if last_calc_days[0] >= 15:
                    notify_calc_due = True
        else:
            notify_calc_due = True

        return jsonify({
            "total_calculations": count,
            "total_emissions": total_emissions,
            "last_emission": last_emission,
            "notify_calc_due": notify_calc_due
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/get_history")
def get_history():
    if "email" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    email = session["email"]
    table_name = email.replace("@", "_").replace(".", "_")
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database Connection Failed"}), 500

    try:
        sqr = conn.cursor()
        sqr.execute(f'SELECT COUNT(*) FROM "{table_name}"')
        count = sqr.fetchone()[0]

        if count < 3:
            return jsonify({"error": "Calculate your emissions at least 3 times to unlock your history graph!"}), 400

        sqr.execute(f'SELECT Date_Time, Total FROM "{table_name}" ORDER BY Date_Time ASC')
        records = sqr.fetchall()

        history_data = [{"date": r[0].strftime('%Y-%m-%d %H:%M:%S') if r[0] else None, "total": r[1]} for r in records]
        return jsonify(history_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/get_profile")
def get_profile():
    if "email" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    email = session["email"]
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database Connection Failed"}), 500
        
    try:
        sqr = conn.cursor()
        sqr.execute("SELECT Name, Email, Gender, Mobile, Country FROM profile WHERE Email=%s", (email,))
        user = sqr.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Badge Logic based on Absolute Thresholds
        table_name = email.replace("@", "_").replace(".", "_")
        try:
            sqr.execute(f'SELECT Total FROM "{table_name}" ORDER BY Date_Time DESC LIMIT 1')
            user_res = sqr.fetchone()
            user_avg = user_res[0] if user_res and user_res[0] is not None else 0
        except Exception:
            user_avg = 0
            
        if user_avg == 0:
            badge = "No Calculations Yet"
            badge_image = "/static/images/badges/copper_shield.png"
            badge_id = "badge-1"
        elif user_avg <= 100:
            badge = "Master Shield"
            badge_image = "/static/images/badges/master_shield.png"
            badge_id = "badge-8"
        elif user_avg <= 250:
            badge = "Diamond Shield"
            badge_image = "/static/images/badges/diamond_shield.png"
            badge_id = "badge-7"
        elif user_avg <= 500:
            badge = "Platinum Shield"
            badge_image = "/static/images/badges/platinum_shield.png"
            badge_id = "badge-6"
        elif user_avg <= 750:
            badge = "Gold Shield"
            badge_image = "/static/images/badges/gold_shield.png"
            badge_id = "badge-5"
        elif user_avg <= 1000:
            badge = "Silver Shield"
            badge_image = "/static/images/badges/silver_shield.png"
            badge_id = "badge-4"
        elif user_avg <= 1500:
            badge = "Iron Shield"
            badge_image = "/static/images/badges/iron_shield.png"
            badge_id = "badge-3"
        elif user_avg <= 2000:
            badge = "Bronze Shield"
            badge_image = "/static/images/badges/bronze_shield.png"
            badge_id = "badge-2"
        else:
            badge = "Copper Shield"
            badge_image = "/static/images/badges/copper_shield.png"
            badge_id = "badge-1"

        return jsonify({
            "name": user[0],
            "email": user[1],
            "gender": user[2] if user[2] else "Not Specified",
            "mobile": user[3] if user[3] else "Not Specified",
            "country": user[4] if user[4] else "Not Specified",
            "badge": badge,
            "badge_image": badge_image,
            "badge_id": badge_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Show Emission Results
@app.route("/result")
def result():
    total_emission = request.args.get("total")
    return render_template("result.html", total_emission=total_emission)

# Logout (Redirect to Cover Page)
@app.route("/logout")
def logout():
    session.pop("email", None)
    return redirect(url_for("cover"))

if __name__ == "__main__":
    app.run(debug=True)