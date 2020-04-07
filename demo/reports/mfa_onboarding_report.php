<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Passbolt - MFA onboarding report</title>
    <!--
             ____                  __          ____
            / __ \____  _____ ____/ /_  ____  / / /_
           / /_/ / __ `/ ___/ ___/ __ \/ __ \/ / __/
          / ____/ /_/ (__  |__  ) /_/ / /_/ / / /_
         /_/    \__,_/____/____/_.___/\____/_/\__/

        The open source password manager for team
         (c) 2020 Passbolt SA

    -->
    <base href="../../">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="src/img/webroot/favicon.ico" />
    <link rel="icon" href="src/img/webroot/favicon_32.png" sizes="32x32" />
    <link rel="icon" href="src/img/webroot/favicon_57.png" sizes="57x57" />
    <link rel="icon" href="src/img/webroot/favicon_76.png" sizes="76x76" />
    <link rel="icon" href="src/img/webroot/favicon_96.png" sizes="96x96" />
    <link rel="icon" href="src/img/webroot/favicon_128.png" sizes="128x128" />
    <link rel="icon" href="src/img/webroot/favicon_192.png" sizes="192x192" />
    <link rel="icon" href="src/img/webroot/favicon_228.png" sizes="228x228" />
    <link rel="stylesheet" type="text/css" href="src/css/themes/default/api_main.css">
    <script src="src/js/jquery-3.4.1.min.js"></script>
    <script src="src/js/apexcharts.min.js"></script>
    <script src="src/js/report-widgets.js"></script>
</head>
<body class="report report-html">
<div id="container" class="report report-html">
    <div class="grid">
        <div class="row report-header">
            <div class="col6 creator-info">
                <h1>Passbolt report</h1>
                <ul>
                    <li>
                        <span class="label">Report name:</span>
                        <span class="value">MFA Onboarding</span>
                    </li>
                    <li>
                        <span class="label">Generated by:</span>
                        <span class="value">Ada Lovelace</span>
                    </li>
                    <li>
                        <span class="label">Creation date:</span>
                        <span class="value">30th of March 2020</span>
                    </li>
                </ul>
            </div>
            <div class="col6 company-info last">
                <div class="logo">
                    <img src="../../../src/img/logo/logo.png"/>
                </div>
            </div>
        </div>
        <div class="report-content">
            <div class="row description">
                <div class="col12">
                    <p><strong>Description:</strong> This report lorem ipsum lorem ipsum lorem ipsum</p>
                </div>
            </div>
            <div class="row charts">
                <div class="col4">
                    <div class="report-widget gauge">
                        <div class="widget-content" data-value="45" data-textradd="%" data-color="green"></div>
                        <p class="widget-description">Of the users<br>have MFA configured</p>
                    </div>
                </div>
                <div class="col4">
                    <div class="report-widget gauge">
                        <div class="widget-content" data-value="95" data-textradd="%" data-color="green"></div>
                        <p class="widget-description">Of the admins<br>have MFA configured</p>
                    </div>
                </div>
                <div class="col4 last">
                    <div class="report-widget gauge">
                        <div class="widget-content" data-value="5" data-color="red"></div>
                        <p class="widget-description">Users<br>need to configure MFA</p>
                    </div>
                </div>
            </div>
            <div class="row list">
                <div class="col12">
                    <table class="table-info horizontal ">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Active since</th>
                            <th>MFA?</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Ada Lovelace</td>
                            <td>ada@passbolt.com</td>
                            <td>4 days ago</td>
                            <td>No</td>
                            <td>User</td>
                        </tr>
                        <tr>
                            <td>Betty Holberton</td>
                            <td>betty@passbolt.com</td>
                            <td>10 days ago</td>
                            <td>No</td>
                            <td>Admin</td>
                        </tr>
                        <tr>
                            <td>Betty Holberton</td>
                            <td>betty@passbolt.com</td>
                            <td>10 days ago</td>
                            <td>No</td>
                            <td>Admin</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>