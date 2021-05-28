ALTER TABLE "myfirstmodule$node" ADD "nodelabel" VARCHAR_IGNORECASE(200) NULL;
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('102e0390-f49e-4e16-aaea-956755f13fe8', 
'f166e722-6b4d-48a1-952e-93e9240455a9', 
'NodeLabel', 
'nodelabel', 
30, 
200, 
'', 
false);
UPDATE "mendixsystem$version"
 SET "versionnumber" = '4.2', 
"lastsyncdate" = '20210528 13:38:15';
