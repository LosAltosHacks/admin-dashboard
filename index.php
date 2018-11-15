<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Los Altos Hacks - Admin Dashboard</title>

  <link rel="stylesheet" type="text/css" href="/assets/css/fonts.css">
  <link rel="stylesheet" type="text/css" href="/assets/css/main.css">
</head>
<body>
  <div class="panel">
    <h1>Attendees List</h1>
    <div id="attendees-list">
      <div class="header">
        <ul>
          <li>Accepted?</li><li>
          First Name</li><li>
          Last Name</li><li>
          Email</li><li>
          Registration Date</li>
        </ul>
      </div>
      <div class="attendees-row">
        <details>
          <summary>
            <ul>
              <li>Yes/No</li><li>
              First Name</li><li>
              Last Name</li><li>
              mail@mail.com</li><li>
              00-00-00 00:00:00</li>
            </ul>
          </summary>
          <div class="attendees-details">
            <ul>
              <li class='gender'><b>Gender:</b> </li>
              <li class='age'><b>Age:</b> </li>
              <li class='school'><b>School:</b> </li>
              <li class='grade'><b>Grade:</b> </li>
              <li class='tel'><b>Phone Number:</b> </li>
              <li class='t-shirt'><b>T-Shirt Size:</b> </li>
              <li class='prev-hack'><b>Previous Hackathons:</b> </li>
            </ul>
            <ul>
              <li class='g-name'><b>Guardian Name:</b> </li>
              <li class='g-email'><b>Guardian Email:</b> </li>
              <li class='g-tel'><b>Guardian Phone Number:</b> </li>
            </ul>
            <ul>
              <li class='github-user'><b>GitHub Username:</b> </li>
              <li class='linkedin-prof'><b>LinkedIn Profile:</b> </li>
              <li class='diet-restrict'><b>Dietary Restrictions:</b> </li>
            </ul>
          </div>
        </details>
      </div>
      <div class="attendees-row">
        <details>
          <summary>
            <ul>
              <li>Yes/No</li><li>
              First Name</li><li>
              Last Name</li><li>
              mail@mail.com</li><li>
              00-00-00 00:00:00</li>
            </ul>
          </summary>
          <div class="attendees-details">
            <ul>
              <li class='gender'><b>Gender:</b> </li>
              <li class='age'><b>Age:</b> </li>
              <li class='school'><b>School:</b> </li>
              <li class='grade'><b>Grade:</b> </li>
              <li class='tel'><b>Phone Number:</b> </li>
              <li class='t-shirt'><b>T-Shirt Size:</b> </li>
              <li class='prev-hack'><b>Previous Hackathons:</b> </li>
            </ul>
            <ul>
              <li class='g-name'><b>Guardian Name:</b> </li>
              <li class='g-email'><b>Guardian Email:</b> </li>
              <li class='g-tel'><b>Guardian Phone Number:</b> </li>
            </ul>
            <ul>
              <li class='github-user'><b>GitHub Username:</b> </li>
              <li class='linkedin-prof'><b>LinkedIn Profile:</b> </li>
              <li class='diet-restrict'><b>Dietary Restrictions:</b> </li>
            </ul>
          </div>
        </details>
      </div>
      <div class="attendees-row">
        <details>
          <summary>
            <ul>
              <li>Yes/No</li><li>
              First Name</li><li>
              Last Name</li><li>
              mail@mail.com</li><li>
              00-00-00 00:00:00</li>
            </ul>
          </summary>
          <div class="attendees-details">
            <ul>
              <li class='gender'><b>Gender:</b> </li>
              <li class='age'><b>Age:</b> </li>
              <li class='school'><b>School:</b> </li>
              <li class='grade'><b>Grade:</b> </li>
              <li class='tel'><b>Phone Number:</b> </li>
              <li class='t-shirt'><b>T-Shirt Size:</b> </li>
              <li class='prev-hack'><b>Previous Hackathons:</b> </li>
            </ul>
            <ul>
              <li class='g-name'><b>Guardian Name:</b> </li>
              <li class='g-email'><b>Guardian Email:</b> </li>
              <li class='g-tel'><b>Guardian Phone Number:</b> </li>
            </ul>
            <ul>
              <li class='github-user'><b>GitHub Username:</b> </li>
              <li class='linkedin-prof'><b>LinkedIn Profile:</b> </li>
              <li class='diet-restrict'><b>Dietary Restrictions:</b> </li>
            </ul>
          </div>
        </details>
      </div>
      <?php
      require_once("./conf.ini.php");

      $curl = curl_init();

      curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_HTTPHEADER => array("Authorization: Bearer foobar"),
        CURLOPT_URL => "$host/registration/v1/list",
      ));

      $result = json_decode(curl_exec($curl), true);

      foreach ($result as $user) {
        echo "<div class='attendees-row' data-id='" . $user['user_id'] . "'><details><summary><ul>";
        echo "<li>" . ($user['acceptance_status'] == "none" ? "No" : "Yes") . "</li>";
        echo "<li>" . $user['first_name'] . "</li>";
        echo "<li>" . $user['surname'] . "</li>";
        echo "<li>" . $user['email'] . "</li>";
        echo "<li>" . $user['timestamp'] . "</li>";
        echo "</ul></summary><div class='attendees-details'><ul>";
        echo "<li class='gender'><b>Gender:</b> " . $user['gender'] . "</li>";
        echo "<li class='age'><b>Age:</b> " . $user['age'] . "</li>";
        echo "<li class='school'><b>School:</b> " . $user['school'] . "</li>";
        echo "<li class='grade'><b>Grade:</b> " . $user['grade'] . "</li>";
        echo "<li class='tel'><b>Phone Number:</b> " . $user['student_phone_number'] . "</li>";
        echo "<li class='t-shirt'><b>T-Shirt Size:</b> " . $user['tshirt_size'] . "</li>";
        echo "<li class='prev-hack'><b>Previous Hackathons:</b> " . $user['previous_hackathons'] . "</li>";
        echo "</ul><ul>";
        echo "<li class='g-name'><b>Guardian Name:</b> " . $user['guardian_name'] . "</li>";
        echo "<li class='g-email'><b>Guardian Email:</b> " . $user['guardian_email'] . "</li>";
        echo "<li class='g-tel'><b>Guardian Phone Number:</b> " . $user['guardian_phone_number'] . "</li>";
        echo "</ul><ul>";
        echo "<li class='github-user'><b>GitHub Username:</b> " . $user['github_username'] . "</li>";
        echo "<li class='linkedin-prof'><b>LinkedIn Profile:</b> " . $user['linkedin_profile'] . "</li>";
        echo "<li class='diet-restrict'><b>Dietary Restrictions:</b> " . $user['diestary_restrictions'] . "</li>";
        echo "</ul></div></details></div>";
      }

      curl_close($curl);
       ?>
    </div>
  </div>

  <script src="/assets/js/index.js"></script>
</body>
</html>
