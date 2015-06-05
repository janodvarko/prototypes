<?php
include 'ChromePhp.php';

ChromePhp::log('Hello console! This is a simple log (from the server)');
//ChromePhp::log($_SERVER);
ChromePhp::warn('This is a warning (from the server)');
ChromePhp::info('This is an info (from the server)');
ChromePhp::error('This is an error (from the server)');

echo "UTC:".time();
?>
