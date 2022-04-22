const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/school.sqlite3');

exports.addStudent = async (req,res) => {
    if(!Array.isArray(req.body)) {
        const {first_name, last_name, email} = req.body;
        db.run('INSERT INTO students (first_name, last_name, email) VALUES (?, ?, ?)', [first_name, last_name, email], (err) => {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {
                res.status(201).json({
                    message: 'Étudiant créé'
                });
            }
        });
    }else{
        const students = req.body;
        students.forEach(student => {
            db.run('INSERT INTO students (first_name, last_name, email) VALUES (?, ?, ?)', [student.first_name, student.last_name, student.email], (err) => {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    res.status(201).json({
                        message: 'Étudiant créé'
                    });
                }
            });
        });
    }
}

exports.editStudent = async (req,res) => {
    const {id} = req.params;
    const {first_name, last_name, email} = req.body;
    db.run('UPDATE students SET first_name = ?, last_name = ?, email = ? WHERE id = ?', [first_name, last_name, email, id], (err) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.status(201).json({
                message: 'Étudiant modifié'
            });
        }
    });
}

exports.deleteStudent = async (req,res) => {
    const {id} = req.params;
    db.run('DELETE FROM results WHERE student_id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            db.run('DELETE FROM students WHERE id = ?', [id], (err) => {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    db.run('DELETE FROM students WHERE id = ?', [id], (err) => {
                        if (err) {
                            res.status(500).json({
                                error: err.message
                            });
                        } else {
                            res.status(201).json({
                                message: 'Étudiant supprimé'
                            });
                        }
                    });
                }
            });
        }
    });

}
