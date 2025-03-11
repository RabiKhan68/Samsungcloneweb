<?php
$servername = "localhost"; //your server name
$username = "root"; //your username
$password = ""; //your password
$dbname = "samsung"; //your database name

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} //if there is a problem connecting to the database

// Process form data only if POST request is detected
if ($_SERVER["REQUEST_METHOD"] == "POST") {  //requesting from the POST
    if (isset($_POST['email'], $_POST['password'], $_POST['name'], $_POST['dob'])) {
        // Sanitize input to prevent SQL injection
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL); //santize input to prevent SQL injection
        $name = htmlspecialchars($_POST['name']);
        $dob = htmlspecialchars($_POST['dob']);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Secure password hashing //top security

        // Prepare the SQL query
        $sql = "INSERT INTO account (email, password, name, dob) VALUES (?, ?, ?, ?)"; //values will be entered by the user so, this is unknown
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $email, $password, $name, $dob); //this is the top security against the hacker

        if ($stmt->execute()) {
            // Redirect user after successful submission
            header("Location: Samsungstore.html");  //redirect to the samsungstore page
            die();
        } else {
            echo "<p style='color:red;'>Error: " . $stmt->error . "</p>";  //else give an error
        }
        
        $stmt->close();
    } else {
        echo "<p style='color:red;'>Error: All fields are required!</p>";  //if the user didn't input the values
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account</title>
    <link rel = "icon" type= "image/png" href= "samsungo.png">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .form-container {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            text-align: center;
        }

        .form-container h2 {
            margin-bottom: 20px;
        }

        input {
            width: 90%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }

        input[type="submit"] {
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
        }

        input[type="submit"]:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

<div class="form-container">
    <h2>Account Registration</h2>
    <form name="account" action="" method = "POST">
        <input type="email" name="email" required placeholder="Email">
        <input type="password" name="password" required placeholder="Password">
        <input type="text" name="name" required placeholder="Name">
        <input type="date" name="dob" required placeholder="Date of birth">
        <input type="submit" value="Submit">
    </form>
</div>

</body>
</html>
