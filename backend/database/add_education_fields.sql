-- Add CGPA, semesters, and core courses fields to education table

ALTER TABLE education 
ADD COLUMN cgpa VARCHAR(10) AFTER description,
ADD COLUMN cgpa_scale VARCHAR(10) AFTER cgpa,
ADD COLUMN semester_completed VARCHAR(50) AFTER cgpa_scale,
ADD COLUMN core_courses TEXT AFTER semester_completed;
