const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/school.sqlite3');

exports.addEval = async (req,res) => {
    if(!Array.isArray(req.body)) {
        const {name} = req.body;
        db.get(`SELECT COUNT(*) FROM evaluation WHERE name= ${name}`, function(error, row) {
            if(row) {
                res.status(400).json({
                    message: "Evaluation already exists"
                })
            } else {
                db.run('INSERT INTO evaluation (name) VALUES (?)', [name], function(error) {
                    if(error) {
                        res.status(400).json({
                            message: error.message
                        })
                    } else {
                        res.status(201).json({
                            message: 'Évaluation créée'
                        })
                    }
                })
            }
        })
    }else{
        const evaluations = req.body;
        evaluations.forEach(evaluation => {
            if (db.run('SELECT * FROM evaluation WHERE name = ?', [evaluation.name]) !== 0) {
                res.status(400).json({
                    message: "Evaluation already exists"
                });
            } else {
                db.run('INSERT INTO evaluation (name) VALUES (?)', [evaluation.name], (err) => {
                    if (err) {
                        res.status(500).json({
                            error: err.message
                        });
                    } else {
                        res.status(201).json({
                            message: 'Évaluation créée'
                        });
                    }
                });
            }
        });
    }
}

exports.editEvaluation = async (req, res) => {

    const {name} = req.body;
    const {id} = req.params;
    db.run('UPDATE evaluation SET name = ? WHERE id = ?', [name, id], (err) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.status(201).json({
                message: 'Évaluation modifiée'
            });
        }
    });
}

exports.delEval = async (req,res) => {
    const {id} = req.params;
    db.run('DELETE FROM results WHERE eval_id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            db.run('DELETE FROM evaluation WHERE id = ?', [id], (err) => {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    res.status(201).json({
                        message: 'Évaluation supprimée'
                    });
                }
            });
        }
    });
}
