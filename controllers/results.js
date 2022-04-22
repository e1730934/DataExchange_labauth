const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/school.sqlite3');

exports.addResult = async (req,res) => {
    if(!Array.isArray(req.body)) {
        const {student_id, eval_id, note} = req.body;
        db.run(`INSERT INTO results (student_id, eval_id, note)
                VALUES (?, ?, ?)`, [student_id, eval_id, note], (err) => {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {
                res.status(201).json({
                    message: 'Résultat créé'
                });
            }
        });
    }else{
        const results = req.body;
        results.forEach(result => {
            db.run(`INSERT INTO results (student_id, eval_id, note)
                    VALUES (?, ?, ?)`, [result.student_id, result.eval_id, result.note], (err) => {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    res.status(201).json({
                        message: 'Résultats créé'
                    });
                }
            });
        });
    }
}
exports.editResult = async (req, res) => {
    const {eval_id} = req.params;
    const {student_id, note} = req.body;
    db.run(`UPDATE results SET student_id = ?, note = ? WHERE eval_id = ?`, [student_id, note, eval_id], (err) => {
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
exports.deleteResult = async (req, res) => {
    const {eval_id} = req.params;
    db.run(`DELETE FROM results WHERE eval_id = ?`, [eval_id], (err) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.status(201).json({
                message: 'Résultat supprimé'
            });
        }
    });
}
