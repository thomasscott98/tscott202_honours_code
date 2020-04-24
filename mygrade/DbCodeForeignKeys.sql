
-- This is the data which is used to create the database tables. 

CREATE TABLE IF NOT EXISTS Students(
    StudentID int NOT NULL AUTO_INCREMENT,
	StudentEmail varchar(50) NOT NULL UNIQUE,
    FirstName varchar(30) NOT NULL,
    LastName varchar(30) NOT NULL,
    Password varchar(255) NOT NULL,
    PRIMARY KEY (StudentID)
);

CREATE TABLE IF NOT EXISTS Lecturers(
    LecturerID int NOT NULL AUTO_INCREMENT,
	LecturerEmail varchar(50) NOT NULL UNIQUE,
    FirstName varchar(30) NOT NULL,
    LastName varchar(30) NOT NULL ,
    Password varchar(255) NOT NULL,
    PRIMARY KEY (LecturerID)
);

CREATE TABLE IF NOT EXISTS Assignments(
    AssignmentID int NOT NULL AUTO_INCREMENT,
    AssignmentName varchar(255) NOT NULL,
    AssignmentDescription varchar(255) NOT NULL,
    MarksAvailable varchar(255) NOT NULL,
    LecturerID int,
    PRIMARY KEY (AssignmentID),
    FOREIGN KEY (LecturerID) REFERENCES Lecturers(LecturerID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AssignmentUploads(
    UploadName varchar(255) NOT NULL,
    StudentID int NOT NULL,
    AssignmentID int NOT NULL,
    FeedbackMethod varchar(255) NOT NULL,
    HideMarks varchar(20) NOT NULL,
    PRIMARY KEY (UploadName),
	FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
	FOREIGN KEY (AssignmentID) REFERENCES Assignments(AssignmentID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS FeedbackDocs(
    FeedbackName varchar(255) NOT NULL,
    Grade varchar(20) NOT NULL,
    Mark varchar(20) NOT NULL,
    StudentID int NOT NULL,
    AssignmentID int NOT NULL,
    LecturerID int NOT NULL,
    PRIMARY KEY (FeedbackName),
    FOREIGN KEY (LecturerID) REFERENCES Lecturers(LecturerID) ON DELETE CASCADE,
	FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
	FOREIGN KEY (AssignmentID) REFERENCES Assignments(AssignmentID) ON DELETE CASCADE
);

