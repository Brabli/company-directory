<?php
  
	$executionStartTime = microtime(true);
  include("config.php");

	header('Content-Type: application/json; charset=UTF-8');
  $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
  
  // Make sure connection was successful
	if (mysqli_connect_errno()) {	
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
  }

  $post_json = file_get_contents('php://input');
  $body = json_decode($post_json, TRUE);

	$name = $body["name"];

	$query = 
	"INSERT INTO location (name)
  VALUES ('${name}');";

	$result = mysqli_query($conn, $query);
  
  // Returns FALSE on failiure, TRUE on success or a mysqli_result object for SELECT.
	if (!$result) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output); 
		exit;
  }

	$output['status']['code'] = "201";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "added successfully";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	
	mysqli_close($conn);
	echo json_encode($output); 
?>