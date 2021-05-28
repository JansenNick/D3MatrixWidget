CREATE TABLE "myfirstmodule$node" (
	"id" BIGINT NOT NULL,
	"_id" VARCHAR_IGNORECASE(200) NULL,
	PRIMARY KEY("id"));
INSERT INTO "mendixsystem$entity" ("id", 
"entity_name", 
"table_name", 
"remote", 
"remote_primary_key")
 VALUES ('f166e722-6b4d-48a1-952e-93e9240455a9', 
'MyFirstModule.Node', 
'myfirstmodule$node', 
false, 
false);
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('d94bba6d-0e9f-4401-9aef-043d63713fc6', 
'f166e722-6b4d-48a1-952e-93e9240455a9', 
'_ID', 
'_id', 
30, 
200, 
'', 
false);
CREATE TABLE "myfirstmodule$link" (
	"id" BIGINT NOT NULL,
	"sourceid" VARCHAR_IGNORECASE(200) NULL,
	"targetid" VARCHAR_IGNORECASE(200) NULL,
	PRIMARY KEY("id"));
INSERT INTO "mendixsystem$entity" ("id", 
"entity_name", 
"table_name", 
"remote", 
"remote_primary_key")
 VALUES ('e811217e-08d1-400b-95c4-09a2367da0fc', 
'MyFirstModule.Link', 
'myfirstmodule$link', 
false, 
false);
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('be441532-a12b-4d2b-a7b8-2eadfcda36d1', 
'e811217e-08d1-400b-95c4-09a2367da0fc', 
'SourceID', 
'sourceid', 
30, 
200, 
'', 
false);
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('33951d91-1945-4160-bb95-659c88b29605', 
'e811217e-08d1-400b-95c4-09a2367da0fc', 
'TargetID', 
'targetid', 
30, 
200, 
'', 
false);
UPDATE "mendixsystem$version"
 SET "versionnumber" = '4.2', 
"lastsyncdate" = '20210429 14:10:38';
