exports.registerUser = async (req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password);

    createUser([name,email,password],(err) => {
        if(err) {
            console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        } else {
            res.status(201).json({
                status: 'success',
                message: 'User created successfully'
            });
        }
        findUserByEmail(email,(err,user) =>{
            if(err) return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
            res.status(200).json({
                status: 'success',
                user: user
            });
        })
    });
}
