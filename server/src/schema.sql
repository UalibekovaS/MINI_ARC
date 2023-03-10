DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS testsets;
DROP TABLE IF EXISTS tasklist;

CREATE TABLE "logs" (
	"id"	INTEGER,
	"task_id"	text,
	"user_id"	text,
	"action_sequence"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE testsets (
    id              INTEGER         PRIMARY KEY     AUTOINCREMENT   ,
    user_id         TEXT            NOT NULL                        ,
    test_id         TEXT            NOT NULL                        ,
    testjson        TEXT            NOT NULL                        ,
    approve         BOOLEAN         NOT NULL                        ,
    ratings         INTEGER         NOT NULL                        ,
    Description     TEXT            NOT NULL                        
);

CREATE TABLE tasklist (
    id              INTEGER         PRIMARY KEY     AUTOINCREMENT   ,
    task_name       TEXT            NOT NULL                        ,
    content         TEXT            NOT NULL                        ,
    type            TEXT
);