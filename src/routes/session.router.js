import { Router } from "express";
import UserModel from '../dao/models/user.model.js';

const router = Router();

router.get('/register', (req, res) => {
    res.render('sessions/register')
});

router.post('/register', async(req,res) => {
    const userNew = req.body;
    console.log(userNew);

    const user = new UserModel(userNew);
    await user.save();

    res.redirect('/session/login');
});

router.get('/login', (req, res) => {
    res.render('sessions/login')
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    const user = await UserModel.findOne({email, password}).lean().exec()
    if(!user) {
        return res.status(401).render('errors/base', {
            error: 'Error en email y/o password'
        });
    };
    req.session.user = user;
    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        }else res.redirect('/sessions/login')
    })
})

export default router