<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>JSON Diff @VERSION@</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/main" src="scripts/requirejs/require.js"></script>
    <link rel="stylesheet" href="css/main.css" type="text/css"/>
    <script type="text/javascript">
    require({
        paths: {
            text: "requirejs/text",
            i18n: "requirejs/i18n"
        }
    });
    </script>
</head>
<body class="body">

<!-- Diff Tree -->
<div id="content"></div>

<!-- Helper Trees -->
<table cellspacing="10" cellpadding="0">
<tr>
    <td style="vertical-align: top">
        <h2>Original object:</h2>
        <div id="oldObject"></div>
    </td>
    <td width="50px">&nbsp;</td>
    <td style="vertical-align: top">
        <h2>Modified object:</h2>
        <div id="newObject"></div>
    </td>
    <td width="50px">&nbsp;</td>
    <td style="vertical-align: top">
        <h2>Computed Diff Tree:</h2>
        <div id="differences"></div>
    </td>
</tr>
</table>

</body>
</html>
