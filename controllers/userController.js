const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const auth = require('../auth');

module.exports.register = async (req, res) => {
  	try {
	    const existingUser = await User.findOne({ email: req.body.email });
	    if (existingUser) {
	      	return res.status(400).send({ error: 'Duplicate email. Please use a different email address.' });
	    }

	    if (!req.body.email.includes('@')) {
	      	return res.status(400).send({ error: 'Email is invalid' });
	    } else if (req.body.mobileNo.length !== 11) {
	      	return res.status(400).send({ error: 'Mobile number invalid' });
	    } else if (req.body.password.length < 8) {
	      	return res.status(400).send({ error: 'Password must be at least 8 characters' });
	    }

	    const newUser = new User({
	      	firstName: req.body.firstName,
	      	lastName: req.body.lastName,
	      	email: req.body.email,
	      	mobileNo: req.body.mobileNo,
	      	address: req.body.address,
	      	password: bcrypt.hashSync(req.body.password, 10)
	    });

	    const result = await newUser.save();
	    	return res.status(201).send({ message: 'Registered Successfully' });
  	} catch (err) {
    	return res.status(500).send({ error: 'Error in registration process' });
  	}
};

module.exports.login = async (req, res) => {
  	try {
    	if (req.body.email.includes('@')) {
      		const user = await User.findOne({ email: req.body.email });
	      	if (!user) {
	        	return res.status(404).send({ error: 'No Email Found' });
	     	}
      		const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
      		if (isPasswordCorrect) {
        		return res.status(200).send({ access: auth.createAccessToken(user) });
      		} else {
        		return res.status(401).send({ message: 'Email and password do not match' });
      		}
    	} else {
      		return res.status(400).send({ error: 'Invalid Email' });
    	}
  	} catch (err) {
    	return res.status(500).send({ error: 'Internal Server Error'})
    }
};

module.exports.details = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.password = undefined;
        return res.status(200).send({ user });
    } catch (err) {
        console.error('Failed to fetch user profile:', err);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.getusers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length > 0) {
            return res.status(200).send({ users });
        } else {
            return res.status(200).send({ message: 'No Users Found' });
        }
    } catch (err) {
        console.error('Internal Server Error:', err);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports.updatedetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email, mobileNo, address } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.mobileNo = mobileNo;
        user.address = address;

        const updatedUser = await user.save();

        return res.status(200).json({ message: 'User Updated Successfully' });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.updatepassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.user;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        return res.status(200).json({ message: 'Password Reset Successfully' });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.changetoadmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        user.isAdmin = 'Admin';

        const updatedUser = await user.save();

        return res.status(200).json({ message: 'User is now an admin' });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.removeasadmin = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        user.isAdmin = 'Non-Admin';

        const updatedUser = await user.save();

        return res.status(200).json({ message: 'Admin privileges removed' });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
