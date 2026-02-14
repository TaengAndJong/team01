CREATE TABLE staff (
                       staffId VARCHAR(20) PRIMARY KEY,
                       staffName VARCHAR(50) NOT NULL,
                       staffPosition VARCHAR(30) DEFAULT '사원',
                       staffTelNum VARCHAR(20),
                       staffAddr VARCHAR(255),
                       staffAct VARCHAR(1) DEFAULT 'Y' NOT NULL
);