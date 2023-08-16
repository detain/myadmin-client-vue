#!/bin/bash
npm i -g @aivenio/tsc-output-parser;
echo "Running vue-tsc and parsing output into errors.json";
npx vue-tsc --strict --noEmit | npx tsc-output-parser > errors.json;
echo "remapping errors.json";
echo '<?php
$errors = [];
$jsonOpts = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
$json = json_decode(file_get_contents("errors.json"),true);
foreach ($json as $row) {
  $errors[] = [
    "path" => $row["value"]["path"]["value"],
    "line" => $row["value"]["cursor"]["value"]["line"],
    "col" => $row["value"]["cursor"]["value"]["col"],
    "code" => $row["value"]["tsError"]["value"]["errorString"],
    "text" => trim($row["value"]["message"]["value"])
  ];
}
file_put_contents("errors.json", json_encode($errors, $jsonOpts));' | php;
sed -e s#"\({\"path\":\)"#"\n  \1"#g -e s#"}]$"#"}\n]"#g -i errors.json;
echo "done";
